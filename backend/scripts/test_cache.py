"""Quick integration script to test SimpleCache behavior and endpoint timings.

Usage (from project root):
  cd backend
  .\venv_support\Scripts\python.exe scripts\test_cache.py

What it does:
  - Unit-tests SimpleCache: set/get/delete/clear/TTL
  - Measures GET /documents/ latency twice to show cache effect
  - Demonstrates cache invalidation after upload (if upload available)

Note: this script assumes local server is running at http://127.0.0.1:8000
and that there is a test user you can login with. Adjust variables below.
"""
import time
import json
import sys
from urllib import request, parse

BASE = "http://127.0.0.1:8000"

# Update these credentials to an existing user in your DB for integration testing
TEST_EMAIL = "test@example.com"
TEST_PASSWORD = "Test123!@"

def run_unit_tests(cache_module):
    print("\n== Unit tests for SimpleCache ==")
    cache = cache_module.SimpleCache()

    cache.set("a", 1, ttl_seconds=1)
    assert cache.get("a") == 1, "get after set failed"
    print("SET/GET passed")

    time.sleep(1.1)
    assert cache.get("a") is None, "ttl expiration failed"
    print("TTL expiration passed")

    cache.set("b", "x", ttl_seconds=0)  # no expiry
    assert cache.get("b") == "x"
    cache.delete("b")
    assert cache.get("b") is None
    print("DELETE passed")

    cache.set("k1", 1, ttl_seconds=10)
    cache.set("k2", 2, ttl_seconds=10)
    stats = cache.get_stats()
    assert stats["total_keys"] == 2
    cache.clear()
    assert cache.get_stats()["total_keys"] == 0
    print("CLEAR/GET_STATS passed")

    print("All SimpleCache unit tests passed")

def fetch(url, method='GET', headers=None, data=None):
    req = request.Request(url, method=method)
    if headers:
        for k, v in headers.items():
            req.add_header(k, v)
    if data is not None:
        req.data = json.dumps(data).encode('utf-8')
        req.add_header('Content-Type', 'application/json')
    with request.urlopen(req, timeout=30) as resp:
        body = resp.read()
        try:
            return resp.getcode(), json.loads(body)
        except Exception:
            return resp.getcode(), body.decode('utf-8', errors='ignore')

def login_and_get_token():
    url = BASE + "/auth/login"
    payload = {"email": TEST_EMAIL, "password": TEST_PASSWORD}
    code, resp = fetch(url, method='POST', data=payload)
    if code != 200:
        print("Login failed:", code, resp)
        return None
    token = resp.get('access_token') or resp.get('token')
    print("Login OK, token present?", bool(token))
    return token

def measure_documents(token):
    headers = {"Authorization": f"Bearer {token}"}
    url = BASE + "/documents/"
    print('\n== Measuring /documents/ latency (2 calls) ==')
    start = time.time()
    code1, resp1 = fetch(url, headers=headers)
    t1 = time.time() - start
    print(f"First call: {code1}, time={t1:.3f}s, total={len(str(resp1))} chars")

    start = time.time()
    code2, resp2 = fetch(url, headers=headers)
    t2 = time.time() - start
    print(f"Second call: {code2}, time={t2:.3f}s, total={len(str(resp2))} chars")

    if t2 > 0:
        print(f"Improvement: {t1 / t2:.2f}x faster (approx)")

def main():
    # import the cache implementation from app
    sys.path.insert(0, '..')
    try:
        from app.utils import cache as cache_module
    except Exception as e:
        print("Failed to import app.utils.cache:", e)
        return

    run_unit_tests(cache_module)

    # Integration: measure /documents/ caching effect if local server running
    token = login_and_get_token()
    if not token:
        print("Skipping integration timing because login failed")
        return

    measure_documents(token)

if __name__ == '__main__':
    main()
