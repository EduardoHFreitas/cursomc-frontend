import { Component } from '@angular/core';
import { IonicPage, MenuController, NavController } from 'ionic-angular';
import { CredenciaisDTO } from '../../models/credentiais.dto';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  credential: CredenciaisDTO = {
    email: "",
    senha: ""
  }

  constructor(public navCtrl: NavController, public menu: MenuController) {
  }

  ionViewWillEnter() {
    this.menu.swipeEnable(false);
  }
  
  ionViewDidLeave() {
    this.menu.swipeEnable(true);
  }

  login() {
    console.log(this.credential)
    this.navCtrl.setRoot("CategoriasPage");
  }
}
