import * as create from './CreateProduct';
import * as update from './UpdateProducts';
import * as getAll from './GetAll';
import * as getProduct from './GetProductById';
import * as remove from './DeleteProducts';


export const ProductController = {
    ...create,
    ...update,
    ...getAll,
    ...getProduct,
    ...remove
};
