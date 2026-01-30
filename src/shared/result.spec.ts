import { Result } from './result';

describe('Result', () => {
  describe('ok', () => {
    it('should create a successful result', () => {
      const result = Result.ok('success value');

      expect(result.isSuccess).toBe(true);
      expect(result.isFailure).toBe(false);
      expect(result.value).toBe('success value');
    });
  });

  describe('fail', () => {
    it('should create a failed result', () => {
      const result = Result.fail('error message');

      expect(result.isSuccess).toBe(false);
      expect(result.isFailure).toBe(true);
      expect(result.error).toBe('error message');
    });
  });

  describe('value', () => {
    it('should throw error when accessing value of failed result', () => {
      const result = Result.fail('error');

      expect(() => result.value).toThrow('Cannot get value from a failed result');
    });
  });

  describe('error', () => {
    it('should throw error when accessing error of successful result', () => {
      const result = Result.ok('value');

      expect(() => result.error).toThrow('Cannot get error from a successful result');
    });
  });

  describe('map', () => {
    it('should map successful result', () => {
      const result = Result.ok(5);
      const mapped = result.map((x) => x * 2);

      expect(mapped.isSuccess).toBe(true);
      expect(mapped.value).toBe(10);
    });

    it('should not map failed result', () => {
      const result = Result.fail<number>('error');
      const mapped = result.map((x) => x * 2);

      expect(mapped.isFailure).toBe(true);
      expect(mapped.error).toBe('error');
    });

    it('should catch errors in map function', () => {
      const result = Result.ok(5);
      const mapped = result.map(() => {
        throw new Error('mapping error');
      });

      expect(mapped.isFailure).toBe(true);
      expect(mapped.error).toBe('mapping error');
    });
  });

  describe('bind', () => {
    it('should bind successful result', () => {
      const result = Result.ok(5);
      const bound = result.bind((x) => Result.ok(x * 2));

      expect(bound.isSuccess).toBe(true);
      expect(bound.value).toBe(10);
    });

    it('should not bind failed result', () => {
      const result = Result.fail<number>('error');
      const bound = result.bind((x) => Result.ok(x * 2));

      expect(bound.isFailure).toBe(true);
      expect(bound.error).toBe('error');
    });

    it('should propagate failure in bind function', () => {
      const result = Result.ok(5);
      const bound = result.bind(() => Result.fail('bind error'));

      expect(bound.isFailure).toBe(true);
      expect(bound.error).toBe('bind error');
    });

    it('should catch errors thrown in bind function', () => {
      const result = Result.ok(5);
      const bound = result.bind(() => {
        throw new Error('bind threw error');
      });

      expect(bound.isFailure).toBe(true);
      expect(bound.error).toBe('bind threw error');
    });

    it('should handle non-Error exceptions in bind function', () => {
      const result = Result.ok(5);
      const bound = result.bind(() => {
        throw 'string error';
      });

      expect(bound.isFailure).toBe(true);
      expect(bound.error).toBe('Unknown error');
    });
  });

  describe('mapAsync', () => {
    it('should map successful result asynchronously', async () => {
      const result = Result.ok(5);
      const mapped = await result.mapAsync(async (x) => x * 2);

      expect(mapped.isSuccess).toBe(true);
      expect(mapped.value).toBe(10);
    });

    it('should not map failed result asynchronously', async () => {
      const result = Result.fail<number>('error');
      const mapped = await result.mapAsync(async (x) => x * 2);

      expect(mapped.isFailure).toBe(true);
      expect(mapped.error).toBe('error');
    });

    it('should catch errors in async map function', async () => {
      const result = Result.ok(5);
      const mapped = await result.mapAsync(async () => {
        throw new Error('async mapping error');
      });

      expect(mapped.isFailure).toBe(true);
      expect(mapped.error).toBe('async mapping error');
    });

    it('should handle non-Error exceptions in async map function', async () => {
      const result = Result.ok(5);
      const mapped = await result.mapAsync(async () => {
        throw 'string error';
      });

      expect(mapped.isFailure).toBe(true);
      expect(mapped.error).toBe('Unknown error');
    });
  });

  describe('bindAsync', () => {
    it('should bind successful result asynchronously', async () => {
      const result = Result.ok(5);
      const bound = await result.bindAsync(async (x) => Result.ok(x * 2));

      expect(bound.isSuccess).toBe(true);
      expect(bound.value).toBe(10);
    });

    it('should not bind failed result asynchronously', async () => {
      const result = Result.fail<number>('error');
      const bound = await result.bindAsync(async (x) => Result.ok(x * 2));

      expect(bound.isFailure).toBe(true);
      expect(bound.error).toBe('error');
    });

    it('should propagate failure in async bind function', async () => {
      const result = Result.ok(5);
      const bound = await result.bindAsync(async () => Result.fail('async bind error'));

      expect(bound.isFailure).toBe(true);
      expect(bound.error).toBe('async bind error');
    });

    it('should catch errors thrown in async bind function', async () => {
      const result = Result.ok(5);
      const bound = await result.bindAsync(async () => {
        throw new Error('async bind threw error');
      });

      expect(bound.isFailure).toBe(true);
      expect(bound.error).toBe('async bind threw error');
    });

    it('should handle non-Error exceptions in async bind function', async () => {
      const result = Result.ok(5);
      const bound = await result.bindAsync(async () => {
        throw 'string error';
      });

      expect(bound.isFailure).toBe(true);
      expect(bound.error).toBe('Unknown error');
    });
  });

  describe('map with non-Error exceptions', () => {
    it('should handle non-Error exceptions in map function', () => {
      const result = Result.ok(5);
      const mapped = result.map(() => {
        throw 'string error';
      });

      expect(mapped.isFailure).toBe(true);
      expect(mapped.error).toBe('Unknown error');
    });
  });
});
