import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as yup from "yup";
import { OrderRepository } from '../../database/Order/OrderData';
import { validation } from '../../shared/middlewares';

export interface IOrderParams {
    usuario_ID?: number;
}

export const CreateOrderValidation = validation((getSchema) => ({
    params: getSchema<IOrderParams>(yup.object().shape({
        usuario_ID: yup.number().required().moreThan(0)
    })),
}));


export const createOrder = async (req: Request<IOrderParams>, res: Response) => {

    const usuario_ID = Number((req as any).usuario_ID);

    if (!usuario_ID || usuario_ID <= 0) {
         return res.status(StatusCodes.UNAUTHORIZED).json({
            error: 'Usuário não autenticado ou ID inválido. Acesso negado.'
        });
    }

    try {
        const orderResult = await OrderRepository.createOrder(usuario_ID);

        if (orderResult === false) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                error: 'O carrinho está vazio. Adicione produtos para finalizar a compra.'
            });
        }

        return res.status(StatusCodes.CREATED).json({
            message: `Pedido #${orderResult.pedidoId} concluído com sucesso! O carrinho foi esvaziado.`,
            pedidoId: orderResult.pedidoId,
            valorTotal: orderResult.valorTotal,
            itensComprados: orderResult.itens
        });

    } catch (error) {

        if (error instanceof Error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                error: error.message
            });
        }

        console.error('Erro na transação de pedido:', error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: 'Erro interno. A transação falhou e o carrinho não foi esvaziado.'
        });
    }
};
