
export interface IStoreWithoutId {
  name: string;
  category: string;
  address: string;
  phone: string;
}

export const stores: Array<any> = [
    {
        id: 1,
        name: "Loja Fixa de Testes",
        category: "Geral",
        address: "Av. do Teste",
        phone: "55551234"
    }
];

let nextId = 2;

export const StoreRepository = {

    findByID: (id: number) => {
        return stores.find(store => store.id === id);
    },

    create: (storeData: IStoreWithoutId) => {
        const newStore = {
            id: nextId++,
            ...storeData
        };
        stores.push(newStore);
        return newStore;
    },

    getAll: () => {
        return stores;
    },

    update: (id: number, storeData: any) => {
        const index = stores.findIndex(store => store.id === id);

        if (index === -1) {
            return false;
        }

        stores[index] = {
            ...stores[index],
            ...storeData,
            id: id,
        };

        return stores[index];
    },
};
