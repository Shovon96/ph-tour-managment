import AppError from "../../errorHalpers/AppError";
import { QueryBuilder } from "../../utils/queryBuilder";
import { divisionSearchableFields } from "./division.constant";
import { IDivision } from "./division.interface";
import { Division } from "./division.model";
import statusCode from 'http-status-codes'

const createDivision = async (payload: IDivision) => {
    const existingDisvision = await Division.findOne({ name: payload.name })
    if (existingDisvision) {
        throw new AppError(400, "This division name already exist!")
    }

    const division = Division.create(payload)
    return division
}

// const getAllDivisions = async () => {
//     const divisions = await Division.find({})
//     const totalDivisions = await Division.countDocuments()
//     return {
//         data: divisions,
//         meta: { total: totalDivisions }
//     }
// }

const getAllDivisions = async (query: Record<string, string>) => {

    const queryBuilder = new QueryBuilder(Division.find(), query)

    const divisionData = await queryBuilder
        .search(divisionSearchableFields)
        .filter()
        .sort()
        .fields()
        .paginate()

    const [data, meta] = await Promise.all([
        divisionData.build(),
        queryBuilder.getMeta()
    ])

    return {
        data,
        meta
    }
}

const getSingleDivision = async (slug: string) => {
    const division = await Division.findOne({ slug })
    return {
        data: division
    }
}

const updateDivision = async (id: string, payload: Partial<IDivision>) => {
    const existingDisvision = await Division.findById(id)
    if (!existingDisvision) {
        throw new AppError(statusCode.NOT_FOUND, "Division Not Found")
    }

    const duplicateDivision = await Division.findOne({
        name: payload.name,
        _id: { $ne: id }
    })
    if (duplicateDivision) {
        throw new AppError(statusCode.BAD_REQUEST, "A division with this name already exists.");
    }

    const updateDivision = await Division.findByIdAndUpdate(id, payload, { new: true, runValidators: true })
    return updateDivision
}

const deleteDivision = async (id: string) => {
    await Division.findByIdAndDelete(id)
    return null
}

export const DivisionService = {
    createDivision,
    getAllDivisions,
    getSingleDivision,
    updateDivision,
    deleteDivision
}