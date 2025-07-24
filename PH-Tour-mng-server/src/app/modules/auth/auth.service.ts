import AppError from "../../errorHalpers/AppError";
import { IUser } from "../users/user.interface";
import { User } from "../users/user.model";
import statusCode from "http-status-codes";
import bcrypt from 'bcryptjs'

const credentialsLogin = async (payload: Partial<IUser>) => {
    const { email, password } = payload;
    const isUserExist = await User.findOne({ email })

    if (!isUserExist) {
        throw new AppError(statusCode.BAD_REQUEST, "User Does Not Exist")
    }

    const isPasswordMatched = await bcrypt.compare(password as string, isUserExist.password as string)
    if(!isPasswordMatched){
        throw new AppError(statusCode.BAD_REQUEST, "Password is wrong!")
    }
    
    return { email: isUserExist.email}
}

export const AuthService = {
    credentialsLogin
}