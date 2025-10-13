import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import { Maybe, AnyObject, ObjectSchema, ValidationError } from "yup";


type TProperty = "body" | "header" | "query" | "params";

type TGetSchema = <T extends Maybe<AnyObject>>(schema: ObjectSchema<T>) => ObjectSchema<T>;

type TAllSchemas = Record<TProperty, ObjectSchema<any>>;

type TGetAllSchemas = (getSchema: TGetSchema) => Partial<TAllSchemas>;

type TValidation = (getAllSchemas: TGetAllSchemas) => RequestHandler;

export const validation: TValidation = (getAllSchemas) => async (req, res, next) => {
    const schemas = getAllSchemas((schema) => schema);

    const ErrorResult: Record<string, Record<string, string>> = {};

    Object.entries(schemas).forEach(([key, schema]) => {
        try {
            schema.validateSync(req[key as TProperty], { abortEarly: false });
        } catch (err) {
            const yupError = err as ValidationError;
            const Errors: Record<string, string> = {};

            yupError.inner.forEach(error => {
                if (!error.path) return;
                Errors[error.path] = error.message;
            });
            ErrorResult[key] = Errors;
        }
    });

    const hasNoErrors = Object.entries(ErrorResult).length === 0;

    return hasNoErrors
        ? next()
        : res.status(StatusCodes.BAD_REQUEST).json({ Errors: ErrorResult });
};
