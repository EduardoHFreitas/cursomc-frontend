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

  items: ProdutoDTO[] = [];
  page: number = 0;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public produtosService: ProdutoService,
    public loadingController: LoadingController,
  ) {}

  ionViewDidLoad() {
    let categoria_id = this.navParams.get('categoria_id');
    let loader = this.presentLoading();
    this.produtosService.findByCategoria(categoria_id, this.page, 12)
      .subscribe(response => {
          this.items = this.items.concat(response['content']);
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
      if (!item.imageUrl) {
        this.produtosService.getSmallImageFromBucket(item.id)
        .subscribe(response => {
          item.imageUrl = `${API_CONFIG.bucketUrl}/prod${item.id}-small.jpg`;
        },
        error => {
          item.imageUrl = 'assets/imgs/prod.jpg';
        }
        )
      }
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
    this.page = 0;
    this.items = [];
    this.ionViewDidLoad();
    setTimeout(() => {
      event.complete();
    }, 1000);
  }

  doInfinite(event) {
    this.page++;
    this.ionViewDidLoad();
    setTimeout(() => {
      event.complete();
    }, 1000);
  }
}
