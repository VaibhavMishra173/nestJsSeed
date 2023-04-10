import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from '../role/role.entity';
import { User } from '../user/user.entity';
import { Task } from '../task/task.entity';
import { DatabaseConfig } from './database.config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: DatabaseConfig,
    }),
    //TypeOrmExModule.forCustomRepository([UserRepository, RoleRepository]),
    TypeOrmModule.forFeature([User, Role, Task]),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
