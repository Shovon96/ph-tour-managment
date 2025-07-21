import { model, Schema } from "mongoose"
import { IAuthProvider, IsActive, IUser, Role } from "./user.interface"


const authProviderSchema = new Schema<IAuthProvider>({
    provider: { type: String, required: true },
    providerId: { type: String, required: true }
}, {
    timestamps: false,
    versionKey: false
})

const userSchema = new Schema<IUser>({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, unique: true },
    password: { type: String, required: true, trim: true },
    picture: { type: String },
    address: { type: String },
    isDeleted: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    isActive: {
        type: String,
        enum: Object.values(IsActive),
        default: IsActive.ACTIVE
    },
    role: {
        type: String,
        enum: Object.values(Role),
        default: Role.USER
    },
    auth: [authProviderSchema]
}, {
    timestamps: true,
    versionKey: false
})

export const User = model<IUser>("User", userSchema)
