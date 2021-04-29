import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { CidadeDTO } from '../../models/cidade.dto';
import { ClienteDTO } from '../../models/cliente.dto';
import { EstadoDTO } from '../../models/estado.dto';
import { ClienteService } from '../../services/domain/cliente.service';
import { CidadeService } from '../../services/domain/cidade.service';
import { EstadoService } from '../../services/domain/estado.service';

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  formGroup: FormGroup;
  estados: EstadoDTO[];
  cidades: CidadeDTO[];
  cliente: ClienteDTO;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public cidadeService: CidadeService,
    public estadoService: EstadoService,
    public clienteService: ClienteService,
    public alert: AlertController,
  ) {

    this.formGroup = this.formBuilder.group({
      nome: ['Teste', [Validators.required, Validators.minLength(5), Validators.maxLength(120)]],
      email: ['teste@mail.com', [Validators.required, Validators.email]],
      tipo: ['1', [Validators.required]],
      cpfOuCnpj : ['06134596280', [Validators.required, Validators.minLength(11), Validators.maxLength(14)]],
      senha : ['123', [Validators.required]],
      logradouro : ['Rua Via', [Validators.required]],
      numero : ['25', [Validators.required]],
      complemento : ['Apto 3', []],
      bairro : ['Copacabana', []],
      cep : ['10828333', [Validators.required]],
      telefone1 : ['977261827', [Validators.required]],
      telefone2 : ['', []],
      telefone3 : ['', []],
      estadoId : [null, [Validators.required]],
      cidadeId : [null, [Validators.required]],
    });
  }

  ionViewDidLoad() {
    this.estadoService.findAll()
      .subscribe(response => {
          this.estados = response;
          this.formGroup.controls.estadoId.setValue(this.estados[0].codigo);
          this.updateCidades();
        }, 
        error => {}
      );
  }

  signupUser() {
    this.cliente = {
      id : null,
      nome : this.formGroup.value.nome,
      email : this.formGroup.value.email,
      tipo : this.formGroup.value.tipo,
      cpfOuCnpj : this.formGroup.value.cpfOuCnpj,
      senha : this.formGroup.value.senha,
      telefones : [this.formGroup.value.telefone1, this.formGroup.value.telefone2, this.formGroup.value.telefone3],
      enderecos : [
        {
          logradouro : this.formGroup.value.logradouro,
          numero : this.formGroup.value.numero,
          complemento : this.formGroup.value.complemento,
          bairro : this.formGroup.value.bairro,
          cep : this.formGroup.value.cep,
          cidadeId : this.formGroup.value.cidadeId
        }
      ]
    }

    this.clienteService.insert(this.cliente)
      .subscribe(response => {
          this.showInsertedClient();
        },
        error => {}
      );
  }

  showInsertedClient() {
    let alert = this.alert.create({
      title: 'Sucesso!',
      message: 'Cadastro efetuado',
      enableBackdropDismiss: false,
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            this.navCtrl.pop().catch(e => {
              this.navCtrl.setRoot("HomePage");
            });
          }
        }
      ]
    });
    
    alert.present();
  }

  updateCidades() {
    let estado_id = this.formGroup.value.estadoId;
    this.cidadeService.findAll(estado_id)
      .subscribe(response => {
          this.cidades = response;
          this.formGroup.controls.cidadeId.setValue(null);
        }, 
        error => {}
      );
  }
}
