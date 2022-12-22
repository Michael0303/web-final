import { Router } from "express"
import { auth } from "../middlewares/session"
import { checkFile } from "../filesystem/file"

const fileRouter = Router()

fileRouter.get("/", auth, async (req, res) => {
    const { path = "/" } = req.query
    const { userFilePath, error } = await checkFile(req.session.username, path)
    if (error) {
        return res.status(400).json({ error })
    }
    res.status(200).sendFile(userFilePath)
})

export default fileRouter
