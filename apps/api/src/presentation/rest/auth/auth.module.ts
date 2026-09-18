import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { ValidateUserSessionUseCase } from '@application/use-cases/auth/validate-user-session.use-case';
import { RegisterWithOtpUseCase } from '@application/use-cases/auth/register-with-otp.use-case';
import { VerifyOtpUseCase } from '@application/use-cases/auth/verify-otp.use-case';
import { CompleteOnboardingUseCase } from '@application/use-cases/auth/complete-onboarding.use-case';
import { USER_REPOSITORY_TOKEN } from '@domain/repositories/user.repository';
import { PrismaUserRepository } from '@infra/database/postgres/repositories/prisma-user.repository';
import { DatabaseModule } from '../../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [AuthController],
  providers: [
    ValidateUserSessionUseCase,
    RegisterWithOtpUseCase,
    VerifyOtpUseCase,
    CompleteOnboardingUseCase,
    {
      provide: USER_REPOSITORY_TOKEN,
      useClass: PrismaUserRepository,
    },
  ],
  exports: [
    ValidateUserSessionUseCase,
    RegisterWithOtpUseCase,
    VerifyOtpUseCase,
    CompleteOnboardingUseCase,
    USER_REPOSITORY_TOKEN,
  ],
})
export class AuthModule {}