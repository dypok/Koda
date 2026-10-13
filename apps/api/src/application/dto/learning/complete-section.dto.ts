import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';

export class CompleteSectionDto {
  @IsString()
  @IsNotEmpty()
  sectionId!: string;

  @IsString()
  @IsNotEmpty()
  moduleId!: string;

  @IsString()
  @IsNotEmpty()
  courseId!: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  accuracyPercentage!: number;
}
