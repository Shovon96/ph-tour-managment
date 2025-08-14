import z from "zod";
import { IsActive, Role } from "./user.interface";

export const createUserZodSchema = z.object({
    name: z.string(),
    email: z.string().email({ message: "Invalid email address format" }),
    password: z.string()
        .min(8, { message: "Password must be 8 character" })
        .regex(/^(?=.*[A-Z])/, {
            message: "Password must contain at least 1 uppercase letter.",
        })
        .regex(/^(?=.*[!@#$%^&*])/, {
            message: "Password must contain at least 1 special character.",
        })
        .regex(/^(?=.*\d)/, {
            message: "Password must contain at least 1 number.",
        }),
    phone: z.string()
        .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
            message: "Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
        })
        .optional(),
    address: z.string()
        .max(80, { message: "Address cannot exceed 200 characters." })
        .optional()
})


export const updateUserZodSchema = z.object({
    name: z.string().optional(),
    // password: z.string()
    //     .min(8, { message: "Password must be 8 character" })
    //     .regex(/^(?=.*[A-Z])/, {
    //         message: "Password must contain at least 1 uppercase letter.",
    //     })
    //     .regex(/^(?=.*[!@#$%^&*])/, {
    //         message: "Password must contain at least 1 special character.",
    //     })
    //     .regex(/^(?=.*\d)/, {
    //         message: "Password must contain at least 1 number.",
    //     }).optional(),
    phone: z.string()
        .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
            message: "Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
        })
        .optional(),
    role: z.enum(Object.values(Role) as [string]).optional(),
    isActive: z.enum(Object.values(IsActive) as [string]).optional(),
    isDeleted: z.boolean().optional(),
    isVerified: z.boolean().optional(),
    address: z.string()
        .max(80, { message: "Address cannot exceed 200 characters." })
        .optional()
})