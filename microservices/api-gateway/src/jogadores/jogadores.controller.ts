import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, Observable, take } from 'rxjs';
import { ClientProxySmartRanking } from 'src/proxyrmq/client-proxy-smartranking.service';
import { AtualizarJogadorDto } from './dtos/atualizar-jogador.dto';
import { CriarJogadorDto } from './dtos/criar-jogador.dto';

@Controller('api/v1/jogadores')
export class JogadoresController {
  private clientProxy: ClientProxy;

  constructor(
    private readonly clientProxySmartRanking: ClientProxySmartRanking,
  ) {
    this.clientProxy =
      this.clientProxySmartRanking.getClientProxyAdminBackendInstance();
  }

  @Post()
  @UsePipes(ValidationPipe)
  async criarJogador(@Body() criarJogadorDto: CriarJogadorDto) {
    const categoria$ = await this.clientProxy
      .send('consultar-categorias', criarJogadorDto.categoria)
      .pipe(take(1));
    const categoria = await firstValueFrom(categoria$);

    if (!categoria) {
      throw new BadRequestException('Categoria não cadastrada!');
    }

    await this.clientProxy.emit('criar-jogador', criarJogadorDto);
  }

  @Get()
  consultarJogadores(@Query('idJogador') _id: string): Observable<any> {
    return this.clientProxy.send('consultar-jogadores', _id ? _id : '');
  }

  @Put(':_id')
  @UsePipes(ValidationPipe)
  async atualizarJogador(
    @Body() atualizarJogadorDto: AtualizarJogadorDto,
    @Param('_id') _id: string,
  ) {
    const categoria$ = await this.clientProxy
      .send('consultar-categorias', atualizarJogadorDto.categoria)
      .pipe(take(1));
    const categoria = await firstValueFrom(categoria$);

    if (!categoria) {
      throw new BadRequestException('Categoria não cadastrada!');
    }

    this.clientProxy.emit('atualizar-jogador', {
      id: _id,
      jogador: atualizarJogadorDto,
    });
  }

  @Delete(':_id')
  deletarJogador(@Param('_id') _id: string) {
    this.clientProxy.emit('deletar-jogador', { id: _id });
  }
}
