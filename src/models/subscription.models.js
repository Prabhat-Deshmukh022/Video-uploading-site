import mongoose from "mongoose";

const subsriptionSchema = new mongoose.Schema({
    subsciber: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
},{timestamps: true})

export const Subscription = mongoose.model("Subscription", subsriptionSchema)