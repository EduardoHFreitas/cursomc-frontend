export interface ClienteDTO {
	id: string;
    nome: string;
	email: string;
	cpfOuCnpj: string;
	tipo: number;
	imageUrl?: string;
}