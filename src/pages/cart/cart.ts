import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { API_CONFIG } from '../../config/api.config';
import { CartItem } from '../../models/cart-item';
import { ProdutoDTO } from '../../models/produto.dto';
import { CartService } from '../../services/cart.service';
import { ProdutoService } from '../../services/domain/produto.service';

@IonicPage()
@Component({
  selector: 'page-cart',
  templateUrl: 'cart.html',
})
export class CartPage {

  items: CartItem[];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public cartService: CartService,
    public produtosService: ProdutoService,
  ) {}

  ionViewDidLoad() {
    let cart = this.cartService.getCart();
    this.items = cart.items;
    this.getProductImageIfExists();
  }

  getProductImageIfExists() {
    for (var i = 0; i <this.items.length; i++) {
      let item = this.items[i]
      this.produtosService.getSmallImageFromBucket(item.produto.id)
        .subscribe(response => {
          item.produto.imageUrl = `${API_CONFIG.bucketUrl}/prod${item.produto.id}-small.jpg`;
        },
        error => {}
      )
    }
  }

  removeItem(produto: ProdutoDTO) {
    this.items = this.cartService.removeProduto(produto).items;
  }

  increaseQuantity(produto: ProdutoDTO) {
    this.items = this.cartService.increaseQuantity(produto).items;
  }

  decreaseQuantity(produto: ProdutoDTO) {
    this.items = this.cartService.decreaseQuantity(produto).items;
  }

  getTotal() : number {
    return this.cartService.getTotal();
  }

  goOn() {
    this.navCtrl.setRoot('CategoriasPage');
  }
}
