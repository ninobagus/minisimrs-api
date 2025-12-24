import { Module } from '@nestjs/common';
import { PatientStatusController } from './patient-status.controller';
import { PatientStatusService } from './patient-status.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [PatientStatusController],
  providers: [PatientStatusService],
})
export class PatientStatusModule {}
