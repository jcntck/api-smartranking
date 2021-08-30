import { Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Jogador } from 'src/interfaces/jogadores/jogador.interface';

@Injectable()
export class JogadoresService {
  private readonly logger = new Logger(JogadoresService.name);

  constructor(
    @InjectModel('Jogador') private readonly jogadorModel: Model<Jogador>,
  ) {}

  async criarJogador(jogador: Jogador): Promise<Jogador> {
    try {
      return await this.jogadorModel.create(jogador);
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
      throw new RpcException(error.message);
    }
  }

  async consultarTodosJogadores(): Promise<Jogador[]> {
    try {
      return await this.jogadorModel.find();
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
      throw new RpcException(error.message);
    }
  }

  async consultarJogadorPeloId(_id: string): Promise<Jogador> {
    try {
      return await this.jogadorModel.findOne({ _id });
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
      throw new RpcException(error.message);
    }
  }

  async atualizarJogador(_id: string, jogador: Jogador): Promise<void> {
    try {
      await this.jogadorModel.findOneAndUpdate({ _id }, { $set: jogador });
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
      throw new RpcException(error.message);
    }
  }

  async deletarJogador(_id: string): Promise<void> {
    try {
      await this.jogadorModel.findOneAndDelete({ _id });
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
      throw new RpcException(error.message);
    }
  }
}
