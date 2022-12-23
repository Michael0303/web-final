import path from "path"
import fs from "fs"

const home_path = path.join(__dirname, "../../home/")

const makeDir = async (path) => {
    fs.mkdir(path, (err) => {
        if (err) {
            console.log("mkdir error: ", err.code)
            if (err.code === "EEXIST") return
            throw err
        }
        console.log("mkdir:" + path)
    })
}

const isLegal = (username, directoryPath) => {
    const relativePath = path.relative(home_path, directoryPath)
    if (!relativePath.startsWith(username)) {
        return false
    }
    return true
}

const makeUserHome = (username) => {
    const userPath = path.join(home_path, username)
    makeDir(userPath)
}

const makeUserDir = async (username, dirPath) => {
    const directoryPath = path.join(home_path, username, dirPath)
    if (!isLegal(username, directoryPath)) {
        console.log("invalid path.", relativePath)
        return { error: "invalid path." }
    }
    try {
        await fs.promises.mkdir(directoryPath, {
            recursive: true,
        })
        return {}
    } catch (err) {
        if (err.code === "EEXIST") return { error: "directory exists." }
        else throw err
    }
}

const listDir = async (username, dirPath) => {
    const directoryPath = path.join(home_path, username, dirPath)
    if (!isLegal(username, directoryPath)) {
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
            console.log("no such directory.", directoryPath)
            return { error: "no such directory." }
        }
        throw err
    }
}

makeDir(home_path) //make home directory

export { makeUserHome, listDir, makeUserDir }
