import { Router } from "express"
import { auth } from "../middlewares/session"
import { listDir, makeUserDir, checkDir, deleteDir } from "../filesystem/directory"
import { zip } from 'zip-a-folder';
import fs from "fs"
import path from "path";
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
    // fs.unlink(zipPath)
})

directoryRouter.delete("/delete", auth, async (req, res) => {
    console.log("get delete request")
    const { path = "/" } = req.body
    const {error} = await deleteDir(req.session.username,path)
    if (error) {
        return res.status(400).json({ error })
    }
    res.status(200).json({ status: "directory delete succeeded." })
    // const {error} = await deleteFile(req.session.username,path)
})


export default directoryRouter