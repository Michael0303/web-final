import { Router } from "express"
import { auth } from "../middlewares/session"
import { upload } from "../middlewares/multer"
import { checkFile, writeFile, deleteFile } from "../filesystem/file"
import User from "../models/user"
import { USAGE_LIMIT } from "../config"

const fileRouter = Router()

fileRouter.get("/", auth, async (req, res) => {
    const { path = "/" } = req.query
    const { userFilePath, error } = await checkFile(req.session.username, path)
    if (error) {
        return res.status(400).json({ error })
    }
    res.status(200).sendFile(userFilePath)
})

fileRouter.post("/upload", auth, upload.single("file"), async (req, res) => {
    console.log("get upload request")
    const { file } = req
    const { path = "/" } = req.query
    const user = await User.findOne({ username: req.session.username }).exec()
    if (user.usage + file.size > USAGE_LIMIT) {
        return res.status(400).json({ error: "usage limit exceeded!" })
    }
    const { error, sizeDiff } = await writeFile(req.session.username, path, file)
    if (error) {
        return res.status(400).json({ error })
    }
    user.usage += sizeDiff
    user.save()
        .then(() => {
            console.log(`change usage of ${user.username} to ${user.usage}`)
        })
        .catch(() => {
            console.log(`changing usage of ${user.username} failed!!`)
        })
    res.status(200).json({ status: "file upload succeeded.", stage: user.usage })
})

fileRouter.delete("/delete", auth, async (req, res) => {
    console.log("get delete request")
    const { path = "/" } = req.body
    const { error, size } = await deleteFile(req.session.username, path)
    if (error) {
        return res.status(400).json({ error })
    }
    const user = await User.findOne({ username: req.session.username }).exec()
    user.usage -= size;
    user.save()
        .then(() => {
            console.log(`change usage of ${user.username} to ${user.usage}`)
        })
        .catch(() => {
            console.log(`changing usage of ${user.username} failed!!`)
        })
    res.status(200).json({ status: "file delete succeeded.", usage: user.usage })
})

export default fileRouter