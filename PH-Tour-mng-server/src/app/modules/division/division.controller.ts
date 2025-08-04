import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { DivisionService } from "./division.service";

const createDivision = catchAsync(async (req: Request, res: Response) => {
    const result = await DivisionService.createDivision(req.body)
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Division created",
        data: result,
    });
})

const getAllDivisions = catchAsync(async (req: Request, res: Response) => {
    const result = await DivisionService.getAllDivisions()
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Get all division retrive successfully!",
        data: result.data,
        meta: result.meta
    });
})

const getSingleDivision = catchAsync(async (req: Request, res: Response) => {
    const slug = req.params.slug
    const result = await DivisionService.getSingleDivision(slug)
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Division retrived successfully!",
        data: result.data
    });
})


export const DivisionController = {
    createDivision,
    getAllDivisions,
    getSingleDivision
}