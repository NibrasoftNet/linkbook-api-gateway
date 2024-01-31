import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { useContainer } from 'class-validator';
import { ConfigService } from '@nestjs/config';
import {Logger, ValidationPipe} from "@nestjs/common";
import {AllConfigType} from "./config/config.type";
import validationOptions from "./utils/validation-options";
import { initializeTransactionalContext, StorageDriver } from 'typeorm-transactional';
import { ResponseInterceptor } from './utils/interceptors/response.interceptor';

const logger = new Logger('LinkBook Api Gateway');
async function bootstrap() {
  initializeTransactionalContext({ storageDriver: StorageDriver.AUTO });
  const app = await NestFactory.create(AppModule, { cors: true });
  useContainer(app.select(AppModule), {
    fallbackOnErrors: true,
  });
  const configService = app.get(ConfigService<AllConfigType>);
  app.enableShutdownHooks();
  app.setGlobalPrefix(
      configService.getOrThrow('app.apiPrefix', { infer: true }),
      {
        exclude: ['/'],
      },
  );
  //app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalPipes(new ValidationPipe(validationOptions));
  await app.listen(
      configService.getOrThrow('app.port', { infer: true }),
      () => {
        logger.log(
            `LinkBook api gateway is listening to port ${configService.getOrThrow(
                'app.port',
                { infer: true },
            )}...`,
        );
      },
  );
}
void bootstrap().catch((e) => {
  logger.error(`❌  Error starting server, ${e}`, '', 'Bootstrap');
  throw e;
});
