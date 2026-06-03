import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { weatherQuerySchema } from "../schemas/weather.schema";

export function errorHandler(
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) {

    console.error(err);

    const validation =
        weatherQuerySchema.safeParse(
            req.query
        );

    if (!validation.success) {
        return res.status(400).json({
            message: "Validation Error",
            errors:
                validation.error.flatten()
        });
    }

    if (err instanceof ZodError) {
        return res.status(400).json({
            message: "Validation Error",
            errors: err.issues
        });
    }

    return res.status(500).json({
        message: "Internal Server Error"
    });
}