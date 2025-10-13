import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import * as yup from "yup";
import { validation } from "../../shared/middlewares/Validation";
import { CartRepository } from "../../database/Carrinho/CarrinhoData";

export interface IGetCartParams {
    userId?: number;
}

export const getCartValidation = validation((getSchema) => ({
    params: getSchema<IGetCartParams>(yup.object().shape({
        userId: yup.number().required().defined().moreThan(0),
    })),
}));

export const getCart = async (req: Request<IGetCartParams>, res: Response) => {

    const userId = Number(req.params.userId);

    const cartList = CartRepository.getCart(userId);

    return res.status(StatusCodes.OK).json(cartList);
};
