import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshSessionDto {
  @ApiProperty({
    description: 'Token de refresco (refresh token) para renovar la sesión activa',
    example: 'dGhpcy1pcy1hLXJlZnJlc2gtdG9rZW4...',
  })
  @IsString()
  @IsNotEmpty({ message: 'El refresh token es obligatorio' })
  refreshToken: string;
}
