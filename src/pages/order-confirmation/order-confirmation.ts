import { listLazyRoutes } from '@angular/compiler/src/aot/lazy_routes';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CartItem } from '../../models/cart-item';
import { ClienteDTO } from '../../models/cliente.dto';
import { EnderecoDTO } from '../../models/endereco.dto';
import { PedidoDTO } from '../../models/pedido.dto';
import { CartService } from '../../services/cart.service';
import { ClienteService } from '../../services/domain/cliente.service';
import { PedidoService } from '../../services/domain/pedido.service';

@IonicPage()
@Component({
  selector: 'page-order-confirmation',
  templateUrl: 'order-confirmation.html',
})
export class OrderConfirmationPage {

  pedido: PedidoDTO;
  cartItems: CartItem[];
  cliente: ClienteDTO;
  endereco: EnderecoDTO;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public cartService: CartService,
    public clienteService: ClienteService,
    public pedidoService: PedidoService,
  ) {

    this.pedido = this.navParams.get('pedido');
  }

  ionViewDidLoad() {
    this.cartItems = this.cartService.getCart().items;
    this.clienteService.findById(this.pedido.cliente.id)
      .subscribe(response => {
          this.cliente = response;
          this.endereco = this.findEnderecos(this.pedido.enderecoDeEntrega.id, this.cliente.enderecos);
        }, 
        error => {
          this.navCtrl.setRoot('HomePage');
        }
      );
  }

  checkout() {
    this.pedidoService.insert(this.pedido)
      .subscribe(response => {
        console.log(response.headers.get('location'));
        this.cartService.createOrClearCart();
      }, error => {
        if (error.status == 403) {
          this.navCtrl.setRoot('HomePage');
        }
      });
  }

  back() {
    this.navCtrl.setRoot('CartPage');
  }

  getTotal() {
    return this.cartService.getTotal();
  }

  private findEnderecos(id: string, enderecos: EnderecoDTO[]) : EnderecoDTO {
    let position = enderecos.findIndex(x => x.id == id);
    return enderecos[position];
  }
}
