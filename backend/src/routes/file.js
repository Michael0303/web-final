import { Router } from "express"
import { auth } from "../middlewares/session"
import { upload } from "../middlewares/multer"
import { checkFile, writeFile } from "../filesystem/file"

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
    const { error } = await writeFile(req.session.username, path, file)
    if (error) {
        return res.status(400).json({ error })
    }
    res.status(200).json({ status: "file upload succeeded." })
})

export default fileRouter