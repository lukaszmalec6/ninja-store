import {Injectable, Inject} from '@nestjs/common';
import {User} from './user.model';
import {IUserData, UserStatus, UserRole} from './user.interfaces'
import {InjectableSymbols} from '../injectable';

@Injectable()
export class UserSerivce {
  constructor(@Inject(InjectableSymbols.userRepository) private readonly userRepository: typeof User) {}

  public async getByEmail(email: string): Promise<User> {
    try {
      return await this.userRepository.findOne({
        where: {email},
        attributes: {
          exclude: ['password']
        }
      })
    } catch (error) {
      throw new Error(`Can't get user profile for user: ${email}: ${error}`);
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
      throw new Error(`Can't save user with data ${JSON.stringify(userData)}: ${error}`);
    }
  }
}