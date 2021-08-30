import { IsEmail, IsNotEmpty } from 'class-validator';

export class CriarJogadorDto {
  @IsNotEmpty()
  telefoneCelular: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  nome: string;

  @IsNotEmpty()
  categoria: string;
}
