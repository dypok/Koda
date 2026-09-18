import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class VerifyOtpDto {
  @ApiProperty({
    description: 'Correo electrónico del usuario al que se le envió el OTP',
    example: 'estudiante@koda.academy',
  })
  @IsEmail({}, { message: 'El formato de correo electrónico no es válido' })
  @IsNotEmpty({ message: 'El correo electrónico es obligatorio' })
  email: string;

  @ApiProperty({
    description: 'Código numérico OTP de 6 dígitos enviado al correo',
    example: '123456',
  })
  @IsString()
  @IsNotEmpty({ message: 'El código OTP es obligatorio' })
  @Length(6, 6, { message: 'El código OTP debe ser de 6 dígitos' })
  token: string;

  @ApiPropertyOptional({
    description: 'Tipo de token OTP a validar',
    example: 'signup',
    default: 'signup',
  })
  @IsString()
  @IsOptional()
  type?: 'signup' | 'email';
}
