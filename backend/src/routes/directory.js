import { Router } from "express"
import { auth } from "../middlewares/session"
import { listDir } from "../filesystem/directory"

const directoryRouter = Router()

directoryRouter.get("/", auth, async (req, res) => {
    const { path = "/" } = req.query
    const { directory, error } = await listDir(req.session.username, path)
    if (error) {
        return res.status(400).json({ error })
    }
    res.status(200).json({ directory })
})

export default directoryRouter
