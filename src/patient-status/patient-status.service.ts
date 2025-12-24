import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { RedisService } from '../redis/redis.service';
import { PatientStatus, PatientStatusType } from './entities/patient-status.entity';
import { CreatePatientStatusDto } from './dto/create-patient-status.dto';
import { UpdatePatientStatusDto } from './dto/update-patient-status.dto';
import { QueryPatientStatusDto } from './dto/query-patient-status.dto';

@Injectable()
export class PatientStatusService {
  private readonly PATIENT_STATUS_KEY = 'patient_status';
  private readonly ACTIVE_INDEX_KEY = 'patient_status:active';
  private readonly DELETED_INDEX_KEY = 'patient_status:deleted';

  constructor(private readonly redisService: RedisService) {}

  async create(
    createDto: CreatePatientStatusDto,
    userId: string,
  ): Promise<PatientStatus> {
    const id = uuidv4();
    const now = new Date().toISOString();

    const patientStatus: PatientStatus = {
      id,
      patientId: createDto.patientId,
      patientName: createDto.patientName,
      medicalRecordNumber: createDto.medicalRecordNumber,
      status: createDto.status,
      department: createDto.department,
      roomNumber: createDto.roomNumber,
      doctorName: createDto.doctorName,
      notes: createDto.notes,
      createdAt: now,
      updatedAt: now,
      createdBy: userId,
      updatedBy: userId,
      isDeleted: false,
    };

    // Store in Redis
    await this.redisService.hSet(
      this.PATIENT_STATUS_KEY,
      id,
      JSON.stringify(patientStatus),
    );

    // Add to active index
    await this.redisService.sAdd(this.ACTIVE_INDEX_KEY, id);

    return patientStatus;
  }

  async findAll(query: QueryPatientStatusDto): Promise<PatientStatus[]> {
    let ids: string[];

    if (query.includeDeleted) {
      // Get all IDs (active + deleted)
      const activeIds = await this.redisService.sMembers(this.ACTIVE_INDEX_KEY);
      const deletedIds = await this.redisService.sMembers(this.DELETED_INDEX_KEY);
      ids = [...activeIds, ...deletedIds];
    } else {
      // Get only active IDs
      ids = await this.redisService.sMembers(this.ACTIVE_INDEX_KEY);
    }

    if (ids.length === 0) {
      return [];
    }

    const results: PatientStatus[] = [];

    for (const id of ids) {
      const data = await this.redisService.hGet(this.PATIENT_STATUS_KEY, id);
      if (data) {
        const patientStatus: PatientStatus = JSON.parse(data);

        // Apply filters
        if (query.status && patientStatus.status !== query.status) {
          continue;
        }
        if (
          query.department &&
          !patientStatus.department
            .toLowerCase()
            .includes(query.department.toLowerCase())
        ) {
          continue;
        }
        if (query.patientId && patientStatus.patientId !== query.patientId) {
          continue;
        }

        results.push(patientStatus);
      }
    }

    // Sort by updatedAt descending
    return results.sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );
  }

  async findOne(id: string, includeDeleted: boolean = false): Promise<PatientStatus> {
    const data = await this.redisService.hGet(this.PATIENT_STATUS_KEY, id);

    if (!data) {
      throw new NotFoundException({
        statusCode: 404,
        message: `Patient status with ID "${id}" not found`,
        error: 'Not Found',
      });
    }

    const patientStatus: PatientStatus = JSON.parse(data);

    if (patientStatus.isDeleted && !includeDeleted) {
      throw new NotFoundException({
        statusCode: 404,
        message: `Patient status with ID "${id}" has been deleted`,
        error: 'Not Found',
      });
    }

    return patientStatus;
  }

  async update(
    id: string,
    updateDto: UpdatePatientStatusDto,
    userId: string,
  ): Promise<PatientStatus> {
    const existing = await this.findOne(id);

    if (existing.isDeleted) {
      throw new ConflictException({
        statusCode: 409,
        message: 'Cannot update a deleted record. Please restore it first.',
        error: 'Conflict',
      });
    }

    const updated: PatientStatus = {
      ...existing,
      previousStatus: updateDto.status ? existing.status : existing.previousStatus,
      status: updateDto.status || existing.status,
      department: updateDto.department || existing.department,
      roomNumber:
        updateDto.roomNumber !== undefined
          ? updateDto.roomNumber
          : existing.roomNumber,
      doctorName:
        updateDto.doctorName !== undefined
          ? updateDto.doctorName
          : existing.doctorName,
      notes: updateDto.notes !== undefined ? updateDto.notes : existing.notes,
      updatedAt: new Date().toISOString(),
      updatedBy: userId,
    };

    await this.redisService.hSet(
      this.PATIENT_STATUS_KEY,
      id,
      JSON.stringify(updated),
    );

    return updated;
  }

  async softDelete(id: string, userId: string): Promise<PatientStatus> {
    const existing = await this.findOne(id);

    if (existing.isDeleted) {
      throw new ConflictException({
        statusCode: 409,
        message: 'Record is already deleted',
        error: 'Conflict',
      });
    }

    const deleted: PatientStatus = {
      ...existing,
      isDeleted: true,
      deletedAt: new Date().toISOString(),
      deletedBy: userId,
      updatedAt: new Date().toISOString(),
      updatedBy: userId,
    };

    await this.redisService.hSet(
      this.PATIENT_STATUS_KEY,
      id,
      JSON.stringify(deleted),
    );

    // Move from active to deleted index
    await this.redisService.sRem(this.ACTIVE_INDEX_KEY, id);
    await this.redisService.sAdd(this.DELETED_INDEX_KEY, id);

    return deleted;
  }

  async restore(id: string, userId: string): Promise<PatientStatus> {
    const data = await this.redisService.hGet(this.PATIENT_STATUS_KEY, id);

    if (!data) {
      throw new NotFoundException({
        statusCode: 404,
        message: `Patient status with ID "${id}" not found`,
        error: 'Not Found',
      });
    }

    const existing: PatientStatus = JSON.parse(data);

    if (!existing.isDeleted) {
      throw new ConflictException({
        statusCode: 409,
        message: 'Record is not deleted',
        error: 'Conflict',
      });
    }

    const restored: PatientStatus = {
      ...existing,
      isDeleted: false,
      deletedAt: undefined,
      deletedBy: undefined,
      updatedAt: new Date().toISOString(),
      updatedBy: userId,
    };

    await this.redisService.hSet(
      this.PATIENT_STATUS_KEY,
      id,
      JSON.stringify(restored),
    );

    // Move from deleted to active index
    await this.redisService.sRem(this.DELETED_INDEX_KEY, id);
    await this.redisService.sAdd(this.ACTIVE_INDEX_KEY, id);

    return restored;
  }

  async getStatistics(): Promise<{
    total: number;
    active: number;
    deleted: number;
    byStatus: Record<string, number>;
  }> {
    const activeIds = await this.redisService.sMembers(this.ACTIVE_INDEX_KEY);
    const deletedIds = await this.redisService.sMembers(this.DELETED_INDEX_KEY);

    const byStatus: Record<string, number> = {};

    for (const id of activeIds) {
      const data = await this.redisService.hGet(this.PATIENT_STATUS_KEY, id);
      if (data) {
        const patientStatus: PatientStatus = JSON.parse(data);
        byStatus[patientStatus.status] = (byStatus[patientStatus.status] || 0) + 1;
      }
    }

    return {
      total: activeIds.length + deletedIds.length,
      active: activeIds.length,
      deleted: deletedIds.length,
      byStatus,
    };
  }
}
