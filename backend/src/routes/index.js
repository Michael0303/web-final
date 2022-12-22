import { Router } from "express"
import userRouter from "./user"
import directoryRouter from "./directory"

const router = Router()
router.use("/api/user", userRouter)
router.use("/api/directory", directoryRouter)

export default router
