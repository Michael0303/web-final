import { Router } from "express"
import userRouter from "./user"
import directoryRouter from "./directory"
import fileRouter from "./file"

const router = Router()
router.use("/api/user", userRouter)
router.use("/api/directory", directoryRouter)
router.use("/api/file", fileRouter)

export default router