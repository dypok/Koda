import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ResendOtpDto {
  @ApiProperty({
    description: 'Correo electrónico para reenvío de OTP',
    example: 'estudiante@koda.academy',
  })
  @IsEmail({}, { message: 'El formato de correo electrónico no es válido' })
  @IsNotEmpty({ message: 'El correo electrónico es obligatorio' })
  email: string;

  @ApiPropertyOptional({
    description: 'Tipo de reenvío',
    example: 'signup',
    default: 'signup',
  })
  @IsString()
  @IsOptional()
  type?: 'signup' | 'email_change';
}
