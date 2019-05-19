import {
  Table,
  Column,
  Model,
  AllowNull,
  DataType,
  Default,
  PrimaryKey,
  ForeignKey,
  BelongsTo,
  HasMany,
  Scopes
} from 'sequelize-typescript';
import {Injectable} from '@nestjs/common';
import {Category} from '../category';
import {Order} from '../order';


@Injectable()
@Scopes({
  list: {
    attributes: [`id`, `name`, `description`, `imageUrl`, `price`]
  }
})
@Table({
  tableName: `product`,
  timestamps: true,
})
export class Product extends Model<Product> {

  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({type: DataType.UUID}) 
  id: string;

  @AllowNull(false)
  @Column
  name: string;

  @AllowNull(false)
  @Column
  imageUrl: string;

  @AllowNull(false)
  @Column({type: DataType.DECIMAL(12,2)})
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