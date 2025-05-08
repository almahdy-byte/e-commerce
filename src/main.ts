import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
import { queryParser } from './common/middleWare/queryParser.middleWare';
dotenv.config();
async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  app.use(queryParser)
  await app.listen(Number(process.env.PORT as string));
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,

  }));
  console.log(`Server is running on port ${process.env.PORT}`);
  console.log(`DB is running on port ${process.env.DB_URI}`);
}
bootstrap();
