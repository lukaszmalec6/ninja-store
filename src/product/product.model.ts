import {Table, Column, Model, AllowNull, DataType, Unique, Default, PrimaryKey, ForeignKey, BelongsTo, HasMany} from 'sequelize-typescript';
import {Injectable} from '@nestjs/common';
import {Category} from '../category';
import {Order} from '../order';

@Injectable()
@Table({
  tableName: 'product',
  timestamps: true,
})
export class Product extends Model<Product> {

  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({type: DataType.UUID}) 
  id: string;

  @AllowNull(false)
  @Column
  imageUrl: string;

  @AllowNull(false)
  @Column
  price: number;

  @AllowNull(false)
  @Column
  description: string;

  @AllowNull(false)
  @ForeignKey(() => Category)
  @Column({type: DataType.UUID})
  categoryId: string

  @BelongsTo(() => Category, `categoryId`)
  category: Category

  @HasMany(() => Order, {
    onDelete: `CASCADE`,
  })
  orders: Order
}