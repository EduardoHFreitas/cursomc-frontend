import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { API_CONFIG } from '../../config/api.config';
import { ProdutoDTO } from '../../models/produto.dto';
import { CartService } from '../../services/domain/cart.service';
import { ProdutoService } from '../../services/domain/produto.service';

@IonicPage()
@Component({
  selector: 'page-produto-detail',
  templateUrl: 'produto-detail.html',
})
export class ProdutoDetailPage {

  produto: ProdutoDTO;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public produtosService: ProdutoService,
    public cartService: CartService,
  ) {}

  ionViewDidLoad() {
    let produto_id = this.navParams.get('produto_id');
    this.produtosService.findById(produto_id)
      .subscribe(response => {
          this.produto = response;
          this.getProductImageIfExists();
        },
        error => {}
      )
  }

  getProductImageIfExists() {
    this.produtosService.getSmallImageFromBucket(this.produto.id)
      .subscribe(response => {
        this.produto.imageUrl = `${API_CONFIG.bucketUrl}/prod${this.produto.id}.jpg`;
      },
      error => {}
    )
  }

  addToCart(produto: ProdutoDTO) {
    this.cartService.addProduto(produto);
    this.navCtrl.setRoot('CartPage');
  }

}
