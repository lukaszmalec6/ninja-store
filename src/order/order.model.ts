import {
  Table,
  Column,
  Model,
  AllowNull,
  DataType,
  Default,
  PrimaryKey,
  ForeignKey,
  BelongsTo
} from 'sequelize-typescript';
import {Injectable} from '@nestjs/common';
import {User} from '../user';
import {Product} from '../product';

@Injectable()
@Table({
  tableName: `order`,
  timestamps: true,
})
export class Order extends Model<Order> {
  
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({type: DataType.UUID})
  id: string;
  
  @AllowNull(false)
  @ForeignKey(() => User)
  @Column({type: DataType.UUID})
  userId: string

  @BelongsTo(() => User, `userId`)
  user: User

  @AllowNull(false)
  @ForeignKey(() => Product)
  @Column({type: DataType.UUID})
  productId: string

  @BelongsTo(() => Product, `productId`)
  product: Product

}