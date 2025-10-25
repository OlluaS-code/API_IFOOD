import * as create from './CreateStore';
import * as getAll from './GetStore';
import * as postProducts from './PostProducts';
import * as updateStore from './UpdateStore';
import * as storeByID from './StoreById';

export const StoreController = {
    ...create,
    ...getAll,
    ...postProducts,
    ...updateStore,
    ...storeByID
};
