import { ICreateStoreBody } from "../../controller/Loja/CreateStore";
import connection from "../connection/conection";
import { ResultSetHeader, RowDataPacket } from 'mysql2';

export interface IStoreWithoutId extends RowDataPacket {
    name: string;
    category: string;
    address: string;
    phone: string;
}

export const StoreRepository = {

    async create(userData: ICreateStoreBody) {

        const { name, category, address, phone } = userData;

        console.log('Dados recebidos:', { name, category, address, phone });

        const query = 'INSERT INTO Loja (name, category, address, phone) VALUES( ?, ?, ?, ?)';

        const [result] = await connection.execute(query, [
            name,
            category,
            address,
            phone
        ]) as [ResultSetHeader, any];

        return result.insertId;
    },
    async getAll() {

        const query = 'SELECT * FROM Loja';

        const [rows] = await connection.execute<IStoreWithoutId[]>(query);

        return rows;
    },
    async findById(id: number) {

        const query = 'SELECT * FROM Loja WHERE loja_ID = ?';

        const [rows] = await connection.execute<IStoreWithoutId[]>(query, [id]);

        console.log(`Buscando ID ${id}. Linhas retornadas:`, rows.length);
        console.log('Resultado [0]:', rows[0]);

        return rows[0];
    },
    async updatePartial(loja_ID: number, userData: any): Promise<number> {

        const fieldsToUpdate = Object.keys(userData);
        const values = Object.values(userData);

        if (fieldsToUpdate.length === 0) {
            return 0;
        }

        const setClause = fieldsToUpdate.map(field => `${field} = ?`).join(', ');

        const query = `UPDATE Loja SET ${setClause} WHERE loja_ID = ?`;

        values.push(loja_ID);

        const [result] = await connection.execute(query, values as any[]) as [ResultSetHeader, any];


        return result.affectedRows;
    }
};
