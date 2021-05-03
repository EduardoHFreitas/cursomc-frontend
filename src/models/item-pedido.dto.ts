import { ProdutoDTO } from "./produto.dto";
import { RefDTO } from "./ref.dto";

export interface ItemPedidoDTO {
    quantidade: number;
    produto: RefDTO;
}