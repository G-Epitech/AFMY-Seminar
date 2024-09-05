import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { DtoValidationPipe } from './pipes/dto-validation.pipe';

async function main(): Promise<void> {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalPipes(new DtoValidationPipe());
  await app.listen(4000);
}

main().then();
