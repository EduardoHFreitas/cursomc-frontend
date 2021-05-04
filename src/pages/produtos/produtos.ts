import { Component } from '@angular/core';
import { IonicPage, LoadingController, NavController, NavParams } from 'ionic-angular';
import { API_CONFIG } from '../../config/api.config';
import { ProdutoDTO } from '../../models/produto.dto';
import { ProdutoService } from '../../services/domain/produto.service';


@IonicPage()
@Component({
  selector: 'page-produtos',
  templateUrl: 'produtos.html',
})
export class ProdutosPage {

  items: ProdutoDTO[];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public produtosService: ProdutoService,
    public loadingController: LoadingController,
  ) {}

  ionViewDidLoad() {
    let categoria_id = this.navParams.get('categoria_id');
    let loader = this.presentLoading();
    this.produtosService.findByCategoria(categoria_id)
      .subscribe(response => {
          this.items = response['content'];
          loader.dismiss();
          this.getProductImageIfExists();
        },
        error => {
          loader.dismiss();
        }
      )
  }

  getProductImageIfExists() {
    for (var i = 0; i <this.items.length; i++) {
      let item = this.items[i]
      this.produtosService.getSmallImageFromBucket(item.id)
        .subscribe(response => {
          item.imageUrl = `${API_CONFIG.bucketUrl}/prod${item.id}-small.jpg`;
        },
        error => {}
      )
    }
  }

  showDetail(produto_id: string) {
    this.navCtrl.push('ProdutoDetailPage', {produto_id: produto_id});
  }

  presentLoading() {
    let loader = this.loadingController.create({
      content: "Aguarde..."
    });
    loader.present();

    return loader;
  }

  doRefresh(event) {
    this.ionViewDidLoad();
    setTimeout(() => {
      event.complete();
    }, 1000);
  }
}
