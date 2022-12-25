import express from "express"
import cors from "cors"
import path from "path"
import db from "./db"
import routes from "./routes"
import { useSession } from "./middlewares/session"

db.connect()
const app = express()
if (process.env.NODE_ENV !== "production") {
    // app.use(cors())
    var corsOptions = {
        origin: 'http://localhost:3000',
        credentials : true
       }
      
      app.use(cors(corsOptions));
      
      app.use(function (req, res, next) {	
          res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');    
          res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');    
          res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');   
          res.setHeader('Access-Control-Allow-Credentials', true);    
          next();
      });
}
app.use(express.json())
app.use(useSession())
app.use("/", routes)
// app.use("/", (req, res, next) => {
//     var options = {
//         root: path.join(__dirname),
//     }

//     var fileName = "test.txt"
//     res.sendFile(fileName, options, function (err) {
//         if (err) {
//             next(err)
//         } else {
//             console.log("Sent:", fileName)
//             next()
//         }
//     })
// })
// app.use('/', routes)

// if (process.env.NODE_ENV === "production") {
//     const _dirname = path.resolve()
//     app.use(express.static(path.join(_dirname, "../frontend", "build")))
//     app.get("/*", (req, res) => {
//         res.sendFile(path.join(_dirname, "../frontend", "build", "index.html"))
//     })
// }

const port = process.env.PORT || 4000
app.listen(port, () => {
    console.log(`Server is up on port ${port}.`)
})