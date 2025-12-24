import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsBoolean, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { PatientStatusType } from '../entities/patient-status.entity';

export class QueryPatientStatusDto {
  @ApiProperty({
    enum: PatientStatusType,
    example: PatientStatusType.WAITING,
    description: 'Filter by patient status',
    required: false,
  })
  @IsEnum(PatientStatusType, {
    message: `Status must be one of: ${Object.values(PatientStatusType).join(', ')}`,
  })
  @IsOptional()
  status?: PatientStatusType;

  @ApiProperty({
    example: 'Emergency',
    description: 'Filter by department (partial match)',
    required: false,
  })
  @IsString()
  @IsOptional()
  department?: string;

  @ApiProperty({
    example: 'P001',
    description: 'Filter by patient ID (exact match)',
    required: false,
  })
  @IsString()
  @IsOptional()
  patientId?: string;

  @ApiProperty({
    example: false,
    description: 'Include soft-deleted records',
    required: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  includeDeleted?: boolean = false;
}
