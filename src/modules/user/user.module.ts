import { Module } from '@nestjs/common';
import { RequestMetaService } from '../../interceptors/request-meta.service';
import { TypeOrmExModule } from '../database/typeorm-ex.module';
import { RoleModule } from '../role/role.module';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

@Module({
  providers: [UserService, RequestMetaService],
  imports: [TypeOrmExModule.forCustomRepository([UserRepository]), RoleModule],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
