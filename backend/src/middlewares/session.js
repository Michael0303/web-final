import session from "express-session"
import { SECRET } from "../config"

const useSession = () =>
    session({
        secret: SECRET,
        name: "username",
        saveUninitialized: false,
        resave: true,
    })

const auth = (req, res, next) => {
    if (req.session.username) {
        console.log("authencated.")
        next()
    } else {
        console.log("not authencated.")
        return res.status(400).json({ error: "not authencated." })
    }
}

export { auth, useSession }
