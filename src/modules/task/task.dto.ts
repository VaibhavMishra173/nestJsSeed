import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { Pager } from '../../dto/pager.dto';
// import { Pager } from 'src/dto/pager.dto';

// enum taskStatus {'complete', 'incomplete'}

export class CreateTaskDto {
  @ApiProperty()
  @IsString()
  @MinLength(5)
  @IsNotEmpty({
    message: 'Task title is required',
  })
  title: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({
    message: 'Task priority is required',
  })
  priority: string;

  @ApiProperty({
    type: 'string',
    default: 'incomplete',
    enum: ['complete', 'incomplete'],
  })
  @IsString()
  status: string;

  @ApiProperty()
  @IsDateString()
  dueDate: string;
}

export class TaskDto {
  @ApiResponseProperty()
  title: string;

  @ApiResponseProperty()
  description: string;

  @ApiResponseProperty()
  priority: string;

  @ApiResponseProperty()
  status: string;

  @ApiResponseProperty()
  dueDate: string;
}

export class UpdateTaskDto {
  @ApiProperty()
  @IsOptional()
  title: string;

  @ApiProperty()
  @IsOptional()
  description: string;

  @ApiProperty()
  @IsOptional()
  priority: string;

  @ApiProperty()
  @IsOptional()
  status: string;

  @ApiProperty()
  @IsOptional()
  dueDate: string;
}

export class TasksResponseDto {
  @ApiResponseProperty()
  tasks: TaskDto[];

  @ApiResponseProperty()
  pager: Pager;
}

export class TaskFilterDTO {
  @ApiProperty()
  dueDate: 'ASC' | 'DESC';

  @ApiProperty()
  status: string;

  @ApiProperty()
  priority: string;
}