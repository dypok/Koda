import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { GetUserProfileUseCase } from '@application/use-cases/users/get-user-profile.use-case';
import { UpdateUserProfileUseCase } from '@application/use-cases/users/update-user-profile.use-case';
import { UploadUserAvatarUseCase } from '@application/use-cases/users/upload-user-avatar.use-case';
import { USER_REPOSITORY_TOKEN } from '@domain/repositories/user.repository';
import { PrismaUserRepository } from '@infra/database/postgres/repositories/prisma-user.repository';
import { DatabaseModule } from '../../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [UsersController],
  providers: [
    GetUserProfileUseCase,
    UpdateUserProfileUseCase,
    UploadUserAvatarUseCase,
    {
      provide: USER_REPOSITORY_TOKEN,
      useClass: PrismaUserRepository,
    },
  ],
  exports: [
    GetUserProfileUseCase,
    UpdateUserProfileUseCase,
    UploadUserAvatarUseCase,
    USER_REPOSITORY_TOKEN,
  ],
})
export class UsersModule {}
