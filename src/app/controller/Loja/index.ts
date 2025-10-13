import * as create from './CreateStore';
import * as getAll from './GetStore';
import * as postProducts from './PostProducts';


export const StoreController = {
    ...create,
    ...getAll,
    ...postProducts,
};
