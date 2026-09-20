import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({
    description: 'Token o código temporal de recuperación recibido por correo',
    example: 'd3f9e8a7b6c5...',
  })
  @IsString({ message: 'El token debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El token de recuperación es obligatorio' })
  token: string;

  @ApiPropertyOptional({
    description: 'Correo electrónico del usuario asociado a la recuperación (opcional si el token contiene la identidad)',
    example: 'estudiante@koda.academy',
  })
  @IsEmail({}, { message: 'El formato de correo electrónico no es válido' })
  @IsOptional()
  email?: string;

  @ApiProperty({
    description: 'Nueva contraseña segura (mínimo 8 caracteres, mayúscula, minúscula, número y símbolo especial)',
    example: 'KodaPass#2026',
  })
  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La nueva contraseña es obligatoria' })
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_-])[A-Za-z\d@$!%*?&#^()_-]{8,}$/, {
    message: 'La contraseña debe incluir al menos una letra mayúscula, una minúscula, un número y un carácter especial (@$!%*?&#^()_-)',
  })
  newPassword: string;
}
