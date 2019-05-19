import {
  Table,
  Column,
  Model,
  AllowNull,
  DataType,
  Default,
  PrimaryKey,
  Unique
} from 'sequelize-typescript';

import {Injectable} from '@nestjs/common';

@Injectable()
@Table({
  tableName: `category`,
  timestamps: true,
})
export class Category extends Model<Category> {
  
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({type: DataType.UUID})
  id: string;

  @AllowNull(false)
  @Unique
  @Column
  name: string;

}