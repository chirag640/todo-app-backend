import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { LoggerModule } from './modules/logger/logger.module';
import { CacheModule } from './modules/cache/cache.module';
import { HealthModule } from './modules/health/health.module';
import { ThrottlerModule } from './modules/throttler/throttler.module';
import { EncryptionModule } from './common/encryption.module';
// Generated model modules
import { UserModule } from './modules/user/user.module';
import { TaskModule } from './modules/task/task.module';
import { SubtaskModule } from './modules/subtask/subtask.module';
import { TagModule } from './modules/tag/tag.module';
import { ListModule } from './modules/list/list.module';
import { DeviceModule } from './modules/device/device.module';
import { NotificationModule } from './modules/notification/notification.module';
import { AuditLogModule } from './modules/audit-log/audit-log.module';
import { SyncCursorModule } from './modules/sync-cursor/sync-cursor.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.DATABASE_URL!, {
      // Production-ready connection pool configuration
      maxPoolSize: 10, // Maximum number of connections in the pool
      minPoolSize: 2, // Minimum number of connections to maintain
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      serverSelectionTimeoutMS: 5000, // Timeout after 5s if no server available
      heartbeatFrequencyMS: 10000, // Check server health every 10s
      retryWrites: true, // Automatically retry write operations
      retryReads: true, // Automatically retry read operations
    }),
    LoggerModule,
    CacheModule,
    HealthModule,
    ThrottlerModule,
    EncryptionModule, // Global encryption layer (KMS + AES-GCM)
    AuthModule,
    // Generated modules
    UserModule,
    TaskModule,
    SubtaskModule,
    TagModule,
    ListModule,
    DeviceModule,
    NotificationModule,
    AuditLogModule,
    SyncCursorModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
