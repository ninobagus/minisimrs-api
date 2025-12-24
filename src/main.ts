import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Global prefix
  app.setGlobalPrefix('api/v1');
  
  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  
  // Global exception filter
  app.useGlobalFilters(new HttpExceptionFilter());
  
  // Global response interceptor
  app.useGlobalInterceptors(new ResponseInterceptor());
  
  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('Mini SIMRS API')
    .setDescription(`
# Mini SIMRS - Patient Status Management API

REST API untuk manajemen perubahan status pasien rumah sakit.

## Fitur Utama
- Manajemen status pasien (CRUD)
- Soft Delete & Restore
- Role-Based Access Control (RBAC)
- Redis In-Memory Database
- Input Validation
- Consistent Response Format

## Authentication
API ini menggunakan **Basic Authentication**.

### Cara Menggunakan:
1. Klik tombol **Authorize** di atas
2. Masukkan username dan password
3. Klik **Authorize**

### Akun Test:
| Username | Password | Role | Akses |
|----------|----------|------|-------|
| user-a | password123 | OPERATOR | POST only |
| user-b | password123 | ADMIN | POST & GET |
| user-c | password123 | VIEWER | GET only |

## Status Pasien
| Status | Deskripsi |
|--------|-----------|
| REGISTERED | Pasien terdaftar |
| WAITING | Menunggu pemeriksaan |
| IN_EXAMINATION | Sedang diperiksa |
| LAB_TEST | Tes laboratorium |
| RADIOLOGY | Radiologi |
| PHARMACY | Mengambil obat |
| INPATIENT | Rawat inap |
| SURGERY | Operasi |
| RECOVERY | Pemulihan |
| DISCHARGED | Pulang |
| REFERRED | Dirujuk |
| CANCELLED | Dibatalkan |
    `)
    .setVersion('2.0')
    .setContact(
      'Developer',
      'https://github.com/developer',
      'developer@example.com',
    )
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .addServer('http://localhost:3000', 'Development Server')
    .addBasicAuth(
      {
        type: 'http',
        scheme: 'basic',
        description: 'Masukkan username dan password',
      },
      'basic-auth',
    )
    .addTag('Patient Status', 'Endpoint untuk manajemen status pasien')
    .addTag('Statistics', 'Endpoint untuk statistik data')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'Mini SIMRS API Documentation',
    customfavIcon: 'https://nestjs.com/img/logo-small.svg',
    customCss: `
      .swagger-ui .topbar { display: none }
      .swagger-ui .info { margin: 20px 0 }
      .swagger-ui .info .title { color: #3b4151 }
      .swagger-ui .scheme-container { background: #fafafa; padding: 15px; }
    `,
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'list',
      filter: true,
      showRequestDuration: true,
    },
  });
  
  // Enable CORS
  app.enableCors();
  
  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  console.log(`
======================================================================
           MINI SIMRS - Patient Status API v2.0               
======================================================================
  Server running on: http://localhost:${port}                    
  API Prefix: /api/v1                                         
                                                              
  Swagger Documentation:                                   
     http://localhost:${port}/api/docs                           
                                                              
  Endpoints:                                                  
  - GET  /api/v1/patient-status       (List all)              
  - GET  /api/v1/patient-status/:id   (Get by ID)             
  - POST /api/v1/patient-status       (Create new)            
  - POST /api/v1/patient-status/:id/soft-delete (Soft Delete) 
  - POST /api/v1/patient-status/:id/restore     (Restore)     
                                                              
  RBAC Users:                                                 
  - user-a / password123 (Role: OPERATOR - POST only)         
  - user-b / password123 (Role: ADMIN - POST & GET)           
  - user-c / password123 (Role: VIEWER - GET only)            
======================================================================
  `);
}
bootstrap();
