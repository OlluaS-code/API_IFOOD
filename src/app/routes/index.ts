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
    '/stores/:storeId/products',
    StoreController.postProductsValidation,
    StoreController.postProducts
);

//CARRINHO (REQUER AUTENTICAÇÃO) -------------------------------

router.post(
    '/cart',
    ensureAuthenticated,
    CarrinhoController.addToCartValidation,
    CarrinhoController.addToCart
);

router.delete(
    '/cart/:id',
    ensureAuthenticated,
    CarrinhoController.removeItemValidation,
    CarrinhoController.removeItem
);

router.get(
    '/cart',
    ensureAuthenticated,
    CarrinhoController.getCart
);

//PEDIDO (REQUER AUTENTICAÇÃO) ---------------------------------

router.post(
    '/orders',
    ensureAuthenticated,
    UserController.createOrder
);

router.get(
    '/orders',
    ensureAuthenticated,
    UserController.getOrders
);

//PRODUTO -----------------------------------------------------

router.put(
    '/products/:id',
    ProductController.removeItemValidation,
    ProductController.updateProducts
);

router.delete(
    '/products/:id',
    ProductController.deleteProductsValidation, // <--- Valida se o ID existe
    ProductController.deleteProducts
);
export default router;
