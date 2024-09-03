import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { DtoValidationPipe } from './pipes/dto-validation.pipe';

async function main() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new DtoValidationPipe());
  await app.listen(4000);
}
main();
