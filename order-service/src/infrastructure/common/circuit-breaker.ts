import { Injectable } from '@nestjs/common';

// Create a constant token for dependency injection
export const CIRCUIT_BREAKER = 'CIRCUIT_BREAKER';

// Keep the interface
export interface CircuitBreaker {
  fire<T>(fn: () => Promise<T>): Promise<T>;
}

@Injectable()
export class SimpleCircuitBreaker implements CircuitBreaker {
  private failures = 0;
  private lastFailureTime = 0;
  private readonly maxFailures = 3;
  private readonly resetTimeout = 10000; // 10 seconds

  async fire<T>(fn: () => Promise<T>): Promise<T> {
    if (this.isOpen()) {
      if (this.shouldReset()) {
        this.reset();
      } else {
        throw new Error('Circuit breaker is open');
      }
    }

    try {
      const result = await fn();
      this.reset();
      return result;
    } catch (error) {
      this.recordFailure();
      throw error;
    }
  }

  private isOpen(): boolean {
    return this.failures >= this.maxFailures;
  }

  private shouldReset(): boolean {
    return Date.now() - this.lastFailureTime > this.resetTimeout;
  }

  private recordFailure(): void {
    this.failures++;
    this.lastFailureTime = Date.now();
  }

  private reset(): void {
    this.failures = 0;
    this.lastFailureTime = 0;
  }
}
