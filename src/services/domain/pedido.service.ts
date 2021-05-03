import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { API_CONFIG } from "../../config/api.config";
import { PedidoDTO } from "../../models/pedido.dto";

@Injectable()
export class PedidoService {

    constructor(public http: HttpClient) {
    }

    insert(pedido: PedidoDTO) {
        return this.http.post(`${API_CONFIG.baseUrl}/pedidos`, 
            pedido,
            {
                observe: 'response',
                responseType: 'text'
            }
        );
    }   
}