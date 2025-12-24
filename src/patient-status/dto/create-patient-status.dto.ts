import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';
import { PatientStatusType } from '../entities/patient-status.entity';

export class CreatePatientStatusDto {
  @ApiProperty({
    example: 'P001',
    description: 'Unique patient identifier',
    minLength: 3,
    maxLength: 50,
  })
  @IsString({ message: 'Patient ID must be a string' })
  @IsNotEmpty({ message: 'Patient ID is required' })
  @MinLength(3, { message: 'Patient ID must be at least 3 characters' })
  @MaxLength(50, { message: 'Patient ID must not exceed 50 characters' })
  patientId: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'Patient full name',
    minLength: 2,
    maxLength: 100,
  })
  @IsString({ message: 'Patient name must be a string' })
  @IsNotEmpty({ message: 'Patient name is required' })
  @MinLength(2, { message: 'Patient name must be at least 2 characters' })
  @MaxLength(100, { message: 'Patient name must not exceed 100 characters' })
  patientName: string;

  @ApiProperty({
    example: 'MR-123456',
    description: 'Medical record number (format: MR-XXXXXX with 6-10 digits)',
    pattern: '^MR-[0-9]{6,10}$',
  })
  @IsString({ message: 'Medical record number must be a string' })
  @IsNotEmpty({ message: 'Medical record number is required' })
  @Matches(/^MR-[0-9]{6,10}$/, {
    message: 'Medical record number must be in format MR-XXXXXX (6-10 digits)',
  })
  medicalRecordNumber: string;

  @ApiProperty({
    enum: PatientStatusType,
    example: PatientStatusType.REGISTERED,
    description: 'Patient status',
  })
  @IsEnum(PatientStatusType, {
    message: `Status must be one of: ${Object.values(PatientStatusType).join(', ')}`,
  })
  @IsNotEmpty({ message: 'Status is required' })
  status: PatientStatusType;

  @ApiProperty({
    example: 'Emergency',
    description: 'Hospital department name',
    minLength: 2,
    maxLength: 50,
  })
  @IsString({ message: 'Department must be a string' })
  @IsNotEmpty({ message: 'Department is required' })
  @MinLength(2, { message: 'Department must be at least 2 characters' })
  @MaxLength(50, { message: 'Department must not exceed 50 characters' })
  department: string;

  @ApiProperty({
    example: 'ER-101',
    description: 'Room number (optional)',
    required: false,
    maxLength: 20,
  })
  @IsString({ message: 'Room number must be a string' })
  @IsOptional()
  @MaxLength(20, { message: 'Room number must not exceed 20 characters' })
  roomNumber?: string;

  @ApiProperty({
    example: 'Dr. Smith',
    description: 'Attending doctor name (optional)',
    required: false,
    maxLength: 100,
  })
  @IsString({ message: 'Doctor name must be a string' })
  @IsOptional()
  @MaxLength(100, { message: 'Doctor name must not exceed 100 characters' })
  doctorName?: string;

  @ApiProperty({
    example: 'Initial registration for emergency care',
    description: 'Additional notes (optional)',
    required: false,
    maxLength: 500,
  })
  @IsString({ message: 'Notes must be a string' })
  @IsOptional()
  @MaxLength(500, { message: 'Notes must not exceed 500 characters' })
  notes?: string;
}
