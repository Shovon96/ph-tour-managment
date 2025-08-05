import AppError from "../../errorHalpers/AppError";
import { ITourType } from "./tour.interface";
import { Tour, TourType } from "./tour.model";

const createTourType = async (payload: ITourType) => {
    const isExistTourType = await TourType.findOne({ name: payload })
    if (isExistTourType) {
        throw new AppError(400, "This tour type name already exist!")
    }
    const tourType = await TourType.create({ name: payload });
    return tourType
}

const getAllTourTypes = async () => {
    const tourTypes = await TourType.find()
    return tourTypes
}

const updateTourTypes = async (id: string, payload: ITourType) => {
    const isExistTourType = await TourType.findById(id)
    if (!isExistTourType) {
        throw new AppError(400, "This tour type dose not exist!")
    }
    const updateTourTypes = await TourType.findByIdAndUpdate(id, { name: payload }, { new: true })
    return updateTourTypes
}


export const TourService = {
    createTourType,
    getAllTourTypes,
    updateTourTypes
}