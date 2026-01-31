import mongoose from "mongoose";
import bcrypt from "bcrypt";

const adminSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    name: { type: String, required: true }
}, { timestamps: true });

adminSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

adminSchema.methods.comparePassword = async function (candidate) {
    return bcrypt.compare(candidate, this.password);
};

const Admin = mongoose.model("Admin", adminSchema);
export default Admin;
