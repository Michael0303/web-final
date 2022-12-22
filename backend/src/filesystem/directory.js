import path from "path"
import fs from "fs"

const home_path = path.join(__dirname, "../../home/")

const makeDir = (path) => {
    fs.mkdir(path, (err) => {
        if (err) {
            console.log("mkdir error: ", err.code)
            if (err.code === "EEXIST") return
            throw err
        }
        console.log("mkdir:" + path)
    })
}

const makeUserDir = (username) => {
    const userPath = path.join(home_path, username)
    makeDir(userPath)
}

const listDir = async (username, dirPath) => {
    const directoryPath = path.join(home_path, username, dirPath)
    const relativePath = path.relative(home_path, directoryPath)
    if (!relativePath.startsWith(username)) {
        console.log("invalid path.", relativePath)
        return { error: "invalid path." }
    }
    try {
        const dirents = await fs.promises.readdir(directoryPath, {
            withFileTypes: true,
        })
        return {
            directory: dirents.map((dirent) => {
                return { name: dirent.name, isDirectory: dirent.isDirectory() }
            }),
        }
    } catch (err) {
        if (err.code === "ENOENT") {
            console.log("invalid path.", directoryPath)
            return { error: "invalid path." }
        }
        throw err
    }
}

makeDir(home_path) //make home directory

export { makeUserDir, listDir }
