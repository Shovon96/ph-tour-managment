import AppError from "../../errorHalpers/AppError";
import { QueryBuilder } from "../../utils/queryBuilder";
import { tourSerchFields } from "./tour.constant";
import { ITour, ITourType } from "./tour.interface";
import { Tour, TourType } from "./tour.model";

// Tour Type Services

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

const deleteTourType = async (id: string) => {
    const isExistTourType = await TourType.findById(id)
    if (!isExistTourType) {
        throw new AppError(400, "This tour type dose not exist!")
    }
    const deleteTourType = await TourType.findByIdAndDelete(id)
    return deleteTourType
}


// Tour Services

const createTour = async (payload: ITour) => {
    const isExistTour = await Tour.findOne({ title: payload.title })
    if (isExistTour) {
        throw new AppError(400, "This tour with this name already exist!")
    }

    const tour = await Tour.create(payload);
    return tour
}

// const getAllToursOld = async (query: Record<string, string>) => {
//     const filter = query
//     const searchTerm = query.searchTerm || ""
//     const sort = query.sort || "-createdAt"
//     const fields = query.fields?.split(",").join(" ") || ""
//     const page = Number(query.page) || 1
//     const limit = Number(query.limit) || 10
//     const skip = (page - 1) * limit

//     const excludedFields = ["searchTerm", "fields", "sort", "limit", "page"]
//     for (const field of excludedFields) {
//         delete filter[field]
//     }


//     const tourSerchFields = ["title", "description", "location"]
//     const searchQuery = {
//         $or: tourSerchFields.map(field => ({ [field]: { $regex: searchTerm, $options: 'i' } }))
//     }

//     const tours = await Tour.find(searchQuery).find(filter).sort(sort).select(fields).skip(skip).limit(limit)

//     const totalTours = await Tour.countDocuments()
//     const totalPage = Math.ceil(totalTours / limit)

//     const metaData = {
//         page,
//         limit,
//         totalTours,
//         totalPage
//     }

//     return {
//         data: tours,
//         meta: metaData
//     }
// }

const getAllTours = async (query: Record<string, string>) => {

    const queryBuilder = new QueryBuilder(Tour.find(), query)
    // const tours = await queryBuilder.search(tourSerchFields).filter().modelQuery

    const tours = await queryBuilder
        .search(tourSerchFields)
        .filter()
        .sort()
        .fields()
        .paginate()
    // const meta = await queryBuilder.getMeta()

    const [data, meta] = await Promise.all([
        tours.build(),
        queryBuilder.getMeta()
    ])

    return {
        data,
        meta
    }
}

const updateTour = async (id: string, payload: Partial<ITour>) => {
    const isExistTour = await Tour.findById(id)
    if (!isExistTour) {
        throw new AppError(400, "This tour dose not exist!")
    }

    const updateTour = await Tour.findByIdAndUpdate(id, payload, { new: true })
    return updateTour
}

const deleteTour = async (id: string) => {
    const isExistTour = await Tour.findById(id)
    if (!isExistTour) {
        throw new AppError(400, "This tour dose not exist!")
    }
    const deleteTour = await Tour.findByIdAndDelete(id)
    return deleteTour
}

export const TourService = {
    // Tour Type Function
    createTourType,
    getAllTourTypes,
    updateTourTypes,
    deleteTourType,

    // Tour Function
    createTour,
    getAllTours,
    updateTour,
    deleteTour
}