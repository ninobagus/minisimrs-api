import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
  ApiBasicAuth,
  ApiExtraModels,
} from '@nestjs/swagger';
import { PatientStatusService } from './patient-status.service';
import { CreatePatientStatusDto } from './dto/create-patient-status.dto';
import { UpdatePatientStatusDto } from './dto/update-patient-status.dto';
import { QueryPatientStatusDto } from './dto/query-patient-status.dto';
import { PatientStatus, PatientStatusStatistics, PatientStatusType } from './entities/patient-status.entity';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/auth.service';
import { ApiSuccessResponse, ApiErrorResponses } from '../common/swagger/api-response.decorator';

@ApiTags('Patient Status')
@ApiBasicAuth('basic-auth')
@ApiExtraModels(PatientStatus, PatientStatusStatistics)
@Controller('patient-status')
@UseGuards(AuthGuard, RolesGuard)
export class PatientStatusController {
  constructor(private readonly patientStatusService: PatientStatusService) {}

  /**
   * GET /api/v1/patient-status
   * Get all patient status records
   */
  @Get()
  @Roles(Role.ADMIN, Role.VIEWER)
  @ApiOperation({
    summary: 'Get all patient status records',
    description: 'Mendapatkan semua data status pasien dengan opsi filter. Role yang diizinkan: ADMIN, VIEWER',
  })
  @ApiQuery({ name: 'status', enum: PatientStatusType, required: false, description: 'Filter by status' })
  @ApiQuery({ name: 'department', type: String, required: false, description: 'Filter by department' })
  @ApiQuery({ name: 'patientId', type: String, required: false, description: 'Filter by patient ID' })
  @ApiQuery({ name: 'includeDeleted', type: Boolean, required: false, description: 'Include deleted records' })
  @ApiSuccessResponse(PatientStatus, true)
  @ApiErrorResponses()
  async findAll(@Query() query: QueryPatientStatusDto) {
    const data = await this.patientStatusService.findAll(query);
    return {
      success: true,
      statusCode: 200,
      message: `Found ${data.length} patient status records`,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * GET /api/v1/patient-status/statistics
   * Get statistics
   */
  @Get('statistics')
  @Roles(Role.ADMIN, Role.VIEWER)
  @ApiOperation({
    summary: 'Get patient status statistics',
    description: 'Mendapatkan statistik data status pasien. Role yang diizinkan: ADMIN, VIEWER',
  })
  @ApiSuccessResponse(PatientStatusStatistics)
  @ApiErrorResponses()
  async getStatistics() {
    const data = await this.patientStatusService.getStatistics();
    return {
      success: true,
      statusCode: 200,
      message: 'Statistics retrieved successfully',
      data,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * GET /api/v1/patient-status/:id
   * Get patient status by ID
   */
  @Get(':id')
  @Roles(Role.ADMIN, Role.VIEWER)
  @ApiOperation({
    summary: 'Get patient status by ID',
    description: 'Mendapatkan detail status pasien berdasarkan ID. Role yang diizinkan: ADMIN, VIEWER',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Patient status UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiQuery({
    name: 'includeDeleted',
    type: Boolean,
    required: false,
    description: 'Include if record is deleted',
  })
  @ApiSuccessResponse(PatientStatus)
  @ApiErrorResponses()
  async findOne(
    @Param('id') id: string,
    @Query('includeDeleted') includeDeleted?: boolean,
  ) {
    const data = await this.patientStatusService.findOne(id, includeDeleted);
    return {
      success: true,
      statusCode: 200,
      message: 'Patient status retrieved successfully',
      data,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * POST /api/v1/patient-status
   * Create new patient status
   */
  @Post()
  @Roles(Role.ADMIN, Role.OPERATOR)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create new patient status',
    description: 'Membuat record status pasien baru. Role yang diizinkan: ADMIN, OPERATOR',
  })
  @ApiSuccessResponse(PatientStatus, false, 'created')
  @ApiErrorResponses()
  async create(@Body() createDto: CreatePatientStatusDto, @Req() req: any) {
    const data = await this.patientStatusService.create(createDto, req.user.id);
    return {
      success: true,
      statusCode: 201,
      message: 'Patient status created successfully',
      data,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * POST /api/v1/patient-status/:id/update
   * Update patient status
   */
  @Post(':id/update')
  @Roles(Role.ADMIN, Role.OPERATOR)
  @ApiOperation({
    summary: 'Update patient status',
    description: 'Mengupdate record status pasien. Role yang diizinkan: ADMIN, OPERATOR',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Patient status UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiSuccessResponse(PatientStatus)
  @ApiErrorResponses()
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdatePatientStatusDto,
    @Req() req: any,
  ) {
    const data = await this.patientStatusService.update(id, updateDto, req.user.id);
    return {
      success: true,
      statusCode: 200,
      message: 'Patient status updated successfully',
      data,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * POST /api/v1/patient-status/:id/soft-delete
   * Soft delete patient status
   */
  @Post(':id/soft-delete')
  @Roles(Role.ADMIN, Role.OPERATOR)
  @ApiOperation({
    summary: 'Soft delete patient status',
    description: 'Menghapus record secara soft delete. Role yang diizinkan: ADMIN, OPERATOR',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Patient status UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiSuccessResponse(PatientStatus)
  @ApiErrorResponses()
  async softDelete(@Param('id') id: string, @Req() req: any) {
    const data = await this.patientStatusService.softDelete(id, req.user.id);
    return {
      success: true,
      statusCode: 200,
      message: 'Patient status soft deleted successfully',
      data,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * POST /api/v1/patient-status/:id/restore
   * Restore soft deleted patient status
   */
  @Post(':id/restore')
  @Roles(Role.ADMIN, Role.OPERATOR)
  @ApiOperation({
    summary: 'Restore deleted patient status',
    description: 'Mengembalikan record yang sudah di-soft delete. Role yang diizinkan: ADMIN, OPERATOR',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Patient status UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiSuccessResponse(PatientStatus)
  @ApiErrorResponses()
  async restore(@Param('id') id: string, @Req() req: any) {
    const data = await this.patientStatusService.restore(id, req.user.id);
    return {
      success: true,
      statusCode: 200,
      message: 'Patient status restored successfully',
      data,
      timestamp: new Date().toISOString(),
    };
  }
}
