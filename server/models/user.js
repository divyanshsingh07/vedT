import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: false },
    name: { type: String, required: false },
    photoURL: { type: String, required: false }
}, { timestamps: true });

userSchema.pre("save", async function (next) {
    if (!this.isModified("password") || !this.password) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.comparePassword = async function (candidate) {
    if (!this.password) return false;
    return bcrypt.compare(candidate, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;


