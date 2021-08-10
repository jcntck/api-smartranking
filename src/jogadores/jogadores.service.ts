import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CriarJogadorDto } from './dtos/criar-jogador.dto';
import { Jogador } from './interfaces/jogador.interface';
import { v4 as uuid } from 'uuid';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AtualizarJogadorDto } from './dtos/atualizar-jogador.dto';

@Injectable()
export class JogadoresService {

    constructor(@InjectModel('Jogador') private readonly jogadorModel: Model<Jogador>) {}

    async criarJogador(criaJogadorDto: CriarJogadorDto): Promise<Jogador> {
        const { email } = criaJogadorDto
        const jogadorEncontrado = await this.jogadorModel.findOne({email})
        
        if (jogadorEncontrado)
            throw new BadRequestException(`Jogador com e-mail ${email} já cadastrado`)

        const jogadorCriado = new this.jogadorModel(criaJogadorDto)
        return await jogadorCriado.save()
    }

    async atualizarJogador(_id: string, atualizarJogadorDto: AtualizarJogadorDto): Promise<void> {
        const jogadorEncontrado = await this.jogadorModel.findOne({ _id })

        if (!jogadorEncontrado)
            throw new NotFoundException(`Jogador com ID ${_id} não encontrado.`)

        return await jogadorEncontrado.updateOne({$set: atualizarJogadorDto})
    }

    async consultarTodosJogadores(): Promise<Jogador[]> {
        return await this.jogadorModel.find({});
    }

    async consultarJogadorPeloId(_id: string): Promise<Jogador> {
        const jogadorEncontrado = await this.jogadorModel.findOne({ _id })

        if (!jogadorEncontrado)
            throw new NotFoundException(`Jogador com ID ${_id} não encontrado.`)

        return jogadorEncontrado
    }

    async deletarJogador(_id: string): Promise<any> {
        const jogadorEncontrado = await this.jogadorModel.findOne({ _id })
        
        if (!jogadorEncontrado)            
            throw new NotFoundException(`Jogador com ID ${_id} não encontrado.`)

        return await this.jogadorModel.deleteOne({_id})
    }
}
