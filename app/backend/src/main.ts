import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { parseQueryMiddleware } from './shared/middlewares/parse-query';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(parseQueryMiddleware);

  await app.listen(3000);
}
bootstrap();
