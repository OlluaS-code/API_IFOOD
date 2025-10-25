import * as addItem from './AddToCart';
import * as getCart from './getCart';
import * as removeItem from './RemoveItem';


export const CarrinhoController = {
    ...addItem,
    ...getCart,
    ...removeItem,
};
