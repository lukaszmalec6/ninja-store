import {Table, Column, Model, AllowNull, DataType, Unique, Default, PrimaryKey} from 'sequelize-typescript';
import {Injectable} from '@nestjs/common';
import {UserStatus, UserRole} from './user.interfaces';

@Injectable()
@Table({
  tableName: 'user',
  timestamps: true,
})
export class User extends Model<User> {
  
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({type: DataType.UUID}) 
  id: string;

  @AllowNull(false)
  @Column
  firstName: string;

  @AllowNull(false)
  @Column
  lastName: string;

  @AllowNull(false)
  @Unique
  @Column
  email: string;

  @AllowNull(false)
  @Column
  password: string;

  @AllowNull(false)
  @Default(UserStatus.active)
  @Column({type: DataType.ENUM(UserStatus.active, UserStatus.banned)}) 
  status: string;

  @AllowNull(false)
  @Default(UserRole.standard)
  @Column({type: DataType.ENUM(UserRole.admin, UserRole.standard)}) 
  role: string;
}