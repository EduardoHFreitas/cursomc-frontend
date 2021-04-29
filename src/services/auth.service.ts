import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { JwtHelper } from "angular2-jwt";
import { API_CONFIG } from "../config/api.config";
import { CredenciaisDTO } from "../models/credentiais.dto";
import { LocalUser } from "../models/local-user";
import { CartService } from "./cart.service";
import { StorageService } from "./storage.service";

@Injectable()
export class AuthService {

    jwtHelper: JwtHelper = new JwtHelper();

    constructor(
        public http: HttpClient,
        public storage: StorageService,
        public cartService: CartService,
    ) {}

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
            token: token,
            email: this.jwtHelper.decodeToken(token).sub
        }

        this.storage.setLocalUser(user);
        this.cartService.createOrClearCart();
    }

    logout() {
        this.storage.setLocalUser(null);
    }

    refreshToken() {
        return this.http.post(`${API_CONFIG.baseUrl}/auth/refresh_token`,
            {},
            {
                observe: "response",
                responseType: "text"
            }
        );
    }
}