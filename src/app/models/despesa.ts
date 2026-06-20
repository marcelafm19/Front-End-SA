import { Categoria } from "./categoria";
import { Usuario } from "./usuario";

export class Despesa {
    id!: number;
    descricao?: string;
    dataVencimento?: string;
    dataPagamento?: string;
    situacao?: string;
    valor?: number;
    categoria?: Categoria;
    usuario?: Usuario;
}