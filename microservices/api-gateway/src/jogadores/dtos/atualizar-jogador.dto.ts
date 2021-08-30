import { IsNotEmpty, IsOptional } from 'class-validator';

export class AtualizarJogadorDto {
  @IsNotEmpty()
  telefoneCelular: string;

  @IsNotEmpty()
  nome: string;

  @IsOptional()
  categoria: string;
}
