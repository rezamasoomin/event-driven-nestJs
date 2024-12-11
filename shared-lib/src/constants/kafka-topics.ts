export const KAFKA_TOPICS = {
    ORDERS: {
      COMMANDS: {
        CREATE: 'orders.commands.v1.create',
        CANCEL: 'orders.commands.v1.cancel',
      },
      EVENTS: {
        CREATED: 'orders.events.v1.created',
        CANCELLED: 'orders.events.v1.cancelled',
      },
    },
    PAYMENTS: {
      COMMANDS: {
        PROCESS: 'payments.commands.v1.process',
      },
      EVENTS: {
        SUCCEEDED: 'payments.events.v1.succeeded',
        FAILED: 'payments.events.v1.failed',
      },
    },
    INVENTORY: {
      COMMANDS: {
        RESERVE: 'inventory.commands.v1.reserve',
      },
      EVENTS: {
        RESERVED: 'inventory.events.v1.reserved',
        INSUFFICIENT: 'inventory.events.v1.insufficient',
      },
    },
  };