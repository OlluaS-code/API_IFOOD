import { ResultSetHeader, RowDataPacket } from 'mysql2';
import connection from '../connection/conection';

interface IOrderResult {
    pedidoId: number;
    valorTotal: number;
    itens: any[];
}
interface IOrderDetails extends RowDataPacket {
    pedido_ID: number;
    valor_total: number;
    data_pedido: Date;
    status: string;
}

export const OrderRepository = {

    async createOrder(usuario_ID: number): Promise<IOrderResult | false> {

        const getCartItemsQuery = `
            SELECT produto_ID, quantity
            FROM Carrinho
            WHERE usuario_ID = ?;
        `;
        const [cartItems] = await connection.execute<IOrderDetails[]>(getCartItemsQuery, [usuario_ID]);

        if (cartItems.length === 0) {
            return false;
        }

        let valorTotal = 0;
        let finalItems: any[] = [];

        for (const item of cartItems) {
            const [productRows] = await connection.execute<any[]>(
                'SELECT price, name FROM Produto WHERE produto_ID = ?',
                [item.produto_ID]
            );
            const product = productRows[0];

            if (!product) {
                throw new Error(`Produto ID ${item.produto_ID} não encontrado.`);
            }

            const itemTotal = product.price * item.quantity;
            valorTotal += itemTotal;

            finalItems.push({
                produto_ID: item.produto_ID,
                name: product.name,
                quantity: item.quantity,
                price: product.price,
                total: itemTotal
            });
        }

        let pedidoId: number = 0;

        await connection.beginTransaction();

        try {
            const insertOrderQuery = 'INSERT INTO Pedido (usuario_ID, valor_total, status) VALUES (?, ?, ?)';
            const [orderResult] = await connection.execute(insertOrderQuery, [
                usuario_ID,
                valorTotal,
                'CONCLUIDO'
            ]) as [ResultSetHeader, any];

            pedidoId = orderResult.insertId;

            const clearCartQuery = 'DELETE FROM Carrinho WHERE usuario_ID = ?';
            await connection.execute(clearCartQuery, [usuario_ID]);

            await connection.commit();

            return { pedidoId, valorTotal, itens: finalItems };

        } catch (error) {
            await connection.rollback();
            throw error;
        }
    },
    async getOrdersByUser(usuario_ID: number): Promise<IOrderDetails[]> {
        const query = 'SELECT pedido_ID, valor_total, data_pedido, status FROM Pedido WHERE usuario_ID = ? ORDER BY data_pedido DESC';

        const [rows] = await connection.execute<IOrderDetails[]>(query, [usuario_ID]);

        return rows;
    }
};
