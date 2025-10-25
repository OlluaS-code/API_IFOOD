import connection from "../connection/conection";
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { ICreateUser } from "../../controller/Usuário/CreateUser";

export interface Users extends RowDataPacket {
    usuario_ID: number;
    name: string;
    phone?: string;
    adress: string;
    email: string;
}


export const UserRepository = {

async create(userData: ICreateUser) {

    const { name, phone, adress, email, password } = userData;

    const telefoneValue = phone === undefined ? null : phone;

    console.log('Dados recebidos:', { name, phone: telefoneValue, adress, email, password });

    const query = 'INSERT INTO usuarios (name, phone, adress, email, password) VALUES( ?, ?, ?, ?, ?)';

    const [result] = await connection.execute(query, [
        name,
        telefoneValue,
        adress,
        email,
        password
    ]) as [ResultSetHeader, any];

    return result.insertId;
},
async getAll(){

    const query = 'SELECT * FROM usuarios';

    const [rows] = await connection.execute<Users[]>(query);

    return rows;
},
async findById(id: number) {

    const query = 'SELECT usuario_ID, name, phone, adress, email FROM usuarios WHERE usuario_ID = ?';

    const [rows] = await connection.execute<Users[]>(query, [id]);

    console.log(`Buscando ID ${id}. Linhas retornadas:`, rows.length);
    console.log('Resultado [0]:', rows[0]);

    return rows[0];
},
async findByEmail(email: string) {

    const query = 'SELECT * FROM usuarios WHERE email = ?';

    const [rows] = await connection.execute<Users[]>(query, [email]);

    return rows[0];
}
};

/*
export const Users: Array<any> = [];

export const UserRepository = {
    create: (userData: any) => {
        Users.push(userData);

        return userData;
    },
    getAll: () => {
        return Users;
    },
    findById: (id: number) => {

        return Users.find(U => U.id === id);
    },
    findByEmail: (email: string) => {
        return Users.find(user => user.email === email);
    }

};
*/
