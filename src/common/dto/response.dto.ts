import { ApiProperty } from '@nestjs/swagger';

export class SuccessResponseDto<T = any> {
  @ApiProperty({ example: true, description: 'Indicates if the request was successful' })
  success: boolean;

  @ApiProperty({ example: 200, description: 'HTTP status code' })
  statusCode: number;

  @ApiProperty({ example: 'Request successful', description: 'Response message' })
  message: string;

  @ApiProperty({ description: 'Response data' })
  data: T;

  @ApiProperty({ example: '2024-01-15T10:30:00.000Z', description: 'Response timestamp' })
  timestamp: string;
}

export class ErrorResponseDto {
  @ApiProperty({ example: false, description: 'Indicates if the request failed' })
  success: boolean;

  @ApiProperty({ example: 400, description: 'HTTP status code' })
  statusCode: number;

  @ApiProperty({ example: 'Validation failed', description: 'Error message' })
  message: string;

  @ApiProperty({ example: 'Bad Request', description: 'Error type' })
  error: string;

  @ApiProperty({ example: '2024-01-15T10:30:00.000Z', description: 'Error timestamp' })
  timestamp: string;

  @ApiProperty({ example: '/api/v1/patient-status', description: 'Request path' })
  path: string;

  @ApiProperty({
    example: ['patientName must be at least 2 characters'],
    description: 'Validation error details',
    required: false,
  })
  details?: string[];
}

export class PaginationMetaDto {
  @ApiProperty({ example: 100, description: 'Total number of items' })
  total: number;

  @ApiProperty({ example: 1, description: 'Current page number' })
  page: number;

  @ApiProperty({ example: 10, description: 'Items per page' })
  limit: number;

  @ApiProperty({ example: 10, description: 'Total number of pages' })
  totalPages: number;
}
