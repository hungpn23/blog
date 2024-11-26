import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
  TypeOrmModuleOptions,
  TypeOrmOptionsFactory,
} from "@nestjs/typeorm/dist/interfaces/typeorm-options.interface";

@Injectable()
export class TypeormConfig implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: this.configService.getOrThrow("database.type"),
      host: this.configService.getOrThrow("database.host"),
      port: this.configService.getOrThrow("database.port"),
      username: this.configService.getOrThrow("database.username"),
      password: this.configService.getOrThrow("database.password"),
      database: this.configService.getOrThrow("database.name"),
      synchronize: this.configService.getOrThrow("database.synchronize"),
      logging: this.configService.getOrThrow("database.logging"),
      logger: this.configService.getOrThrow("database.logger"),
      entities: [__dirname + "/../**/*.entity{.ts,.js}"],
      migrations: [__dirname + "/../**/migrations/**/*.{.ts,.js}"],
      dropSchema: this.configService.getOrThrow("database.dropSchema"),
    } as TypeOrmModuleOptions;
  }
}
