import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { EnderecoDTO } from '../../models/endereco.dto';
import { PedidoDTO } from '../../models/pedido.dto';
import { CartService } from '../../services/cart.service';
import { ClienteService } from '../../services/domain/cliente.service';
import { StorageService } from '../../services/storage.service';

@IonicPage()
@Component({
  selector: 'page-pick-address',
  templateUrl: 'pick-address.html',
})
export class PickAddressPage {

  enderecos: EnderecoDTO[];
  pedido: PedidoDTO;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public storage: StorageService,
    public cartService: CartService,
    public clienteService: ClienteService,
  ) {}

  ionViewDidLoad() {
    let localUser = this.storage.getLocalUser();

    if (localUser && localUser.email) {
      this.clienteService.findByEmail(localUser.email)
          .subscribe(response => {
            this.enderecos = response['enderecos'];
            this.setInfoPedido(response);
          }, 
          error => {}
        );
    } else {
      this.navCtrl.setRoot('HomePage');
    }
  }

  nextPage(endereco: EnderecoDTO) {
    this.pedido.enderecoDeEntrega = {id: endereco.id};
    this.navCtrl.push('PaymentPage', {pedido: this.pedido})
  }

  setInfoPedido(response) {
    let cart = this.cartService.getCart();

    this.pedido = {
      cliente: {id: response['id']},
      enderecoDeEntrega: null,
      pagamento: null,
      itens: cart.items.map(item => {
        return {
          quantidade: item.quantidade,
          produto: {id: item.produto.id}
        }
      })
    }
  }
}
