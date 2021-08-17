import { IsNotEmpty } from "class-validator";
import { Jogador } from "src/jogadores/interfaces/jogador.interface";
import { Resultado } from "../interfaces/desafio.interface";

export class AtribuirPartidaDesafioDto {
    @IsNotEmpty()
    def: Jogador;

    @IsNotEmpty()
    resultado: Array<Resultado>
}