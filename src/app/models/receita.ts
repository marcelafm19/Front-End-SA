import { Categoria } from "./categoria";
import { Usuario } from "./usuario";

export class Receita {
    id!: number;
    dataEntrada?: string;
    valor?: number;
    categoria?: Categoria;
    usuario?: Usuario;
}