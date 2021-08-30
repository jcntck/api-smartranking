import {
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
import { Observable } from 'rxjs';
import { ClientProxySmartRanking } from 'src/proxyrmq/client-proxy-smartranking.service';
import { AtualizarCategoriaDto } from './dtos/atualizar-categoria.dto';
import { CriarCategoriaDto } from './dtos/criar-categoria.dto';

@Controller('api/v1/categorias')
export class CategoriasController {
  private clientProxy: ClientProxy;

  constructor(
    private readonly clientProxySmartRanking: ClientProxySmartRanking,
  ) {
    this.clientProxy =
      clientProxySmartRanking.getClientProxyAdminBackendInstance();
  }

  @Post()
  @UsePipes(ValidationPipe)
  criarCategoria(@Body() criarCategoriaDto: CriarCategoriaDto) {
    this.clientProxy.emit('criar-categoria', criarCategoriaDto);
  }

  @Get()
  consultarCategoria(@Query('idCategoria') _id: string): Observable<any> {
    return this.clientProxy.send('consultar-categorias', _id ? _id : '');
  }

  @Put(':_id')
  @UsePipes(ValidationPipe)
  atualizarCategoria(
    @Body() atualizarCategoriaDto: AtualizarCategoriaDto,
    @Param('_id') _id: string,
  ) {
    this.clientProxy.emit('atualizar-categoria', {
      id: _id,
      categoria: atualizarCategoriaDto,
    });
  }

  @Delete(':_id')
  deletarCategoria(@Param('_id') _id: string) {
    this.clientProxy.emit('deletar-categoria', { id: _id });
  }
}
