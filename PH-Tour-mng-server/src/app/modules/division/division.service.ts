import AppError from "../../errorHalpers/AppError";
import { IDivision } from "./division.interface";
import { Division } from "./division.model";

const createDivision = async (payload: IDivision) => {
    const existingDisvision = await Division.findOne({ name: payload.name })
    if (existingDisvision) {
        throw new AppError(400, "This division name already exist!")
    }

    const division = Division.create(payload)
    return division
}

const getAllDivisions = async () => {
    const divisions = await Division.find({})
    const totalDivisions = await Division.countDocuments()
    return {
        data: divisions,
        meta: { total: totalDivisions }
    }
}

export const DivisionService = {
    createDivision,
    getAllDivisions
}