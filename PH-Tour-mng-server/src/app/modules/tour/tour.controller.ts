import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { TourService } from "./tour.service";

// Tour Type Controller
const createTourType = catchAsync(async (req: Request, res: Response) => {
    const { name } = req.body
    const result = await TourService.createTourType(name)
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Tour type created successfully',
        data: result,
    });
})

const getAllTourTypes = catchAsync(async (req: Request, res: Response) => {
    const result = await TourService.getAllTourTypes()
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Tour types retrived successfully!',
        data: result,
    });
})

const updateTourTypes = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params
    const { name } = req.body
    const result = await TourService.updateTourTypes(id, name)
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Tour type updated successfully!',
        data: result,
    });
})

const deleteTourType = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params
    const result = await TourService.deleteTourType(id)
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Tour type deleted successfully!',
        data: null,
    });
})


// Tour Controller
const createTour = catchAsync(async (req: Request, res: Response) => {
    const result = await TourService.createTour(req.body)
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Tour created successfully',
        data: result,
    });
})

const getAllTours = catchAsync(async (req: Request, res: Response) => {
    const result = await TourService.getAllTours()
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'All Tour Retrived Successfully',
        data: result,
    });
})

const updateTour = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params
    const result = await TourService.updateTour(id, req.body)
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Tour updated successfully!',
        data: result,
    });
})

export const TourController = {
    // Tour Type Function
    createTourType,
    getAllTourTypes,
    updateTourTypes,
    deleteTourType,

    // Tour Function
    createTour,
    getAllTours,
    updateTour
}