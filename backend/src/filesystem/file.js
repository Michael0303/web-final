import path from "path"
import fs from "fs"

const home_path = path.join(__dirname, "../../home/")

const checkFile = async (username, filePath) => {
    const userFilePath = path.join(home_path, username, filePath)
    const relativePath = path.relative(home_path, userFilePath)
    if (!relativePath.startsWith(username)) {
        console.log("invalid path.", relativePath)
        return { error: "invalid path." }
    }
    try {
        const stat = await fs.promises.stat(userFilePath)
        if (stat.isDirectory()) return { error: "path is directory." }
        return { userFilePath }
    } catch (err) {
        switch (err.code) {
            case "ENOENT":
                return { error: "no such file." }
            default:
                throw err
        }
    }
}

const writeFile = async (username, folderPath, multerFile) => {
    if (!multerFile) return { error: "no file attached." }
    const { originalname, buffer } = multerFile
    const userFolderpath = path.join(home_path, username, folderPath)
    const relativePath = path.relative(home_path, userFolderpath)
    if (!relativePath.startsWith(username)) {
        console.log("invalid path.", relativePath)
        return { error: "invalid path." }
    }
    try {
        const dirents = await fs.promises.readdir(userFolderpath, { withFileTypes: true })
        const targetDirent = dirents.find((dirent)=> dirent.name === originalname)
        if (targetDirent && targetDirent.isDirectory()) {
            return { error: "path is a directory." }
        }
        const originalSize = targetDirent ?
             (await fs.promises.stat(path.join(userFolderpath, originalname))).size : 0
        await fs.promises.writeFile(
            path.join(userFolderpath, originalname),
            buffer
        )
        return { sizeDiff: multerFile.size - originalSize }
    } catch (err) {
        if (err.code === "ENOENT") return { error: "no such directory." }
        throw err
    }
}

const deleteFile = async (username, filePath) => {
    const userFilePath = path.join(home_path, username, filePath)
    const relativePath = path.relative(home_path, userFilePath)
    if (!relativePath.startsWith(username)) {
        console.log("invalid path.", relativePath)
        return { error: "invalid path." }
    }
    try{
        const { size } = await fs.promises.stat(userFilePath)
        await fs.promises.rm(userFilePath)
        return { size }
    }catch(err){
        switch (err.code) {
            case "ENOENT":
                return { error: "no such file." }
            default:
                throw err
        }
    }
}

export { checkFile, writeFile, deleteFile }
