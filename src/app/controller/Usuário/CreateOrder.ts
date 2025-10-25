import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { OrderRepository } from '../../database/Order/OrderData';


export const createOrder = async (req: Request, res: Response) => {

    const usuario_ID = Number((req as any).usuario_ID);

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

        console.error('Erro na transação de pedido:', error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: 'Erro interno. A transação falhou e o carrinho não foi esvaziado.'
        });
    }
};
