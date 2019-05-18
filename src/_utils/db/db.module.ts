import {Module} from '@nestjs/common';
import {ConfigModule, ConfigService} from '../../config';
import {LoggerModule, Logger} from '../logger';
import {InjectableSymbols} from '../injectable';
import {Sequelize} from 'sequelize-typescript';
import {dbModels} from './db.models';


@Module({
  imports: [ConfigModule, LoggerModule],
  providers: [{
    provide: InjectableSymbols.db,
    inject: [ConfigService, Logger],
    useFactory: async (config: ConfigService, logger: Logger) => {
      const sequelize = new Sequelize({
        logging: (message) => logger.log(message, `PostgreSQL`),
        operatorsAliases: false,
        dialect: 'postgres',
        host: config.get(`POSTGRES_HOST`),
        port: config.get(`POSTGRES_PORT`),
        username: config.get(`POSTGRES_USER`),
        password: config.get(`POSTGRES_PASS`),
        database: config.get(`POSTGRES_DATABASE`),
      } as any);
      try {
      sequelize.addModels(dbModels);
      await sequelize.sync();
      logger.info(`PostgreSQL`, `Connected to database at host: ${config.get(`POSTGRES_HOST`)} port: ${config.get(`POSTGRES_PORT`)}`)
      return sequelize;
      } catch (error) {
        logger.err(`PostgresQL`, `Connection error!`, error);
      }
    }
  }],
  exports: [InjectableSymbols.db]
})
export class DBModule {}