export interface KafkaConfig {
    brokers: string[];
    clientId: string;
    groupId: string;
    retryAttempts?: number;
    retryDelay?: number;
  }
  
  export const createKafkaOptions = (config: KafkaConfig) => ({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: config.clientId,
        brokers: config.brokers,
        retry: {
          initialRetryTime: 100,
          retries: 8
        },
      },
      consumer: {
        groupId: config.groupId,
        allowAutoTopicCreation: true,
        retry: {
          initialRetryTime: config.retryDelay || 100,
          retries: config.retryAttempts || 3,
        },
      },
      producer: {
        allowAutoTopicCreation: true,
        idempotent: true,
      },
    },
  });