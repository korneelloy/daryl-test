import cache from '../cache';

describe('Redis cache', () => {
  beforeAll(async () => {
    await cache.flushall(); // vide toutes les clés avant les tests
  });

  afterAll(async () => {
    await cache.quit(); // ferme la connexion Redis après les tests
  });

  test('should set and get a value from Redis', async () => {
    const key = 'test-key';
    const value = JSON.stringify({ foo: 'bar' });

    await cache.set(key, value, 10); // expire après 10 sec
    const cachedValue = await cache.get(key);

    expect(cachedValue).toEqual(value);
  });

  test('should return null for missing key', async () => {
    const cachedValue = await cache.get('non-existent-key');
    expect(cachedValue).toBeNull();
  });
});
