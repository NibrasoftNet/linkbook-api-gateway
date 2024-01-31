import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import appConfig from "./config/app.config";
import {GraphQLModule} from "@nestjs/graphql";
import { ApolloGatewayDriver, ApolloGatewayDriverConfig } from '@nestjs/apollo';
import { IntrospectAndCompose, RemoteGraphQLDataSource } from '@apollo/gateway';
import { authContext } from './utils/context/auth.context';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
      envFilePath: ['.env'],
    }),
    GraphQLModule.forRootAsync<ApolloGatewayDriverConfig>({
      inject: [ConfigService],
      driver: ApolloGatewayDriver,
      useFactory: async (configService: ConfigService) => ({
        server: {
          context: authContext
        },
        gateway: {
          buildService: ({ name, url }) => {
            return new RemoteGraphQLDataSource({
              url,
              willSendRequest({ request, context }: any) {
                request.http.headers.set('authorization', context.authorization);
              },
            });
          },
          supergraphSdl: new IntrospectAndCompose({
            subgraphs: [
              { name: 'users', url: configService.getOrThrow('app.usersDomain', { infer: true }) },
              { name: 'library', url: configService.getOrThrow('app.libraryDomain', { infer: true }) }
            ],
          }),
        },
      }),
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
