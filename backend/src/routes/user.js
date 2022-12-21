import { Router } from "express"
import Jwt from "jsonwebtoken"
import User from "../models/user"
import { SECRET } from "../config"
import verify from "../middlewares/verifyJWT"
import ms from "ms"

const userRouter = Router()

userRouter.post("/signup", async (req, res) => {
    const { username, password } = req.body
    if (!username || !password) {
        res.status(400).json({ error: "username or password is empty." })
        return
    }
    const user = await User.findOne({ username })
    if (user) {
        res.status(400).json({ error: "username exists." })
        return
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
        res.status(400).json({ error: "username or password is empty." })
        return
    }
    const user = await User.findOne({ username })
    if (!user) {
        res.status(400).json({ error: "user not found." })
        return
    }
    if (user.password !== password) {
        res.status(400).json({ error: "wrong password." })
        return
    }
    const EXPIRE_IN = ms("10s")
    console.log("date", new Date())
    const token = Jwt.sign({ username }, SECRET, { expiresIn: EXPIRE_IN })
    res.cookie("token", token, { maxAge: EXPIRE_IN, httpOnly: true })
    res.status(200).json({ status: "login succeded.", token })
})

userRouter.post("/getPsps", verify(), (req, res) => {
    res.status(200).send("pspsps")
})

export default userRouter
