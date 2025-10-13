import * as create from './CreateUser';
import * as login from './Login';
import * as order from './CreateOrder';
import * as getOrders from './GetOrders';
import * as getAll from './GetAll';
import * as findById from './GetById';


export const UserController = {
    ...create,
    ...login,
    ...order,
    ...getOrders,
    ...getAll,
    ...findById
};
