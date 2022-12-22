import path from "path"
import fs from "fs"

const home_path = path.join(__dirname, "../../home/")

const makeUserDir = (username) => {
    const userPath = path.join(home_path, username)
    fs.mkdir(userPath, (err) => {
        if (err) {
            console.log("mkdir error: ", err.code)
            if (err.code === "EEXIST") return
            throw err
        }
        console.log("mkdir:" + userPath)
    })
}

const listDir = async (username, dirPath) => {
    const directoryPath = path.join(home_path, username, dirPath)
    const relativePath = path.relative(home_path, directoryPath)
    if (!relativePath.startsWith(username)) {
        console.log("invalid path.", relativePath)
        return { error: "invalid path." }
    }
    try {
        const files = await fs.promises.readdir(directoryPath)
        return { files }
    } catch (err) {
        if (err.code === "ENOENT") {
            console.log("invalid path.", directoryPath)
            return { error: "invalid path." }
        }
        throw err
    }
}

export { makeUserDir, listDir }
