import { Router } from "express"
import User from "../models/user"
import { auth } from "../middlewares/session"

const userRouter = Router()

userRouter.post("/signup", async (req, res) => {
    const { username, password } = req.body
    if (!username || !password) {
        return res.status(400).json({ error: "username or password is empty." })
    }
    const user = await User.findOne({ username })
    if (user) {
        return res.status(400).json({ error: "username exists." })
    }

    const newUser = new User({ username, password })
    if (newUser === (await newUser.save())) {
        res.status(200).json({ status: "signup succeeded." })
    } else {
        res.status(500).json({ error: "something went wrong." })
    }
})

userRouter.post("/login", async (req, res) => {
    const { username, password } = req.body
    if (!username || !password) {
        return res.status(400).json({ error: "username or password is empty." })
    }
    const user = await User.findOne({ username })
    if (!user) {
        return res.status(400).json({ error: "user not found." })
    }
    if (user.password !== password) {
        return res.status(400).json({ error: "wrong password." })
    }
    req.session.username = username
    res.status(200).json({ status: "login succeeded." })
})

userRouter.post("/getPsps", auth, (req, res) => {
    res.status(200).send("pspsps")
})

export default userRouter
