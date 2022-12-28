import multer from "multer"

function checkFileType(req, file, cb) {
    // Update file name
    // console.log("before: " + file.originalname)
    file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8')
    // console.log("after: " + file.originalname)
    cb(null, true)
}

const upload = multer({
    fileFilter: checkFileType,
});
export { upload }