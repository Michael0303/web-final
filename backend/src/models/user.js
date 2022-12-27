import mongoose from "mongoose"

const Schema = mongoose.Schema
const UserSchema = new Schema({
    username: { type: String, required: true, unique: true },
    hashedPassword: { type: String, required: true },
    role: { type: String, required: true },
    usage: { type: Number, default: 0 }
})
const User = mongoose.model("User", UserSchema)

export default User
