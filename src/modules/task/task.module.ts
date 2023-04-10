import { Module } from '@nestjs/common';
import { RequestMetaService } from '../../interceptors/request-meta.service';
import { TypeOrmExModule } from '../database/typeorm-ex.module';
import { UserModule } from '../user/user.module';
import { TaskController } from './task.controller';
import { TaskRepository } from './task.repository';
import { TaskService } from './task.service';

@Module({
  providers: [TaskService, RequestMetaService],
  imports: [TypeOrmExModule.forCustomRepository([TaskRepository]), UserModule],
  controllers: [TaskController],
  exports: [TaskService]
})
export class TaskModule {}
