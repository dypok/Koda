import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import {
  IUserRepository,
  UpdateUserProfileDto,
  UpdateUserGamificationDto,
} from '@domain/repositories/user.repository';
import { UserEntity } from '@domain/entities/user.entity';
import { UserMapper } from '../mappers/user.mapper';

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  private readonly logger = new Logger(PrismaUserRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<UserEntity | null> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
      });
      return user ? UserMapper.toDomain(user) : null;
    } catch (error: any) {
      this.logger.error(`Error finding user by ID ${id}: ${error?.message || error}`);
      throw error;
    }
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email: email.toLowerCase().trim() },
      });
      return user ? UserMapper.toDomain(user) : null;
    } catch (error: any) {
      this.logger.error(`Error finding user by email ${email}: ${error?.message || error}`);
      throw error;
    }
  }

  async create(entity: UserEntity): Promise<UserEntity> {
    try {
      const data = UserMapper.toPersistence(entity);
      const created = await this.prisma.user.create({
        data,
      });
      return UserMapper.toDomain(created);
    } catch (error: any) {
      this.logger.error(`Error creating user ${entity.id}: ${error?.message || error}`);
      throw error;
    }
  }

  async update(entity: UserEntity): Promise<UserEntity> {
    try {
      const data = UserMapper.toPersistence(entity);
      const updated = await this.prisma.user.update({
        where: { id: entity.id },
        data,
      });
      return UserMapper.toDomain(updated);
    } catch (error: any) {
      this.logger.error(`Error updating user ${entity.id}: ${error?.message || error}`);
      throw error;
    }
  }

  async updateProfile(id: string, data: UpdateUserProfileDto): Promise<UserEntity> {
    try {
      const updated = await this.prisma.user.update({
        where: { id },
        data: {
          displayName: data.displayName,
          avatarUrl: data.avatarUrl,
          avatarObjectKey: data.avatarObjectKey,
          documentNumber: data.documentNumber,
          documentType: data.documentType,
          bio: data.bio,
          timezone: data.timezone,
          locale: data.locale,
          initialLanguageSlug: data.initialLanguageSlug,
          experienceLevel: data.experienceLevel,
          learningStyle: data.learningStyle,
          dailyGoalId: data.dailyGoalId,
          dailyGoalMinutes: data.dailyGoalMinutes,
        },
      });
      return UserMapper.toDomain(updated);
    } catch (error: any) {
      this.logger.error(`Error updating profile for user ${id}: ${error?.message || error}`);
      throw error;
    }
  }

  async updateGamification(id: string, data: UpdateUserGamificationDto): Promise<UserEntity> {
    try {
      const updated = await this.prisma.user.update({
        where: { id },
        data: {
          totalXp: data.totalXp,
          currentLevel: data.currentLevel,
          currentStreak: data.currentStreak,
          longestStreak: data.longestStreak,
          streakFreezeCount: data.streakFreezeCount,
          totalStudyTimeSeconds: data.totalStudyTimeSeconds,
          lastStudyDate: data.lastStudyDate,
        },
      });
      return UserMapper.toDomain(updated);
    } catch (error: any) {
      this.logger.error(`Error updating gamification stats for user ${id}: ${error?.message || error}`);
      throw error;
    }
  }
}