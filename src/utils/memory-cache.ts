type CacheEntry = {
  value: unknown;
  expiresAt: number;
};

const cache = new Map<string, CacheEntry>();

const MAX_ENTRIES = 500;

// Remove entradas expiradas para evitar acumular dados antigos.
function removeExpiredEntries(): void {
  const now = Date.now();

  for (const [key, entry] of cache.entries()) {
    if (entry.expiresAt <= now) {
      cache.delete(key);
    }
  }
}

export const memoryCache = {
  get<T>(key: string): T | undefined {
    const entry = cache.get(key);

    if (!entry) {
      return undefined;
    }

    if (entry.expiresAt <= Date.now()) {
      cache.delete(key);
      return undefined;
    }

    return entry.value as T;
  },

  set<T>(key: string, value: T, ttlMs: number): void {
    if (ttlMs <= 0) {
      return;
    }

    removeExpiredEntries();

    // Atualizar uma chave existente não cria uma entrada duplicada.
    cache.delete(key);

    cache.set(key, {
      value,
      expiresAt: Date.now() + ttlMs,
    });

    // Remove as entradas mais antigas caso o limite seja ultrapassado.
    while (cache.size > MAX_ENTRIES) {
      const oldestKey = cache.keys().next().value;

      if (oldestKey === undefined) {
        break;
      }

      cache.delete(oldestKey);
    }
  },
};
