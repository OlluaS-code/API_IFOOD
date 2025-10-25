import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import * as yup from "yup";
import { validation } from "../../shared/middlewares";
import { ProductRepository } from "../../database/Produtos/ProdutoData";


export const getAllProducts = async (req: Request, res: Response) => {

    const productsList = await ProductRepository.getAll();

    return res.status(StatusCodes.OK).json(productsList);
};
