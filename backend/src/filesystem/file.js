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
        await fs.promises.stat(userFolderpath)
        await fs.promises.writeFile(
            path.join(userFolderpath, originalname),
            buffer
        )
        return {}
    } catch (err) {
        if (err.code === "ENOENT") return { error: "no such directory." }
        throw err
    }
}

export { checkFile, writeFile }