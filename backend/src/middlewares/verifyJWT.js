import Jwt from "jsonwebtoken"
import _ from "lodash"
import { SECRET } from "../config"

const verifyJwt = async (token) => {
    if (!token) {
        return Promise.reject(new Error("No JWT token"))
    }
    const decoded = Jwt.decode(token, SECRET)
    return decoded
}

const verify = () => {
    return (req, res, next) => {
        const token = req.header("Authorization").replace("Bearer ", "")
        verifyJwt(token)
            .then((decoded) => {
                console.log("decoded", decoded)
                next()
            })
            .catch(next)
    }
}

export default verify
