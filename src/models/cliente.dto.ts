import { EnderecoDTO } from "./endereco.dto";

export interface ClienteDTO {
	id: string;
    nome: string;
	email: string;
	senha: string;
	cpfOuCnpj: string;
	tipo: number;
	imageUrl?: string;
	enderecos: EnderecoDTO[];
	telefones: string[];
}