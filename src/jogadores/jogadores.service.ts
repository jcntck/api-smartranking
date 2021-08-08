import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CriarJogadorDto } from './dtos/criar-jogador.dto';
import { Jogador } from './interfaces/jogador.interface';
import { v4 as uuid } from 'uuid';

@Injectable()
export class JogadoresService {

    private jogadores: Jogador[] = []
    private readonly logger = new Logger(JogadoresService.name)

    async criarAtualizarJogador(criaJogadorDto: CriarJogadorDto): Promise<void> {
        const { email } = criaJogadorDto

        const jogadorEncontrado = this.jogadores.find(jogador => jogador.email === email)

        if (jogadorEncontrado)
            this.atualizar(jogadorEncontrado, criaJogadorDto)
        else
            this.criar(criaJogadorDto)
    }

    async consultarTodosJogadores(): Promise<Jogador[]> {
        return await this.jogadores;
    }

    async consultarJogadorPeloEmail(email: string): Promise<Jogador> {
        const jogadorEncontrado = this.jogadores.find(jogador => jogador.email === email)

        if (!jogadorEncontrado)
            throw new NotFoundException(`Jogador com e-mail ${email} não encontrado.`)

        return jogadorEncontrado
    }

    async deletarJogador(email: string): Promise<void> {
        this.jogadores = this.jogadores.filter(jogador => jogador.email !== email)
    }

    private criar(criaJogadorDto: CriarJogadorDto): void {
        const { nome, email, telefoneCelular } = criaJogadorDto
        const jogador: Jogador = {
            _id: uuid(),
            nome,
            email,
            telefoneCelular,
            ranking: 'A',
            posicaoRanking: 1,
            urlFotoJogador: 'www.google.com.br/foto123.jpg'
        }
        this.logger.log(`criaJogadorDto: ${JSON.stringify(jogador)}`)
        this.jogadores.push(jogador)
    }

    private atualizar(jogadorEncontrado: Jogador, criarJogadorDto: CriarJogadorDto): void {
        const { nome } = criarJogadorDto
        this.logger.log(`Atualizando jogador: Nome Antigo: ${jogadorEncontrado.nome} - Nome novo: ${nome}`)
        jogadorEncontrado.nome = nome
    }

}
