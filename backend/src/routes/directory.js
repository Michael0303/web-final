import { Router } from "express"
import { auth } from "../middlewares/session"
import { listDir, makeUserDir, checkDir, deleteDir, moveDir, shareDir } from "../filesystem/directory"
import { zip } from 'zip-a-folder';
import fs from "fs"
import path from "path";
import User from "../models/user"
const zipPath = path.join(__dirname, "../../home/", "download.zip")
const directoryRouter = Router()

directoryRouter.get("/", auth, async (req, res) => {
    const { path = "/" } = req.query
    const { directory, error } = await listDir(req.session.username, path)
    if (error) {
        return res.status(400).json({ error })
    }
    res.status(200).json({ status: "directory information got.", directory })
})

directoryRouter.post("/create", auth, async (req, res) => {
    const { path } = req.body
    const { error } = await makeUserDir(req.session.username, path)
    if (error) {
        return res.status(400).json({ error })
    }
    res.status(200).json({ status: "directory creation succeeded." })
})

directoryRouter.get("/download", auth, async (req, res) => {
    const { path = "/" } = req.query
    const { userDirPath, error } = await checkDir(req.session.username, path)
    if (error) {
        return res.status(400).json({ error })
    }
    console.log("zipping dir: " + userDirPath)
    await zip(userDirPath, zipPath)
    res.status(200).sendFile(zipPath)
    try {
        await fs.promises.rm(zipPath)
    } catch (err) {
        console.log(err)
    }
})

directoryRouter.delete("/delete", auth, async (req, res) => {
    console.log("get delete request")
    const { path = "/" } = req.body
    const { error, size } = await deleteDir(req.session.username, path)
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
    res.status(200).json({ status: "directory delete succeeded." })
    // const {error} = await deleteFile(req.session.username,path)
})

directoryRouter.post("/move", auth, async (req, res) => {
    const { path = "/", target, dst = "/" } = req.body
    console.log(`try move ${target} from ${path} to ${dst}`)
    const { error } = await moveDir(req.session.username, path, target, dst)
    if (error) {
        return res.status(400).json({ error })
    }
    res.status(200).json({ status: "directory move succeeded." })
})

directoryRouter.post("/share", auth, async (req, res) => {
    const { path = "/" } = req.body
    console.log(`try sharing ${path}`)
    const { link, error } = await shareDir(req.session.username, path)
    if (error) {
        return res.status(400).json({ error })
    }
    res.status(200).json({ link, status: "sharing succeeded." })
})

export default directoryRouter