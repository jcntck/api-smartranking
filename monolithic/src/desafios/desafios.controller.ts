import {
  Body,
  Controller,
  Get,
  Post,
  UsePipes,
  ValidationPipe,
  Query,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { DesafiosService } from './desafios.service';
import { AtribuirPartidaDesafioDto } from './dtos/atribuir-partida-desafio.dto';
import { AtualizarDesafioDto } from './dtos/atualizar-desafio.dto';
import { CriarDesafioDto } from './dtos/criar-desafio.dto';
import { Desafio } from './interfaces/desafio.interface';
import { DesafioStatusValidationPipe } from './pipes/desafio-status-validation.pipe';

@Controller('api/v1/desafios')
export class DesafiosController {
  constructor(private readonly desafioService: DesafiosService) {}

  @Get()
  async consultarDesafios(
    @Query('idJogador') idJogador: string,
  ): Promise<Array<Desafio>> {
    return idJogador
      ? await this.desafioService.consultarDesafiosDeUmJogador(idJogador)
      : await this.desafioService.consultarTodosDesafios();
  }

  @Post()
  @UsePipes(ValidationPipe)
  async criarDesafio(
    @Body() criarDesafioDto: CriarDesafioDto,
  ): Promise<Desafio> {
    return await this.desafioService.criarDesafio(criarDesafioDto);
  }

  @Post('/:desafio/partida')
  async atribuirPartidaDesafio(
    @Param('desafio') _id: string,
    @Body(ValidationPipe) atribuirPartidaDesafioDto: AtribuirPartidaDesafioDto,
  ): Promise<void> {
    await this.desafioService.atribuirPartidaDesafio(
      _id,
      atribuirPartidaDesafioDto,
    );
  }

  @Put('/:desafio')
  async atualizarDesafio(
    @Param('desafio') _id: string,
    @Body(DesafioStatusValidationPipe) atualizarDesafioDto: AtualizarDesafioDto,
  ): Promise<void> {
    await this.desafioService.atualizarDesafio(_id, atualizarDesafioDto);
  }

  @Delete('/:desafio')
  async deletarDesafio(@Param('desafio') _id: string): Promise<void> {
    await this.desafioService.deletarDesafio(_id);
  }
}
