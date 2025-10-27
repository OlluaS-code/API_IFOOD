import { ResultSetHeader, RowDataPacket } from 'mysql2';
import connection from '../connection/conection';

export interface ICartItem extends RowDataPacket {
    item_ID: number;
    usuario_ID: number;
    produto_ID: number;
    quantity: number;
}

export const CartRepository = {

    async getCart(usuario_ID: number): Promise<ICartItem[]> {
        const query = `
            SELECT
                usuario_ID, item_ID, produto_ID, quantity
            FROM Carrinho
            WHERE usuario_ID = ?
        `;
        const [rows] = await connection.execute<ICartItem[]>(query, [usuario_ID]);
        return rows;
    },

    async clearCart(usuario_ID: number): Promise<boolean> {
        const query = 'DELETE FROM Carrinho WHERE usuario_ID = ?';
        const [result] = await connection.execute(query, [usuario_ID]) as [ResultSetHeader, any];

        return result.affectedRows > 0;
    },

    async removeItemById(item_ID: number, usuario_ID: number): Promise<boolean> {
        const query = 'DELETE FROM Carrinho WHERE item_ID = ? AND usuario_ID = ?';
        const [result] = await connection.execute(query, [item_ID, usuario_ID]) as [ResultSetHeader, any];

        return result.affectedRows === 1;
    },

    async addItem(produto_ID: number, usuario_ID: number, quantity: number): Promise<number> {

        const query = `
            INSERT INTO Carrinho (usuario_ID, produto_ID, quantity)
            VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE
                quantity = quantity + VALUES(quantity);
        `;

        const [result] = await connection.execute(query, [usuario_ID, produto_ID, quantity]) as [ResultSetHeader, any];

        return result.insertId;
    }
};
