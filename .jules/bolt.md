## 2025-02-27 - Backend Dashboard Query Optimization
**Learning:** In the `chat-api`, endpoints returning multiple distinct aggregations (`/analytics/dashboard` and `/admin/stats`) were utilizing multiple separate `db.prepare(...).get()` SQLite queries. This caused unnecessary parsing overhead and an N+1 query pattern.
**Action:** Use conditional aggregation (`COUNT(CASE WHEN <condition> THEN 1 END)`) to retrieve all metrics in a single database pass. This cuts execution time significantly (e.g., from ~0.16ms to ~0.04ms for small tables) and scales much better as data grows.
