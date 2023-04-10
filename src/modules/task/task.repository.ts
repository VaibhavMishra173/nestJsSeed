import { Pager, PaginationDto } from '../../dto/pager.dto';
// import { Pager, PaginationDto } from 'src/dto/pager.dto';
import { Repository } from 'typeorm';
import { CustomRepository } from '../database/typeorm-ex.decorator';
import { TaskDto, TaskFilterDTO, TasksResponseDto } from './task.dto';
import { Task } from './task.entity';

@CustomRepository(Task)
export class TaskRepository extends Repository<Task> {
  async getAllTasks(
    pagination: PaginationDto,
    startIndex: number,
    userId: string,
    taskFilterDTO: TaskFilterDTO,
  ): Promise<TasksResponseDto> {
    const totalCount = await this.count();
    const priority = taskFilterDTO.priority;
    const status = taskFilterDTO.status;
    const dueDate = taskFilterDTO.dueDate;

    if (status != 'all') {
      const tasks = await this.createQueryBuilder('task')
        .leftJoinAndSelect('user', 'user', 'user.id = task.userId')
        .andWhere('user.id = :userId', { userId })
        .select(['user.email', 
        'user.name', 
        'task.id', 
        'task.title', 
        'task.description', 
        'task.priority', 
        'task.status', 
        'task.dueDate'
      ])
        .andWhere('task.priority = :priority', { priority })
        .andWhere('task.status = :status', { status })
        .orderBy('task.dueDate', dueDate)
        .limit(pagination.limit)
        .offset(startIndex)
        .getRawMany();

      const tasksDTORes: TaskDto[] = [];
      for (const item of tasks) {
        tasksDTORes.push(item);
      }
      const pager = new Pager(totalCount, Number(pagination.page), Number(pagination.limit), startIndex);
      const taskResWithPagination: TasksResponseDto = new TasksResponseDto();
      taskResWithPagination.tasks = tasksDTORes;
      taskResWithPagination.pager = pager;

      return taskResWithPagination;
    }
    const tasks = await this.createQueryBuilder('task')
      .leftJoinAndSelect('user', 'user', 'user.id = task.userId')
      .andWhere('user.id = :userId', { userId })
      .select([
        'user.email', 
        'user.name', 
        'task.id', 
        'task.title', 
        'task.description', 
        'task.priority', 
        'task.status', 
        'task.dueDate'
      ])
      .orderBy('task.dueDate', dueDate)
      .limit(pagination.limit)
      .offset(startIndex)
      .getRawMany();

    const tasksDTORes: TaskDto[] = [];
    for (const item of tasks) {
      tasksDTORes.push(item);
    }
    const pager = new Pager(totalCount, Number(pagination.page), Number(pagination.limit), startIndex);
    const taskResWithPagination: TasksResponseDto = new TasksResponseDto();
    taskResWithPagination.tasks = tasksDTORes;
    taskResWithPagination.pager = pager;

    return taskResWithPagination;
  }

}
