import { IUser } from "./user.interface";
import { User } from "./user.model";

const createUser = async (payload: Partial<IUser>) => {
    const { name, email, password } = payload;
    const user = await User.create({ name, email, password })
    return user
}

export const UserServices = {
    createUser
}