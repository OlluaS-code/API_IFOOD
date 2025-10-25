import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as yup from 'yup';
import { validation } from '../../shared/middlewares/Validation';
import { OrderRepository } from '../../database/Order/OrderData';

export interface IOrderParams {
    usuario_ID?: number;
}

export const getOrdersValidation = validation((getSchema) => ({
    params: getSchema<IOrderParams>(yup.object().shape({
        usuario_ID: yup.number().required().defined().moreThan(0),
    })),
}));

export const getOrders = async (req: Request<IOrderParams, {}, {}>, res: Response) => {

    const usuario_ID = Number(req.params.usuario_ID);

    const orders = await OrderRepository.getOrdersByUser(usuario_ID);

    if (orders.length === 0) {
        return res.status(StatusCodes.NOT_FOUND).json({
            error: 'Nenhum pedido encontrado para este usuário.'
        });
    }

    return res.status(StatusCodes.OK).json(orders);
};
