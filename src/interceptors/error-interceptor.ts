import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HTTP_INTERCEPTORS } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AlertController } from "ionic-angular";
import { Observable } from "rxjs";
import { FieldMessage } from "../models/fieldmessage";
import { StorageService } from "../services/storage.service";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    constructor(public storage: StorageService, public alert: AlertController) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req)
            .catch((error, caugth) => {
                let errorObj = error;

                if (errorObj.error) {
                    errorObj = errorObj.error;
                }

                if (!errorObj.status) {
                    errorObj = JSON.parse(errorObj);
                }

                console.log("Erro na requisição")
                console.log(errorObj)

                switch(errorObj.status) {
                    case 401: this.handle401Error();
                        break;
                    case 403: this.handle403Error();
                        break;
                    case 404: this.handle404Error();
                        break;
                    case 422: this.handle422Error(errorObj);
                        break;
                    default: this.handleDefaultError(errorObj);
                }

                return Observable.throw(errorObj);
            }) as any;
    }

    handle401Error() {
        let alert = this.alert.create({
            title: 'Falha na autenticação!', 
            message: 'Email ou senha inválidos', 
            enableBackdropDismiss: false,
            buttons: [
                {
                    text: 'Ok'
                }
            ]
        });
        alert.present();
    }

    handle403Error() {
        this.storage.setLocalUser(null);
    }

    handle404Error() {
        let alert = this.alert.create({
            title: 'Página não encontrada!', 
            message: 'A página que você acessou não existe', 
            enableBackdropDismiss: false,
            buttons: [
                {
                    text: 'Ok'
                }
            ]
        });
        alert.present();
    }

    handle422Error(errorObj) {
        let alert = this.alert.create({
            title: 'Erro de validação!', 
            message: this.list422Errors(errorObj.errors), 
            enableBackdropDismiss: false,
            buttons: [
                {
                    text: 'Ok'
                }
            ]
        });
        alert.present();
    }

    handleDefaultError(errorObj) {
        let alert = this.alert.create({
            title: 'Erro ' + errorObj.status + ': ' + errorObj.error, 
            message: errorObj.message, 
            enableBackdropDismiss: false,
            buttons: [
                {
                    text: 'Ok'
                }
            ]
        });
        alert.present();
    }

    private list422Errors(errors : FieldMessage[]) : string {
        let message : string = '';

        for (var i = 0; i < errors.length; i++) {
            message = message + '<p><strong>' + errors[i].erro + '</strong>: ' + errors[i].message + '</p>';
        }

        return message;
    }
}

export const ErrorInterceptorProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: ErrorInterceptor,
    multi: true
}