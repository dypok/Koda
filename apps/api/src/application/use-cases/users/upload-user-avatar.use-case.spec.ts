import { BadRequestException, NotFoundException } from '@nestjs/common';
import {
  UploadUserAvatarUseCase,
  UploadedAvatarFile,
  MAX_AVATAR_FILE_SIZE_BYTES,
} from './upload-user-avatar.use-case';
import { IUserRepository } from '@domain/repositories/user.repository';
import { UserEntity } from '@domain/entities/user.entity';
import { SupabaseService } from '../../../database/supabase.service';
import { IObjectStorageService } from '../../../infrastructure/storage/object-storage.interface';

describe('UploadUserAvatarUseCase', () => {
  let useCase: UploadUserAvatarUseCase;
  let userRepository: jest.Mocked<IUserRepository>;
  let objectStorageService: jest.Mocked<IObjectStorageService>;
  let supabaseService: jest.Mocked<SupabaseService>;

  const createMockUserEntity = () =>
    new UserEntity({
      id: 'user-uuid-123',
      email: 'estudiante@koda.academy',
      role: 'user',
      status: 'active',
      displayName: 'Dylan Gamero',
      avatarUrl: '/brand/koda-mascot-cartoon-2d.svg',
      avatarObjectKey: null,
      documentNumber: null,
      documentType: null,
      bio: null,
      timezone: 'America/Bogota',
      locale: 'es-CO',
      onboardingCompleted: true,
      initialLanguageSlug: 'python',
      experienceLevel: 'beginner',
      learningStyle: 'hands-on',
      dailyGoalId: 'regular',
      dailyGoalMinutes: 10,
      totalXp: 250,
      currentLevel: 2,
      currentStreak: 3,
      longestStreak: 5,
      streakFreezeCount: 1,
      totalStudyTimeSeconds: 1800,
      lastStudyDate: null,
      createdAt: new Date('2026-09-01T00:00:00Z'),
      updatedAt: new Date('2026-09-01T00:00:00Z'),
    });

  const validFile: UploadedAvatarFile = {
    originalname: 'profile.png',
    mimetype: 'image/png',
    size: 250 * 1024, // 250 KB
    buffer: Buffer.from('fake-png-binary-content'),
  };

  beforeEach(() => {
    userRepository = {
      findById: jest.fn(),
      findByEmail: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      updateProfile: jest.fn(),
      updateGamification: jest.fn(),
    };

    objectStorageService = {
      uploadFile: jest.fn(),
      getPublicUrl: jest.fn(),
      getFileStream: jest.fn(),
      deleteFile: jest.fn(),
      ensureBucketExists: jest.fn(),
    };

    supabaseService = {
      updateUserMetadata: jest.fn(),
      verifyAuthToken: jest.fn(),
      getClient: jest.fn(),
    } as unknown as jest.Mocked<SupabaseService>;

    useCase = new UploadUserAvatarUseCase(
      userRepository,
      objectStorageService,
      supabaseService,
    );
  });

  it('debe subir el avatar a Siigo Storage, actualizar PostgreSQL y sincronizar Supabase Auth', async () => {
    const user = createMockUserEntity();
    userRepository.findById.mockResolvedValue(user);
    userRepository.update.mockImplementation(async (entity) => entity);

    const mockStorageResult = {
      storagePath: 'avatars/users/user-uuid-123/avatar-1700000000.png',
      storageUrl:
        'http://localhost:9000/avatars/users/user-uuid-123/avatar-1700000000.png',
      fileSizeBytes: validFile.size,
      sha256Hash: 'dummyhash',
    };
    objectStorageService.uploadFile.mockResolvedValue(mockStorageResult);
    supabaseService.updateUserMetadata.mockResolvedValue({} as any);

    const result = await useCase.execute('user-uuid-123', validFile);

    expect(result.avatarUrl).toBe(mockStorageResult.storageUrl);
    expect(result.avatarObjectKey).toBe(mockStorageResult.storagePath);
    expect(objectStorageService.uploadFile).toHaveBeenCalledWith({
      bucket: 'avatars',
      key: expect.stringMatching(/^users\/user-uuid-123\/avatar-\d+\.png$/),
      buffer: validFile.buffer,
      mimeType: 'image/png',
    });
    expect(userRepository.update).toHaveBeenCalledTimes(1);
    expect(supabaseService.updateUserMetadata).toHaveBeenCalledWith('user-uuid-123', {
      avatar_url: mockStorageResult.storageUrl,
    });
  });

  it('debe lanzar BadRequestException si no se proporciona archivo', async () => {
    await expect(useCase.execute('user-uuid-123', undefined)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('debe lanzar BadRequestException si el archivo supera los 3 MB', async () => {
    const oversizedFile: UploadedAvatarFile = {
      ...validFile,
      size: MAX_AVATAR_FILE_SIZE_BYTES + 1024,
    };

    await expect(useCase.execute('user-uuid-123', oversizedFile)).rejects.toThrow(
      BadRequestException,
    );
    expect(objectStorageService.uploadFile).not.toHaveBeenCalled();
  });

  it('debe lanzar BadRequestException si el MIME type no es una imagen permitida', async () => {
    const invalidMimeFile: UploadedAvatarFile = {
      ...validFile,
      originalname: 'malware.exe',
      mimetype: 'application/x-msdownload',
    };

    await expect(useCase.execute('user-uuid-123', invalidMimeFile)).rejects.toThrow(
      BadRequestException,
    );
    expect(objectStorageService.uploadFile).not.toHaveBeenCalled();
  });

  it('debe lanzar NotFoundException si el usuario no existe', async () => {
    userRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute('non-existent', validFile)).rejects.toThrow(
      NotFoundException,
    );
    expect(objectStorageService.uploadFile).not.toHaveBeenCalled();
  });

  it('debe tolerar fallos en la sincronización de metadata con Supabase Auth sin arrojar error fatal', async () => {
    const user = createMockUserEntity();
    userRepository.findById.mockResolvedValue(user);
    userRepository.update.mockImplementation(async (entity) => entity);
    objectStorageService.uploadFile.mockResolvedValue({
      storagePath: 'avatars/users/user-uuid-123/avatar.webp',
      storageUrl: 'http://localhost:9000/avatars/users/user-uuid-123/avatar.webp',
      fileSizeBytes: validFile.size,
      sha256Hash: 'dummyhash',
    });
    supabaseService.updateUserMetadata.mockRejectedValue(new Error('Auth timeout'));

    const webpFile: UploadedAvatarFile = {
      ...validFile,
      originalname: 'photo.webp',
      mimetype: 'image/webp',
    };

    const result = await useCase.execute('user-uuid-123', webpFile);
    expect(result.avatarUrl).toContain('avatar.webp');
    expect(userRepository.update).toHaveBeenCalledTimes(1);
  });
});
