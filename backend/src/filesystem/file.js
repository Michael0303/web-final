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
        console.log(err)
        switch (err.code) {
            case "ENOENT":
                return { error: "no such file." }
            default:
                throw err
        }
    }
}

export { checkFile }
