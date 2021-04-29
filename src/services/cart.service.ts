import { Injectable } from "@angular/core";
import { Cart } from "../models/cart";
import { ProdutoDTO } from "../models/produto.dto";
import { StorageService } from "./storage.service";

@Injectable()
export class CartService {

    constructor(public storage: StorageService) {
    }

    createOrClearCart() : Cart {
        let cart: Cart = {items: []}
        this.storage.setCart(cart);
        return cart;
    }

    getCart() : Cart {
        let cart: Cart = this.storage.getCart();

        if (cart == null) {
            cart = this.createOrClearCart();
        }

        return cart;
    }

    addProduto(produto: ProdutoDTO) : Cart {
        let cart = this.getCart();

        let cartProduto = cart.items.find(x => x.produto == produto);

        if (!cartProduto) {
            cart.items.push({quantidade: 1, produto: produto})
        }

        this.storage.setCart(cart);

        return cart;
    }
}