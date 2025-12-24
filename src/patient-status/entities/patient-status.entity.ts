import { ApiProperty } from '@nestjs/swagger';

export enum PatientStatusType {
  REGISTERED = 'REGISTERED',           // Pasien terdaftar
  WAITING = 'WAITING',                 // Menunggu pemeriksaan
  IN_EXAMINATION = 'IN_EXAMINATION',   // Sedang diperiksa
  LAB_TEST = 'LAB_TEST',               // Tes laboratorium
  RADIOLOGY = 'RADIOLOGY',             // Radiologi
  PHARMACY = 'PHARMACY',               // Mengambil obat
  INPATIENT = 'INPATIENT',             // Rawat inap
  SURGERY = 'SURGERY',                 // Operasi
  RECOVERY = 'RECOVERY',               // Pemulihan
  DISCHARGED = 'DISCHARGED',           // Pulang
  REFERRED = 'REFERRED',               // Dirujuk
  CANCELLED = 'CANCELLED',             // Dibatalkan
}

export class PatientStatus {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Unique identifier (UUID)',
  })
  id: string;

  @ApiProperty({
    example: 'P001',
    description: 'Patient ID',
  })
  patientId: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'Patient full name',
  })
  patientName: string;

  @ApiProperty({
    example: 'MR-123456',
    description: 'Medical record number (format: MR-XXXXXX)',
  })
  medicalRecordNumber: string;

  @ApiProperty({
    enum: PatientStatusType,
    example: PatientStatusType.REGISTERED,
    description: 'Current patient status',
  })
  status: PatientStatusType;

  @ApiProperty({
    enum: PatientStatusType,
    example: PatientStatusType.WAITING,
    description: 'Previous patient status',
    required: false,
  })
  previousStatus?: PatientStatusType;

  @ApiProperty({
    example: 'Emergency',
    description: 'Hospital department',
  })
  department: string;

  @ApiProperty({
    example: 'ER-101',
    description: 'Room number',
    required: false,
  })
  roomNumber?: string;

  @ApiProperty({
    example: 'Dr. Smith',
    description: 'Attending doctor name',
    required: false,
  })
  doctorName?: string;

  @ApiProperty({
    example: 'Initial registration for emergency care',
    description: 'Additional notes',
    required: false,
  })
  notes?: string;

  @ApiProperty({
    example: '2024-01-15T10:30:00.000Z',
    description: 'Record creation timestamp',
  })
  createdAt: string;

  @ApiProperty({
    example: '2024-01-15T11:00:00.000Z',
    description: 'Last update timestamp',
  })
  updatedAt: string;

  @ApiProperty({
    example: 'user-b',
    description: 'User ID who created the record',
  })
  createdBy: string;

  @ApiProperty({
    example: 'user-b',
    description: 'User ID who last updated the record',
  })
  updatedBy: string;

  @ApiProperty({
    example: false,
    description: 'Soft delete flag',
  })
  isDeleted: boolean;

  @ApiProperty({
    example: '2024-01-15T12:00:00.000Z',
    description: 'Deletion timestamp',
    required: false,
  })
  deletedAt?: string;

  @ApiProperty({
    example: 'user-b',
    description: 'User ID who deleted the record',
    required: false,
  })
  deletedBy?: string;
}

export class PatientStatusStatistics {
  @ApiProperty({ example: 100, description: 'Total records' })
  total: number;

  @ApiProperty({ example: 95, description: 'Active (non-deleted) records' })
  active: number;

  @ApiProperty({ example: 5, description: 'Soft-deleted records' })
  deleted: number;

  @ApiProperty({
    example: { REGISTERED: 20, WAITING: 15, IN_EXAMINATION: 10 },
    description: 'Count by status',
  })
  byStatus: Record<string, number>;
}
