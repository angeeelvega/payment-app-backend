export class Result<T> {
  private constructor(
    private readonly _isSuccess: boolean,
    private readonly _value?: T,
    private readonly _error?: string,
  ) {}

  static ok<T>(value: T): Result<T> {
    return new Result<T>(true, value);
  }

  static fail<T>(error: string): Result<T> {
    return new Result<T>(false, undefined, error);
  }

  get isSuccess(): boolean {
    return this._isSuccess;
  }

  get isFailure(): boolean {
    return !this._isSuccess;
  }

  get value(): T {
    if (!this._isSuccess) {
      throw new Error('Cannot get value from a failed result');
    }
    return this._value as T;
  }

  get error(): string {
    if (this._isSuccess) {
      throw new Error('Cannot get error from a successful result');
    }
    return this._error as string;
  }

  map<U>(fn: (value: T) => U): Result<U> {
    if (this.isFailure) {
      return Result.fail<U>(this.error);
    }
    try {
      return Result.ok(fn(this.value));
    } catch (error) {
      return Result.fail<U>(error instanceof Error ? error.message : 'Unknown error');
    }
  }

  async mapAsync<U>(fn: (value: T) => Promise<U>): Promise<Result<U>> {
    if (this.isFailure) {
      return Result.fail<U>(this.error);
    }
    try {
      const result = await fn(this.value);
      return Result.ok(result);
    } catch (error) {
      return Result.fail<U>(error instanceof Error ? error.message : 'Unknown error');
    }
  }

  bind<U>(fn: (value: T) => Result<U>): Result<U> {
    if (this.isFailure) {
      return Result.fail<U>(this.error);
    }
    try {
      return fn(this.value);
    } catch (error) {
      return Result.fail<U>(error instanceof Error ? error.message : 'Unknown error');
    }
  }

  async bindAsync<U>(fn: (value: T) => Promise<Result<U>>): Promise<Result<U>> {
    if (this.isFailure) {
      return Result.fail<U>(this.error);
    }
    try {
      return await fn(this.value);
    } catch (error) {
      return Result.fail<U>(error instanceof Error ? error.message : 'Unknown error');
    }
  }
}
