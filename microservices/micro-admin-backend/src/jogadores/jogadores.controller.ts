import { Controller, Logger } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { Jogador } from './interfaces/jogador.interface';
import { JogadoresService } from './jogadores.service';

const ackErrors: string[] = ['E11000'];

@Controller('jogadores')
export class JogadoresController {
  private readonly logger = new Logger(JogadoresController.name);

  constructor(private readonly jogadoresService: JogadoresService) {}

  @EventPattern('criar-jogador')
  async criarJogador(@Payload() jogador: Jogador, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    this.logger.log(`Create Player: ${JSON.stringify(jogador)}`);

    try {
      await this.jogadoresService.criarJogador(jogador);
      await channel.ack(originalMsg);
    } catch (error) {
      this.logger.error(
        `Create Category Error: ${JSON.stringify(error.message)}`,
      );

      ackErrors.forEach(async (ackError) => {
        if (error.message.includes(ackError)) {
          await channel.ack(originalMsg);
        }
      });
    }
  }

  @MessagePattern('consultar-jogadores')
  async consultarJogadores(@Payload() _id: string, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      return _id
        ? await this.jogadoresService.consultarJogadorPeloId(_id)
        : await this.jogadoresService.consultarTodosJogadores();
    } catch (error) {
      await channel.ack(originalMsg);
    }
  }

  @EventPattern('atualizar-jogador')
  async atualizarJogador(@Payload() data: any, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    this.logger.log(`Update Jogador: ${JSON.stringify(data)}`);

    try {
      const _id: string = data.id;
      const jogador: Jogador = data.jogador;
      await this.jogadoresService.atualizarJogador(_id, jogador);
      await channel.ack(originalMsg);
    } catch (error) {
      this.logger.error(
        `Update Player Error: ${JSON.stringify(error.message)}`,
      );

      ackErrors.forEach(async (ackError) => {
        if (error.message.includes(ackError)) {
          await channel.ack(originalMsg);
        }
      });
    }
  }

  @EventPattern('deletar-jogador')
  async deletarJogador(@Payload() data: any, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    this.logger.log(`Delete Player: ${JSON.stringify(data)}`);

    try {
      const _id: string = data.id;

      await this.jogadoresService.deletarJogador(_id);
      await channel.ack(originalMsg);
    } catch (error) {
      this.logger.error(
        `Delete Category Error: ${JSON.stringify(error.message)}`,
      );

      ackErrors.forEach(async (ackError) => {
        if (error.message.includes(ackError)) {
          await channel.ack(originalMsg);
        }
      });
    }
  }
}
