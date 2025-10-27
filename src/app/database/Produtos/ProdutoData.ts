import { ICreateProduct } from "../../controller/Produtos/CreateProduct";
import connection from "../connection/conection";
import { ResultSetHeader, RowDataPacket } from 'mysql2';

export interface Products extends RowDataPacket {
    produto_ID: number,
    storeId: number,
    name: string,
    price: number,
    stock: number
}

type DecreaseResult = { success: true; affectedRows: number } | { success: false; code: string; message: string };

export const ProductRepository = {

    async create(userData: ICreateProduct) {

        const { storeId, name, price, stock } = userData;

        console.log('Dados recebidos:', { storeId, name, price, stock });

        const query = 'INSERT INTO Produto (storeId, name, price, stock) VALUES( ?, ?, ?, ?)';

        const [result] = await connection.execute(query, [
            storeId,
            name,
            price,
            stock
        ]) as [ResultSetHeader, any];

        return result.insertId;
    },
    async getAll() {

        const query = 'SELECT * FROM Produto';

        const [rows] = await connection.execute<Products[]>(query);

        return rows;
    },
    async findByStoreId(loja_ID: number): Promise<Products[]> {

        const query = 'SELECT produto_ID, name, price, stock FROM Produto WHERE storeId = ?';

        const [rows] = await connection.execute<Products[]>(query, [loja_ID]);

        return rows;
    },
    async findById(loja_ID: number, produto_ID: number): Promise<Products | undefined>{

        const query = `SELECT * FROM Produto WHERE produto_ID = ? and storeId = ?`;

        const [rows] = await connection.execute<Products[]>(query, [produto_ID, loja_ID]);

        return rows[0];
    },
    async updatePartial(product_ID: number, storeId: number, userData: any): Promise<number> {

        const fieldsToUpdate = Object.keys(userData);
        const values = Object.values(userData);

        if (fieldsToUpdate.length === 0) {
            return 0;
        }

        const setClause = fieldsToUpdate.map(field => `${field} = ?`).join(', ');

        const query = `UPDATE Produto SET ${setClause} WHERE produto_ID = ? AND storeId = ?`;

        values.push(product_ID);
        values.push(storeId);

        const [result] = await connection.execute(query, values as any[]) as [ResultSetHeader, any];

        return result.affectedRows;
    },
    async decreaseStock(produto_ID: number, quantity: number, loja_ID: number): Promise<number | DecreaseResult> {

        const selectQuery = `SELECT stock, storeId FROM Produto WHERE produto_ID = ?`;
        const [rows] = await connection.execute<Products[]>(selectQuery, [produto_ID]);

        const product = rows[0];

        if (!product) {
            return { success: false, code: 'NOT_FOUND', message: `Produto ID ${produto_ID} não encontrado.` };
        }

        if (product.storeId !== loja_ID) {
            return { success: false, code: 'ACCESS_DENIED', message: `Acesso negado. Produto não pertence à Loja ID ${loja_ID}.` };
        }

        if (product.stock < quantity) {
            return { success: false, code: 'INSUFFICIENT_STOCK', message: `Estoque insuficiente. Disponível: ${product.stock}.` };
        }

        const updateQuery = `
            UPDATE Produto
            SET stock = stock - ?
            WHERE produto_ID = ? AND storeId = ? AND stock >= ?
        `;

        const [result] = await connection.execute(updateQuery, [
            quantity,
            produto_ID,
            loja_ID,
            quantity
        ]) as [ResultSetHeader, any];

        return { success: true, affectedRows: result.affectedRows };
    },
    async delete(product_ID: number, storeId: number): Promise<number> {

        const query = `DELETE FROM Produto WHERE product_ID = ? AND storeId = ?`;

        const [result] = await connection.execute(query, [product_ID, storeId]) as [ResultSetHeader, any];

        return result.affectedRows;
    }
};
