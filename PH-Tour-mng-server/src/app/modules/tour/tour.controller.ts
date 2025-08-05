import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { TourService } from "./tour.service";

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


export const TourController = {
    createTourType,
    getAllTourTypes,
    updateTourTypes
}