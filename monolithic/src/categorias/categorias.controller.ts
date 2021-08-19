import { Body, Controller, Delete, Get, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { CategoriasService } from './categorias.service';
import { AtualizarCategoriaDto } from './dtos/atualizar-categoria.dto';
import { CriarCategoriaDto } from './dtos/criar-categoria.dto';
import { Categoria } from './interfaces/categoria.interface';

@Controller('api/v1/categorias')
export class CategoriasController {

    constructor(private readonly categoriasService: CategoriasService) { }

    @Get()
    async consultarCategorias(): Promise<Array<Categoria>> {
        return await this.categoriasService.consultarTodasCategorias();
    }

    @Get('/:categoria')
    async consultarCategoriaPeloId(@Param('categoria') categoria: string): Promise<Categoria> {
        return await this.categoriasService.consultarCategoriaPeloId(categoria);
    }

    @Post()
    @UsePipes(ValidationPipe)
    async criarCategoria(@Body() criarCategoriaDto: CriarCategoriaDto): Promise<Categoria> {
        return await this.categoriasService.criarCategoria(criarCategoriaDto);
    }

    @Post('/:categoria/jogador/:idJogador')
    async atribuirJogadorCategoria(@Param() params: string[]): Promise<void> {
        await this.categoriasService.atribuirJogadorCategoria(params);
    }

    @Put('/:categoria')
    @UsePipes(ValidationPipe)
    async atualizarCategoria(
        @Param('categoria') categoria: string,
        @Body() atualizarCategoriaDto: AtualizarCategoriaDto,
    ): Promise<void> {
        await this.categoriasService.atualizarCategoria(categoria, atualizarCategoriaDto);
    }

    @Delete('/:categoria')
    async deletarCategoria(@Param('categoria') categoria: string): Promise<void> {
        await this.categoriasService.deletarCategoria(categoria);
    }
}
