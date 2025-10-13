

export const products: Array<any> = [];

let nextId = 1;

export const ProductRepository = {

    findByID: (id: number) => {
        return products.find(product => product.id === id);
    },

    create: (productData: any) => {
        const newProduct = {
            id: nextId++,
            ...productData
        };
        products.push(newProduct);
        return newProduct;
    },

    update: (id: number, productData: any) => {
        const index = products.findIndex(product => product.id === id);

        if (index === -1) {
            return false;
        }

        products[index] = {
            ...products[index],
            ...productData,
            id: id,
        };

        return products[index];
    },

    getAll: () => {
        return products;
    },

    decreaseStock: (productId: number, quantity: number) => {
        const index = products.findIndex(product => product.id === productId);

        if (index === -1) {
            return false;
        }

        if (products[index].stock < quantity) {
            return false;
        }

        products[index].stock -= quantity;
        return true;
    },
    delete: (id: number) => {

        const initialLength = products.length;

        const updatedProducts = products.filter(product => product.id !== id);

        const wasDeleted = updatedProducts.length < initialLength;

        if (wasDeleted) {
            const products = updatedProducts;
        }

        return wasDeleted;
    },
};
