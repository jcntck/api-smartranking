import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriasModule } from './categorias/categorias.module';
import { JogadoresModule } from './jogadores/jogadores.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://admin:RtPshRKtj9ah9Liq@smartranking.i8pk7.mongodb.net/sradmbackend?retryWrites=true&w=majority',
      {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      },
    ),
    CategoriasModule,
    JogadoresModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
