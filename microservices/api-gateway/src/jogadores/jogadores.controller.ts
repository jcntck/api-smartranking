import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { FileInterceptor } from '@nestjs/platform-express';
import { firstValueFrom, Observable, take } from 'rxjs';
import { AwsService } from 'src/aws/aws.service';
import { ClientProxySmartRanking } from 'src/proxyrmq/client-proxy-smartranking.service';
import { AtualizarJogadorDto } from './dtos/atualizar-jogador.dto';
import { CriarJogadorDto } from './dtos/criar-jogador.dto';

@Controller('api/v1/jogadores')
export class JogadoresController {
  private logger = new Logger(JogadoresController.name);
  private clientProxy: ClientProxy;

  constructor(
    private readonly clientProxySmartRanking: ClientProxySmartRanking,
    private readonly awsService: AwsService,
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

  @Post('/:_id/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadArquivo(@UploadedFile() file, @Param('_id') _id: string) {
    const jogador$ = await this.clientProxy
      .send('consultar-jogadores', _id)
      .pipe(take(1));
    const jogador = await firstValueFrom(jogador$);

    if (!jogador) {
      throw new BadRequestException('Jogador não cadastrado!');
    }

    this.awsService.uploadArquivo(file, _id).then(async (data) => {
      const atualizarJogadorDto: AtualizarJogadorDto = {
        urlFotoJogador: data.url,
      };

      await this.clientProxy.emit('atualizar-jogador', {
        id: _id,
        jogador: atualizarJogadorDto,
      });
    });

    return this.clientProxy.send('consultar-jogadores', _id);
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
