import { Injectable, NotFoundException } from '@nestjs/common';
import { CriarJogadorDto } from './dtos/criar-jogador.dto';
import { Jogador } from './interfaces/jogador.interface';
import { v4 as uuid } from 'uuid';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class JogadoresService {

    constructor(@InjectModel('Jogador') private readonly jogadorModel: Model<Jogador>) {}

    async criarAtualizarJogador(criaJogadorDto: CriarJogadorDto): Promise<void> {
        const { email } = criaJogadorDto
        const jogadorEncontrado = await this.jogadorModel.findOne({ email }).exec()

        if (jogadorEncontrado) {
            const jogador = this.atualizar(jogadorEncontrado, criaJogadorDto)
        }
        else {
            const jogador = await this.criar(criaJogadorDto)
        }
    }

    async consultarTodosJogadores(): Promise<Jogador[]> {
        return await this.jogadorModel.find({});
    }

    async consultarJogadorPeloEmail(email: string): Promise<Jogador> {
        const jogadorEncontrado = await this.jogadorModel.findOne({ email }).exec()

        if (!jogadorEncontrado)
            throw new NotFoundException(`Jogador com e-mail ${email} não encontrado.`)

        return jogadorEncontrado
    }

    async deletarJogador(email: string): Promise<any> {
        return await this.jogadorModel.remove({ email }).exec()
    }

    private async criar(criaJogadorDto: CriarJogadorDto): Promise<Jogador> {
        const jogadorCriado = new this.jogadorModel(criaJogadorDto)
        return await jogadorCriado.save()
    }

    private async atualizar(jogadorEncontrado: Jogador, criarJogadorDto: CriarJogadorDto): Promise<Jogador> {
        return await jogadorEncontrado.updateOne({$set: criarJogadorDto}).exec()
    }

}
