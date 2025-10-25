import { Router } from "express";

import { UserController } from "../controller";
import { StoreController } from "../controller";
import { CarrinhoController } from "../controller";
import { ProductController } from "../controller";

import { ensureAuthenticated } from "../shared/middlewares/AuthMiddleware";

const router = Router();

// (Usuário e Login) --------------------------------------

router.post(
    '/users',
    UserController.NewUserValidation,
    UserController.NewUser
);

router.post(
    '/login',
    UserController.loginValidation,
    UserController.login
);

router.get(
    '/users',
    UserController.GetAll
);

router.get(
    '/users/:id',
    UserController.FindByIdValidation,
    UserController.FindById
);
//LOJA --------------------------------------------------------

router.post(
    '/stores',
    StoreController.createStoreValidation,
    StoreController.create
);

router.get(
    '/stores',
    StoreController.getAll
);

router.post(
    '/stores/:store_ID/products',
    StoreController.postProductsValidation,
    StoreController.postProducts
);

router.get(
    '/stores/:store_ID',
    StoreController.StoreByIdValidation,
    StoreController.StoreById
);

router.put(
    '/stores/:store_ID',
    StoreController.UpdateStoreValidation,
    StoreController.UpdateStore
);

//CARRINHO (REQUER AUTENTICAÇÃO) -------------------------------

router.post(
    '/cart/:usuario_ID/loja/:storeId',
    ensureAuthenticated,
    CarrinhoController.addToCartValidation,
    CarrinhoController.addToCart
);

router.delete(
    'cart/:usuario_ID/itens/:item_ID',
    ensureAuthenticated,
    CarrinhoController.removeItemByIdValidation,
    CarrinhoController.removeItemById
);

router.get(
    '/cart',
    ensureAuthenticated,
    CarrinhoController.getCart
);

//PEDIDO (REQUER AUTENTICAÇÃO) ---------------------------------

router.post(
    '/users/:usuario_ID/orders',
    ensureAuthenticated,
    UserController.createOrder
);

router.get(
    '/users/:usuario_ID/orders',
    ensureAuthenticated,
    UserController.getOrders
);

//PRODUTO -----------------------------------------------------

router.get(
    '/products/:storeId',
    ProductController.getByStoreIdValidation,
    ProductController.productByStoreId
);

router.put(
    'stores/:storeId/products/:id',
    ProductController.UpdateItemValidation,
    ProductController.updateProducts
);

router.delete(
    'stores/:storeId/products/:id',
    ProductController.deleteProductsValidation,
    ProductController.deleteProducts
);
export default router;
