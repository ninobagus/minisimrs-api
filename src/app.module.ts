import { Module } from '@nestjs/common';
import { PatientStatusModule } from './patient-status/patient-status.module';
import { AuthModule } from './auth/auth.module';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [
    RedisModule,
    AuthModule,
    PatientStatusModule,
  ],
})
export class AppModule {}
