import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { GetUserProfileUseCase } from '@application/use-cases/users/get-user-profile.use-case';
import { UpdateUserProfileUseCase } from '@application/use-cases/users/update-user-profile.use-case';
import { USER_REPOSITORY_TOKEN } from '@domain/repositories/user.repository';
import { PrismaUserRepository } from '@infra/database/postgres/repositories/prisma-user.repository';
import { DatabaseModule } from '../../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [UsersController],
  providers: [
    GetUserProfileUseCase,
    UpdateUserProfileUseCase,
    {
      provide: USER_REPOSITORY_TOKEN,
      useClass: PrismaUserRepository,
    },
  ],
  exports: [GetUserProfileUseCase, UpdateUserProfileUseCase, USER_REPOSITORY_TOKEN],
})
export class UsersModule {}
