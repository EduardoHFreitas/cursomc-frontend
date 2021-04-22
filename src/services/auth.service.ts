import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { API_CONFIG } from "../config/api.config";
import { CredenciaisDTO } from "../models/credentiais.dto";

@Injectable()
export class AuthService {

    constructor(public http: HttpClient) {

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

}