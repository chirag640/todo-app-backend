import { Injectable, Logger } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FcmService {
  private readonly logger = new Logger(FcmService.name);
  private isInitialized = false;

  constructor() {
    this.initializeFirebase();
  }

  private initializeFirebase(): void {
    try {
      // Check if already initialized
      if (admin.apps.length > 0) {
        this.isInitialized = true;
        this.logger.log('Firebase Admin already initialized');
        return;
      }

      // Method 1: Use individual environment variables (Recommended for Vercel)
      const projectId = process.env.FIREBASE_PROJECT_ID;
      const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
      const privateKey = process.env.FIREBASE_PRIVATE_KEY;

      if (projectId && clientEmail && privateKey) {
        // Replace escaped newlines in private key
        const formattedPrivateKey = privateKey.replace(/\\n/g, '\n');
        
        admin.initializeApp({
          credential: admin.credential.cert({
            projectId,
            clientEmail,
            privateKey: formattedPrivateKey,
          }),
        });
        this.isInitialized = true;
        this.logger.log('Firebase Admin initialized with environment variables');
        return;
      }

      // Method 2: Use service account file path (Local development)
      const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
      
      if (serviceAccountPath) {
        const serviceAccount = require(`${process.cwd()}/${serviceAccountPath}`);
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
        });
        this.isInitialized = true;
        this.logger.log('Firebase Admin initialized with service account file');
        return;
      }

      // Method 3: Use default application credentials (GCP)
      admin.initializeApp({
        credential: admin.credential.applicationDefault(),
      });
      this.isInitialized = true;
      this.logger.log('Firebase Admin initialized with default credentials');
    } catch (error) {
      this.logger.warn(
        'Firebase Admin initialization failed. Push notifications will not work.',
        error,
      );
      this.isInitialized = false;
    }
  }

  /**
   * Send notification to a single device
   */
  async sendToDevice(
    token: string,
    notification: { title: string; body: string },
    data?: Record<string, string>,
  ): Promise<string | null> {
    if (!this.isInitialized) {
      this.logger.warn('Firebase not initialized. Cannot send notification.');
      return null;
    }

    try {
      const message: admin.messaging.Message = {
        notification: {
          title: notification.title,
          body: notification.body,
        },
        data: data || {},
        token,
        android: {
          priority: 'high',
          notification: {
            channelId: 'task_reminders',
            priority: 'max',
            defaultSound: true,
            defaultVibrateTimings: true,
          },
        },
        apns: {
          payload: {
            aps: {
              sound: 'default',
              badge: 1,
            },
          },
        },
      };

      const response = await admin.messaging().send(message);
      this.logger.log(`Notification sent successfully: ${response}`);
      return response;
    } catch (error: any) {
      this.logger.error('Failed to send notification', error);
      // If token is invalid, return null so caller can handle it
      if (error?.code === 'messaging/invalid-registration-token' ||
          error?.code === 'messaging/registration-token-not-registered') {
        this.logger.warn(`Invalid or expired FCM token: ${token}`);
        return null;
      }
      throw error;
    }
  }

  /**
   * Send notification to multiple devices
   */
  async sendToMultipleDevices(
    tokens: string[],
    notification: { title: string; body: string },
    data?: Record<string, string>,
  ): Promise<{ successCount: number; failureCount: number; invalidTokens: string[] }> {
    if (!this.isInitialized) {
      this.logger.warn('Firebase not initialized. Cannot send notifications.');
      return { successCount: 0, failureCount: tokens.length, invalidTokens: [] };
    }

    if (tokens.length === 0) {
      return { successCount: 0, failureCount: 0, invalidTokens: [] };
    }

    try {
      const message: admin.messaging.MulticastMessage = {
        notification: {
          title: notification.title,
          body: notification.body,
        },
        data: data || {},
        tokens,
        android: {
          priority: 'high',
          notification: {
            channelId: 'task_reminders',
            priority: 'max',
            defaultSound: true,
            defaultVibrateTimings: true,
          },
        },
        apns: {
          payload: {
            aps: {
              sound: 'default',
              badge: 1,
            },
          },
        },
      };

      const response = await admin.messaging().sendEachForMulticast(message);
      
      // Collect invalid tokens
      const invalidTokens: string[] = [];
      response.responses.forEach((resp: admin.messaging.SendResponse, idx: number) => {
        if (!resp.success) {
          const error = resp.error;
          if (error?.code === 'messaging/invalid-registration-token' ||
              error?.code === 'messaging/registration-token-not-registered') {
            if (tokens[idx]) {
              invalidTokens.push(tokens[idx]);
            }
          }
        }
      });

      this.logger.log(
        `Sent to ${tokens.length} devices. Success: ${response.successCount}, Failed: ${response.failureCount}`,
      );

      return {
        successCount: response.successCount,
        failureCount: response.failureCount,
        invalidTokens,
      };
    } catch (error) {
      this.logger.error('Failed to send multicast notification', error);
      throw error;
    }
  }

  /**
   * Send task overdue notification
   */
  async sendTaskOverdueNotification(
    fcmToken: string,
    taskTitle: string,
    taskId: string,
  ): Promise<string | null> {
    return this.sendToDevice(
      fcmToken,
      {
        title: 'Task Overdue!',
        body: `"${taskTitle}" is overdue. Please complete it.`,
      },
      {
        type: 'task_overdue',
        task_id: taskId,
      },
    );
  }

  /**
   * Send task reminder notification
   */
  async sendTaskReminderNotification(
    fcmToken: string,
    taskTitle: string,
    taskId: string,
    dueDate: Date,
  ): Promise<string | null> {
    const hoursUntilDue = Math.floor(
      (dueDate.getTime() - Date.now()) / (1000 * 60 * 60),
    );

    let message = '';
    if (hoursUntilDue < 1) {
      message = `"${taskTitle}" is due soon!`;
    } else if (hoursUntilDue < 24) {
      message = `"${taskTitle}" is due in ${hoursUntilDue} hours`;
    } else {
      const days = Math.floor(hoursUntilDue / 24);
      message = `"${taskTitle}" is due in ${days} day${days > 1 ? 's' : ''}`;
    }

    return this.sendToDevice(
      fcmToken,
      {
        title: 'Task Reminder',
        body: message,
      },
      {
        type: 'task_reminder',
        task_id: taskId,
      },
    );
  }

  /**
   * Send task assigned notification
   */
  async sendTaskAssignedNotification(
    fcmToken: string,
    taskTitle: string,
    taskId: string,
    assignedBy: string,
  ): Promise<string | null> {
    return this.sendToDevice(
      fcmToken,
      {
        title: 'New Task Assigned',
        body: `${assignedBy} assigned you "${taskTitle}"`,
      },
      {
        type: 'task_assigned',
        task_id: taskId,
      },
    );
  }

  /**
   * Check if Firebase is initialized
   */
  isReady(): boolean {
    return this.isInitialized;
  }
}
