import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { API_CONFIG } from "../config/api.config";
import { CredenciaisDTO } from "../models/credentiais.dto";
import { LocalUser } from "../models/local-user";
import { StorageService } from "./storage.service";

@Injectable()
export class AuthService {

    constructor(public http: HttpClient, public storage: StorageService) {
    }

    authenticate(credential: CredenciaisDTO) {
        return this.http.post(`${API_CONFIG.baseUrl}/login`,
            credential, 
            {
                observe: "response",
                responseType: "text"
            }
        );
    }

    successfullLogin(autorization: string) {
        let token = autorization.substring(7);

        let user: LocalUser = {
            token: token
        }

        this.storage.setLocalUser(user);
    }

    logout() {
        this.storage.setLocalUser(null);
    }

}