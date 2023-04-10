import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { config } from './config';
import { RequestMetaService } from './interceptors/request-meta.service';
import { RequestLogger } from './middleware/request-logger.middleware';
import { AppAuthController } from './modules/auth/app-auth/app-auth.controller';
import { AuthModule } from './modules/auth/auth.module';
import { DatabaseModule } from './modules/database/database.module';
import { RoleController } from './modules/role/role.controller';
import { RoleModule } from './modules/role/role.module';
import { UserController } from './modules/user/user.controller';
import { UserModule } from './modules/user/user.module';
import { TaskModule } from './modules/task/task.module'

import { TaskController } from './modules/task/task.controller';
import { TaskModule } from './modules/task/task.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env.${process.env.NODE_ENV}`, `./.env`],
      load: [config],
    }),
    DatabaseModule,
    UserModule,
    RoleModule,
    AuthModule,
    TaskModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'static-web'),
    }),
    // TasksModule,
  ],
  controllers: [AppController, TaskController],
  providers: [AppService, RequestMetaService],
})
export class AppModule implements NestModule {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLogger).forRoutes(AppAuthController, RoleController, UserController, AppController, TaskController);
  }
}
