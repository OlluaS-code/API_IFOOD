

export let cartItems: Array<any> = [];

export const CartRepository = {

    getCart: (userId: number) => {
        return cartItems;
    },

    clearCart: () => {
        cartItems = [];
        return true;
    },

    removeItemById: (id: number): boolean => {
        const itemIndex = cartItems.findIndex(item => item.id === id);

        return itemIndex > -1
            ? (cartItems.splice(itemIndex, 1), true)
            : false;
    },

    addItem: (productToAdd: any, quantity: number) => {
        const itemIndex = cartItems.findIndex(item => item.id === productToAdd.id);

        if (itemIndex > -1) {
            cartItems[itemIndex].quantity += quantity;
            return cartItems[itemIndex];
        } else {
            const newItem = {
                id: productToAdd.id,
                name: productToAdd.name,
                price: productToAdd.price,
                quantity: quantity
            };
            cartItems.push(newItem);
            return newItem;
        }
    },
};
