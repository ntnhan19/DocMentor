from typing import Any, Optional, Dict
import time
import threading


class SimpleCache:
    """In-memory cache with basic TTL support and thread-safety.

    Notes:
    - Simple, process-local cache. Suitable for reducing DB reads in a single instance.
    - Not a distributed cache. For multi-replica deployments use Redis or Memcached.
    """

    def __init__(self):
        self._cache: Dict[str, Any] = {}
        self._ttl: Dict[str, float] = {}
        self._lock = threading.Lock()

    def set(self, key: str, value: Any, ttl_seconds: int = 300) -> None:
        """Store a value with TTL (in seconds)."""
        expire_at = time.time() + ttl_seconds if ttl_seconds else 0
        with self._lock:
            self._cache[key] = value
            self._ttl[key] = expire_at

    def get(self, key: str) -> Optional[Any]:
        """Return cached value if present and not expired, otherwise None."""
        with self._lock:
            if key not in self._cache:
                return None

            expire_at = self._ttl.get(key, 0)
            # 0 means no expiration
            if expire_at and time.time() > expire_at:
                # expired
                self._cache.pop(key, None)
                self._ttl.pop(key, None)
                return None

            return self._cache.get(key)

    def delete(self, key: str) -> None:
        """Remove a key from cache."""
        with self._lock:
            self._cache.pop(key, None)
            self._ttl.pop(key, None)

    def clear(self) -> None:
        """Clear the entire cache."""
        with self._lock:
            self._cache.clear()
            self._ttl.clear()

    def get_stats(self) -> Dict[str, Any]:
        """Return simple statistics about the cache."""
        with self._lock:
            return {
                "total_keys": len(self._cache),
                "keys": list(self._cache.keys()),
            }


# Global cache instance used by the application
cache = SimpleCache()
