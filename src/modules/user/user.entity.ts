import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Audit } from '../database-audit/audit.entity';
import { Role } from '../role/role.entity';
import { Task } from '../task/task.entity';

@Entity()
export class User extends Audit {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => Task, (task) => task.user)
  tasks: Task[];

  @Column({ default: null })
  name: string;

  @Column({
    length: 255,
    unique: true,
  })
  email: string;

  @Column({
    length: 100,
  })
  password: string;

  @OneToMany(() => Task, (task) => task.user)
  tasks: Task[];

  @ManyToMany(() => Role)
  @JoinTable({
    name: 'user_role',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
  })
  roles: Promise<Role[]>;
}
