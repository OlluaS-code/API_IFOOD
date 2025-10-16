import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { CartRepository } from '../../database/Carrinho/CarrinhoData';
import { OrderRepository } from '../../database/Order/OrderData';
import { ProductRepository } from '../../database/Produtos/ProdutoData';


export const createOrder = async (req: Request, res: Response) => {

    const userId = Number(req.userId);

    const cart = CartRepository.getCart(userId);

    if (cart.length === 0) {
        return res.status(StatusCodes.BAD_REQUEST).json({ error: 'O carrinho está vazio. Adicione produtos para finalizar a compra.' });
    }

    for (const item of cart) {
        const stockUpdated = ProductRepository.decreaseStock(item.id, item.quantity);

        if (!stockUpdated) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                error: `Falha ao processar produto ID ${item.id}. Estoque insuficiente ou produto não existe.`
            });
        }
    }


    const totalValue = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const orderData = {
        id: Date.now(),
        userId: userId,
        items: cart,
        total: totalValue,
        status: 'Processando Pagamento',
        createdAt: new Date(),
    };

    const newOrder = OrderRepository.create(orderData);
    CartRepository.clearCart();


    return res.status(StatusCodes.CREATED).json({
        message: `Pedido #${newOrder.id} realizado com sucesso!`,
        order: newOrder,
        total: totalValue
    });
};
