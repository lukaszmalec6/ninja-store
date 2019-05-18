import {Injectable, Inject, BadRequestException} from '@nestjs/common';
import {User} from './user.model';
import {IUserData, UserStatus, UserRole} from './user.interfaces'
import {InjectableSymbols} from '../_utils/injectable';

@Injectable()
export class UserSerivce {
  constructor(@Inject(InjectableSymbols.userRepository) private readonly userRepository: typeof User) {}

  /*
      Returns user auth data, for server-side usage only!
  */
  public async getAuth(param: {[key: string]: string}): Promise<User> {
    try {
      return await this.userRepository.scope(`auth`).findOne({where: param})
    } catch (error) {
      throw new Error(`Can't get user by param: ${JSON.stringify(param)}: ${error}`);
    }
  }

  public async create(userData: IUserData): Promise<User> {
    try {
      const user = new User({
        ...userData,
        status: userData.status || UserStatus.active,
        role: UserRole.standard,
      });
      return await user.save();
    } catch (error) {
      if (error.name === `SequelizeUniqueConstraintError`) {
        throw new BadRequestException(`Email already in use`);
      }
      throw new Error(`Can't save user with data ${JSON.stringify(userData)}: ${error}`);
    }
  }
}