import path from "path"
import fs from "fs"
import Link from "../models/link"

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
    console.log(directoryPath)
    if (!isLegal(username, directoryPath)) {
        console.log("invalid path.", relativePath)
        return { error: "invalid path." }
    }
    try {
        const createdDir = await fs.promises.mkdir(directoryPath, {
            recursive: true,
        })
        console.log("created")
        console.log(createdDir)
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

const checkDir = async (username, dirPath) => {
    const userDirPath = path.join(home_path, username, dirPath)
    const relativePath = path.relative(home_path, userDirPath)
    if (!relativePath.startsWith(username)) {
        console.log("invalid path.", relativePath)
        return { error: "invalid path." }
    }
    try {
        const stat = await fs.promises.stat(userDirPath)
        if (stat.isFile()) return { error: "path is file." }
        return { userDirPath }
    } catch (err) {
        switch (err.code) {
            case "ENOENT":
                return { error: "no such directory." }
            default:
                throw err
        }
    }
}


// ref: https://stackoverflow.com/questions/30448002/how-to-get-directory-size-in-node-js-without-recursively-going-through-directory
const dirSize = async (dir) => {
    // const dir = path.join(home_path, username)
    // const relativePath = path.relative(home_path, dir)
    // if (!isLegal(username, dir)) {
    //     console.log("invalid path.", relativePath)
    //     return { error: "invalid path." }
    // }

    const files = await fs.promises.readdir(dir, { withFileTypes: true });
    const paths = files.map(async file => {
        const _path = path.join(dir, file.name);

        if (file.isDirectory()) {
            return await dirSize(_path);
        }

        if (file.isFile()) {
            const { size } = await fs.promises.stat(_path);

            return size;
        }

        return 0;
    });

    return (await Promise.all(paths)).flat(Infinity).reduce((i, size) => i + size, 0);
}

const userDirSize = async (username) => {
    const dir = path.join(home_path, username)
    return await dirSize(dir)
}

const deleteDir = async (username, dirPath) => {
    const directoryPath = path.join(home_path, username, dirPath)
    if (!isLegal(username, directoryPath)) {
        console.log("invalid path.", relativePath)
        return { error: "invalid path." }
    }
    try {
        await fs.promises.rm(directoryPath, { recursive: true });
        return {}
    } catch (err) {
        if (err.code === "ENOENT") {
            console.log("no such directory.", directoryPath)
            return { error: "no such directory." }
        }
        throw err
    }
}

const moveDir = async (username, oldpath, target, dst) => {
    const oldPath = path.join(home_path, username, oldpath, target)
    const dstPath = path.join(home_path, username, dst, target)
    if (!isLegal(username, oldPath) || !isLegal(username, dstPath)) {
        return { error: "invalid path." }
    }
    try {
        console.log(`move ${oldPath} to ${dstPath}`)
        await fs.promises.rename(oldPath, dstPath)
        return {}
    } catch (err) {
        console.log(err)
        throw err
    }
}

const shareDir = async (username, target) => {
    const targetPath = path.join(home_path, username, target)
    if (!isLegal(username, targetPath)) {
        return { error: "invalid path." }
    }
    try {
        console.log(`sharing ${targetPath}`)
        const newLink = await new Link({
            target: targetPath
        }).save()
        return {
            link: newLink._id
        }
    } catch (err) {
        console.log(err)
        throw err
    }
}

makeDir(home_path) //make home directory

export { makeUserHome, listDir, makeUserDir, userDirSize, checkDir, deleteDir, moveDir, shareDir }