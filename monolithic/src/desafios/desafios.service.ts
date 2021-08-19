import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CategoriasService } from 'src/categorias/categorias.service';
import { JogadoresService } from 'src/jogadores/jogadores.service';
import { AtribuirPartidaDesafioDto } from './dtos/atribuir-partida-desafio.dto';
import { AtualizarDesafioDto } from './dtos/atualizar-desafio.dto';
import { CriarDesafioDto } from './dtos/criar-desafio.dto';
import { DesafioStatus } from './interfaces/desafio-status.enum';
import { Desafio, Partida } from './interfaces/desafio.interface';

@Injectable()
export class DesafiosService {
  constructor(
    @InjectModel('Desafio') private readonly desafioModel: Model<Desafio>,
    @InjectModel('Partida') private readonly partidaModel: Model<Partida>,
    private readonly jogadoresService: JogadoresService,
    private readonly categoriasService: CategoriasService,
  ) {}

  async consultarTodosDesafios(): Promise<Array<Desafio>> {
    return await this.desafioModel
      .find()
      .populate(['jogadores', 'solicitante', 'partida']);
  }

  async consultarDesafiosDeUmJogador(
    idJogador: string,
  ): Promise<Array<Desafio>> {
    const jogadorEncontrado =
      await this.jogadoresService.consultarJogadorPeloId(idJogador);

    if (!jogadorEncontrado) {
      throw new NotFoundException(`Jogador com ID ${idJogador} não encontrado`);
    }

    return await this.desafioModel
      .find()
      .where('jogadores')
      .in([idJogador])
      .populate(['jogadores', 'solicitante', 'partida']);
  }

  async criarDesafio(criarDesafioDto: CriarDesafioDto): Promise<any> {
    const { solicitante } = criarDesafioDto;

    const jogadores = await this.jogadoresService.consultarTodosJogadores();

    criarDesafioDto.jogadores.map((jogadorDto) => {
      const jogadorFilter = jogadores.filter(
        (jogador) => jogador._id == jogadorDto._id,
      );

      if (jogadorFilter.length == 0) {
        throw new BadRequestException(
          `O id ${jogadorDto._id} não é um jogador`,
        );
      }
    });

    if (
      criarDesafioDto.jogadores.filter((jogador) => jogador._id === solicitante)
        .length === 0
    ) {
      throw new BadRequestException(
        'O solicitante precisa ser um dos jogadores do desafio',
      );
    }

    const categoria =
      await this.categoriasService.consultarCategoriaPeloJogador(solicitante);
    if (!categoria) {
      throw new NotFoundException(
        `O jogador ${solicitante} não está cadastrado em nenhuma categoria`,
      );
    }

    return await this.desafioModel.create({
      dataHoraDesafio: criarDesafioDto.dataHoraDesafio,
      status: DesafioStatus.PENDENTE,
      dataHoraSolicitacao: new Date(),
      solicitante: criarDesafioDto.solicitante,
      categoria: categoria.categoria,
      jogadores: criarDesafioDto.jogadores,
    });
  }

  async atribuirPartidaDesafio(
    _id: string,
    atribuirPartidaDesafioDto: AtribuirPartidaDesafioDto,
  ): Promise<void> {
    const desafioEncontrado = await this.desafioModel.findById(_id);
    if (!desafioEncontrado) {
      throw new BadRequestException(`Desafio ${_id} não cadastrado`);
    }

    const jogadorFilter = desafioEncontrado.jogadores.filter(
      (jogador) => jogador._id == atribuirPartidaDesafioDto.def,
    );
    if (jogadorFilter.length == 0) {
      throw new BadRequestException(
        `O jogador vencedor não faz parte do desafio`,
      );
    }

    const partidaCriada = new this.partidaModel(atribuirPartidaDesafioDto);
    partidaCriada.categoria = desafioEncontrado.categoria;
    partidaCriada.jogadores = desafioEncontrado.jogadores;
    const resultado = await partidaCriada.save();

    desafioEncontrado.status = DesafioStatus.REALIZADO;
    desafioEncontrado.partida = resultado._id;

    try {
      await desafioEncontrado.save();
    } catch (error) {
      await desafioEncontrado.deleteOne();
      throw new InternalServerErrorException();
    }
  }

  async atualizarDesafio(
    _id: string,
    atualizarDesafioDto: AtualizarDesafioDto,
  ): Promise<void> {
    const desafioEncontrado = await this.desafioModel.findById(_id);

    if (!desafioEncontrado) {
      throw new NotFoundException(`Desafio ${_id} não cadastrado`);
    }

    if (atualizarDesafioDto.status) {
      desafioEncontrado.dataHoraResposta = new Date();
    }

    desafioEncontrado.dataHoraDesafio = atualizarDesafioDto.dataHoraDesafio;
    desafioEncontrado.status = atualizarDesafioDto.status;

    await desafioEncontrado.save();
  }

  async deletarDesafio(_id: string): Promise<void> {
    const desafioEncontrado = await this.desafioModel.findById(_id);
    if (!desafioEncontrado) {
      throw new BadRequestException(`Desafio ${_id} não cadastrado`);
    }

    desafioEncontrado.status = DesafioStatus.CANCELADO;
    await desafioEncontrado.save();
  }
}
