import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { API_CONFIG } from '../../config/api.config';
import { ClienteDTO } from '../../models/cliente.dto';
import { ClienteService } from '../../services/domain/cliente.service';
import { ImageUtilService } from '../../services/image-util-service';
import { StorageService } from '../../services/storage.service';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  cliente: ClienteDTO;
  picture: string;
  profileImage;
  disableCamera: boolean = false;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public storage: StorageService,
    public clienteService: ClienteService,
    public camera: Camera,
    public imageUtilService: ImageUtilService,
    public sanitizer: DomSanitizer,
  ) {
    this.profileImage = 'assets/imgs/avatar-blank.png';
  }

  ionViewDidLoad() {
    this.disableCamera = false;
    let localUser = this.storage.getLocalUser();

    if (localUser && localUser.email) {
      this.clienteService.findByEmail(localUser.email)
        .subscribe(response => {
            this.cliente = response;
            this.getProfileImageIfExists();
          }, 
          error => {
            if (error.status == 403) {
              this.navCtrl.setRoot('HomePage');
            }
          }
        );
    } else {
      this.navCtrl.setRoot('HomePage');
    }
  }

  getProfileImageIfExists() {
    this.clienteService.getProfileImageFromBucket(this.cliente.id)
      .subscribe(response => {
          this.cliente.imageUrl = `${API_CONFIG.bucketUrl}/cp${this.cliente.id}.jpg`;
          this.imageUtilService.blobToDataURL(response)
            .then(dataUrl => {
              let str = dataUrl as string
              this.profileImage = this.sanitizer.bypassSecurityTrustUrl(str);
            })
        },
        error => {
          this.profileImage = 'assets/imgs/avatar-blank.png';
        }
      )
  }

  getPictureFromCamera() {
    this.disableCamera = true;

    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.PNG,
      mediaType: this.camera.MediaType.PICTURE
    }
    
    this.camera.getPicture(options)
      .then((imageData) => {
        this.picture = 'data:image/png;base64,' + imageData;
        this.disableCamera = false;
      },
      (error) => {
        this.disableCamera = false;
      }
    );
  }

  getPictureFromGalery() {
    this.disableCamera = true;

    const options: CameraOptions = {
      quality: 100,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.PNG,
      mediaType: this.camera.MediaType.PICTURE
    }
    
    this.camera.getPicture(options)
      .then((imageData) => {
        this.picture = 'data:image/png;base64,' + imageData;
        this.disableCamera = false;
      },
      (error) => {
        this.disableCamera = false;
      }
    );
  }

  sendPicture() {
    this.clienteService.uploadPicture(this.picture)
      .subscribe(response => {
          this.picture = null;
          this.ionViewDidLoad();
        }, error => {}
      );
  }

  cancel() {
    this.picture = null;
  }
}
