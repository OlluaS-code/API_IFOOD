import { ResultSetHeader, RowDataPacket } from 'mysql2';
import connection from '../connection/conection';
import { ProductRepository } from '../Produtos/ProdutoData';

interface IOrderResult {
    pedidoId: number;
    valorTotal: number;
    itens: any[];
}
interface ICartItemDetails extends RowDataPacket {
    produto_ID: number;
    quantity: number;
    price: number;
    name: string;
    storeId: number;
    stock: number;
}

interface DecreaseResult {
    success: boolean;
    affectedRows?: number;
    code?: string;
    message?: string;
}

export const OrderRepository = {

    async createOrder(usuario_ID: number): Promise<IOrderResult | false> {

        const getCartItemsQuery = `
            SELECT
                ci.produto_ID,
                ci.quantity,
                p.price,
                p.name,
                p.storeId,
                p.stock
            FROM Carrinho ci
            JOIN Produto p ON ci.produto_ID = p.produto_ID
            WHERE ci.usuario_ID = ?;
        `;
        const [cartItems] = await connection.execute<ICartItemDetails[]>(getCartItemsQuery, [usuario_ID]);

        if (cartItems.length === 0) {
            return false;
        }

        let valorTotal = 0;
        let finalItems: any[] = [];

        for (const item of cartItems) {
            if (item.stock < item.quantity) {
                throw new Error(`Estoque insuficiente para o Produto ID ${item.produto_ID}. Disponível: ${item.stock}.`);
            }

            const itemTotal = item.price * item.quantity;
            valorTotal += itemTotal;

            finalItems.push({
                produto_ID: item.produto_ID,
                name: item.name,
                quantity: item.quantity,
                price: item.price,
                total: itemTotal
            });
        }

        let pedidoId: number = 0;
        const connectionInstance = await connection.getConnection();

        await connectionInstance.beginTransaction();

        try {
            const insertOrderQuery = 'INSERT INTO Pedido (usuario_ID, valor_total, status) VALUES (?, ?, ?)';
            const [orderResult] = await connectionInstance.execute(insertOrderQuery, [
                usuario_ID,
                valorTotal,
                'CONCLUIDO'
            ]) as [ResultSetHeader, any];

            pedidoId = orderResult.insertId;

            for (const item of cartItems) {
                const stockResult = await ProductRepository.decreaseStock(
                    item.produto_ID,
                    item.quantity,
                    item.storeId
                );

                if (typeof stockResult === 'object' && stockResult.success === false) {
                    throw new Error(stockResult.message || `Falha no processamento do Produto ID ${item.produto_ID}.`);
                }

                let affectedRows = (typeof stockResult === 'number') ? stockResult : stockResult.affectedRows;

                if (affectedRows !== 1) {
                    throw new Error(`Falha de concorrência: Estoque do Produto ID ${item.produto_ID} não pôde ser atualizado.`);
                }
            }

            const clearCartQuery = 'DELETE FROM Carrinho WHERE usuario_ID = ?';
            await connectionInstance.execute(clearCartQuery, [usuario_ID]);

            await connectionInstance.commit();

            return { pedidoId, valorTotal, itens: finalItems };

        } catch (error) {
            await connectionInstance.rollback();
            throw error;
        } finally {
            connectionInstance.release();
        }
    },

    async getOrdersByUser(usuario_ID: number): Promise<any[]> {
        const query = 'SELECT pedido_ID, valor_total, data_pedido, status FROM Pedido WHERE usuario_ID = ? ORDER BY data_pedido DESC';
        const [rows] = await connection.execute<any[]>(query, [usuario_ID]);
        return rows;
    }
};
