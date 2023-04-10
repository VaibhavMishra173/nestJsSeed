import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { getStartIndex, PaginationDto } from '../../dto/pager.dto';
// import { getStartIndex, PaginationDto } from 'src/dto/pager.dto';
// import { RequestMetaService } from '../../interceptors/request-meta.service';
import { CreateTaskDto, TaskFilterDTO, TasksResponseDto } from './task.dto';
import { Task } from './task.entity';
import { TaskRepository } from './task.repository';

@Injectable()
export class TaskService {
  constructor(
    private readonly taskRepository: TaskRepository,
    // private readonly requestMetaService: RequestMetaService,
  ) { }

  async createTask(createTaskDto: CreateTaskDto, userId: any) {
    // const requestMeta: RequestMeta = await this.requestMetaService.getRequestMeta(request);
    const task = this.taskRepository.create({ ...createTaskDto, user: userId });
    return this.taskRepository.save(task);

    // if (requestMeta.email) {
    //   return this.taskRepository.save(task);
    // }
    // throw new UnauthorizedException('User not Authorised');
  }

  findOne(id: number) {
    if (!id) {
      return null;
    }
    return this.taskRepository.findOneBy({ id });
  }

  async findEmailById(id: number) {
    const task = await this.taskRepository.findOneBy({ id });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    const user = await task.user;

    if (!user) {
      throw new NotFoundException(`User associated with task with ID ${id} not found`);
    }

    return user.email;
  }

  async getAllTasks(
    paginationDto: PaginationDto,
    taskFilterDTO: TaskFilterDTO,
    userId: string,
  ): Promise<TasksResponseDto> {
    const startIndex = getStartIndex(paginationDto.page, paginationDto.limit);
    return this.taskRepository.getAllTasks(paginationDto, startIndex, userId, taskFilterDTO);
  }

  async updateTask(taskId: number, attrs: Partial<Task>, requestEmail) {
    // const requestMeta: RequestMeta = await this.requestMetaService.getRequestMeta(request);
    const userEmail = await this.findEmailById(taskId);
    if (requestEmail === userEmail) {
      const task = await this.findOne(taskId);
      if (!task) {
        throw new NotFoundException('Task not found');
      }
      Object.assign(task, attrs);
      return this.taskRepository.save(task);
    }
    throw new UnauthorizedException('User not Authorised');
  }

  async deleteTask(taskId: number, requestEmail) {
    // const requestMeta: RequestMeta = await this.requestMetaService.getRequestMeta(request);
    const userEmail = await this.findEmailById(taskId);
    if (requestEmail === userEmail) {
      const task = await this.findOne(taskId);
      if (!task) {
        throw new NotFoundException('Task not found');
      }
      return this.taskRepository.delete(taskId);
    }
    throw new UnauthorizedException('User not Authorised');
  }

}
