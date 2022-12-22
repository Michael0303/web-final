import { Router } from "express"
import { auth } from "../middlewares/session"
import { makeUserDir, listDir } from "../filesystem/directory"

const directoryRouter = Router()

directoryRouter.get("/", auth, async (req, res) => {
    const { files, error } = await listDir(req.session.username, req.query.path)
    if (error) {
        return res.status(400).json({ error })
    }
    res.status(200).json({ files })
})

directoryRouter.post("/", (req, res) => {
    const username = "leo"
    makeUserDir(username)
})

export default directoryRouter
