import mongoose from "mongoose"
import dotenv from "dotenv-defaults"

export default {
    connect: () => {
        dotenv.config()
        if (!process.env.MONGO_URL) {
            throw "MONGO_URL not found!!"
        }
        mongoose
            .connect(process.env.MONGO_URL, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                dbName: "web_final",
            })
            .then((res) => console.log("mongo db connection created"))
    },
}
