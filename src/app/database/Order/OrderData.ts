

export const Orders: Array<any> = [];

export const OrderRepository = {

    create: (orderData: any) => {
        Orders.push(orderData);
        return orderData;
    },
    getOrdersByUser: (userId: number) => {
        return Orders.filter(order => order.userId === userId);
    }
};
