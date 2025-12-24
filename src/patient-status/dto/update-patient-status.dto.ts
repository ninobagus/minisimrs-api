import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsOptional,
  MaxLength,
  MinLength,
} from 'class-validator';
import { PatientStatusType } from '../entities/patient-status.entity';

export class UpdatePatientStatusDto {
  @ApiProperty({
    enum: PatientStatusType,
    example: PatientStatusType.IN_EXAMINATION,
    description: 'New patient status',
    required: false,
  })
  @IsEnum(PatientStatusType, {
    message: `Status must be one of: ${Object.values(PatientStatusType).join(', ')}`,
  })
  @IsOptional()
  status?: PatientStatusType;

  @ApiProperty({
    example: 'Cardiology',
    description: 'Hospital department name',
    required: false,
    minLength: 2,
    maxLength: 50,
  })
  @IsString({ message: 'Department must be a string' })
  @IsOptional()
  @MinLength(2, { message: 'Department must be at least 2 characters' })
  @MaxLength(50, { message: 'Department must not exceed 50 characters' })
  department?: string;

  @ApiProperty({
    example: 'CARD-201',
    description: 'Room number',
    required: false,
    maxLength: 20,
  })
  @IsString({ message: 'Room number must be a string' })
  @IsOptional()
  @MaxLength(20, { message: 'Room number must not exceed 20 characters' })
  roomNumber?: string;

  @ApiProperty({
    example: 'Dr. Johnson',
    description: 'Attending doctor name',
    required: false,
    maxLength: 100,
  })
  @IsString({ message: 'Doctor name must be a string' })
  @IsOptional()
  @MaxLength(100, { message: 'Doctor name must not exceed 100 characters' })
  doctorName?: string;

  @ApiProperty({
    example: 'Transferred to cardiology department',
    description: 'Additional notes',
    required: false,
    maxLength: 500,
  })
  @IsString({ message: 'Notes must be a string' })
  @IsOptional()
  @MaxLength(500, { message: 'Notes must not exceed 500 characters' })
  notes?: string;
}
