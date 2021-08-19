import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Jogador } from 'src/jogadores/interfaces/jogador.interface';
import { JogadoresService } from 'src/jogadores/jogadores.service';
import { AtualizarCategoriaDto } from './dtos/atualizar-categoria.dto';
import { CriarCategoriaDto } from './dtos/criar-categoria.dto';
import { Categoria } from './interfaces/categoria.interface';

@Injectable()
export class CategoriasService {
    
    constructor(
        @InjectModel('Categoria') private readonly categoriaModel: Model<Categoria>,
        private readonly jogadoresService: JogadoresService
    ) {}

    async consultarTodasCategorias(): Promise<Array<Categoria>> {
        return this.categoriaModel.find({}).populate('jogadores');
    }

    async consultarCategoriaPeloId(categoria: string): Promise<Categoria> {
        const categoriaEncontrada = await this.categoriaModel.findOne({ categoria }).populate('jogadores');

        if (!categoriaEncontrada)
            throw new NotFoundException(`Categoria ${categoria} não encontrada`);

        return categoriaEncontrada;
    }
    
    async consultarCategoriaPeloJogador(jogador: Jogador): Promise<Categoria> {
        return await this.categoriaModel.findOne({ jogadores: jogador });
    }

    async criarCategoria(criarCategoriaDto: CriarCategoriaDto): Promise<Categoria> {
        const { categoria } = criarCategoriaDto;
        const categoriaEncontrada = await this.categoriaModel.findOne({ categoria });

        if (categoriaEncontrada)
            throw new BadRequestException(`Categoria ${categoria} já cadastrada`);

        return await this.categoriaModel.create(criarCategoriaDto);
    }

    async atribuirJogadorCategoria(params: string[]): Promise<void> {
        const categoria = params['categoria'];
        const idJogador = params['idJogador'];
        
        const categoriaEncontrada = await this.categoriaModel.findOne({ categoria });
        if (!categoriaEncontrada)
            throw new NotFoundException(`Categoria ${categoria} não encontrada`);
        
        await this.jogadoresService.consultarJogadorPeloId(idJogador);

        // Opção usando query builder
        // const jogadorJaCadastradoCategoria = await this.categoriaModel.find({categoria}).where('jogadores').in(idJogador);
        // OU
        // Opção usando manipulação de array em memória
        const jogadorJaCadastradoCategoria = categoriaEncontrada.jogadores.some(jogador => jogador == idJogador);
        if (jogadorJaCadastradoCategoria)
            throw new BadRequestException(`Jogador de ID ${idJogador} já atribuido à categoria ${categoria}`);

        categoriaEncontrada.jogadores.push(idJogador);
        await categoriaEncontrada.save();
    }

    async atualizarCategoria(categoria: string, atualizarCategoriaDto: AtualizarCategoriaDto): Promise<void> {
        const categoriaEncontrada = await this.categoriaModel.findOne({ categoria });

        if (!categoriaEncontrada)
            throw new NotFoundException(`Categoria ${categoria} não encontrada`);
        
        await categoriaEncontrada.updateOne({$set: atualizarCategoriaDto});
    }

    async deletarCategoria(categoria: string): Promise<void> {
        const categoriaEncontrada = await this.categoriaModel.findOne({ categoria });

        if (!categoriaEncontrada)
            throw new NotFoundException(`Categoria ${categoria} não encontrada`);

        await this.categoriaModel.deleteOne({ categoria });
    }
}
