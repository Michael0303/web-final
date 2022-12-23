import { Router } from "express"
import { auth } from "../middlewares/session"
import { listDir, makeUserDir } from "../filesystem/directory"

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

export default directoryRouter
