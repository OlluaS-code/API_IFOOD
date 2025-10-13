

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
