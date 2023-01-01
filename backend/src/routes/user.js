import { Router } from "express"
import User from "../models/user"
import { userDirSize, makeUserHome } from "../filesystem/directory"
import { auth } from "../middlewares/session"
import bcrypt from "bcryptjs"

const userRouter = Router()

const adminCheck = async (req) => {
    if (!req.session.username) return false
    const user = await User.findOne({ username: req.session.username })
    return (user.role === "ADMIN")
}

const usageUpdate = async () => {
    let allUsers = await User.find({})
    let err = false
    let updateUsers = await Promise.all(allUsers.map(async (user) => {
        user.usage = await userDirSize(user.username)
        // console.log(`update ${user.username}'s usage to ${user.usage}`)
        try {
            await user.save()
        } catch (e) {
            console.log(e)
            err = true
        }
        return user
    }))

    return {
        users: updateUsers,
        error: err ? "update fail" : undefined
    }
}

userRouter.post("/signup", async (req, res) => {
    const { username, password } = req.body
    if (!username || !password) {
        return res.status(400).json({ error: "username or password is empty." })
    }
    const user = await User.findOne({ username })
    if (user) {
        return res.status(400).json({ error: "username exists." })
    }
    let hashedPassword = bcrypt.hashSync(password)
    let role = "USER"
    const newUser = new User({ username, hashedPassword, role })
    if (newUser === (await newUser.save())) {
        res.status(200).json({ status: "signup succeeded." })
    } else {
        res.status(500).json({ error: "something went wrong." })
    }
    makeUserHome(username)
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
    if (!bcrypt.compareSync(password, user.hashedPassword)) {
        return res.status(400).json({ error: "wrong password." })
    }
    req.session.username = username
    console.log("session created")
    delete user.hashedPassword
    res.status(200).json({ user, status: "login succeeded." })
    makeUserHome(username)
})

userRouter.post('/logout', async (req, res) => {
    req.session.destroy(() => {
        console.log('session destroyed')
    })
})

userRouter.get('/admin', async (req, res) => {
    let result = await adminCheck(req)
    if (result) {
        res.status(200).json({ status: "privileged" })
    } else {
        res.status(200).json({ status: "not privileged" })
    }
})

userRouter.post('/usage_refresh', async (req, res) => {
    let { error } = await usageUpdate()
    if (error)
        res.status(400).json({ error: "usage refresh error" })
    else
        res.status(200).json({ status: "usage refresh succeeded" })
})

userRouter.get('/all', async (req, res) => {
    let { users, error } = await usageUpdate()
    if (error) {
        res.status(400).json({ error: "usage refresh error" })
    } else {
        users = users.map((user) => {
            delete user.hashedPassword
            return user
        })
        res.status(200).json({ users, status: "get all users succeeded" })
    }
})

userRouter.post("/getPsps", auth, (req, res) => {
    res.status(200).send("pspsps")
})

export default userRouter