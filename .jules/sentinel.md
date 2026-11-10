# Sentinel Journal - Critical Security Learnings

## 2026-10-04 - Exposure of Unsanitized Session ID Secret in Public Health Endpoint
**Vulnerability:** The `/health` HTTP endpoint exposed raw session credentials (`SESSION_ID`) in cleartext in the JSON response without authentication.
**Learning:** Developers added `sessionId` to the `/health` endpoint to allow external pingers/status monitors to inspect the active session ID, overlooking that any unauthenticated external client could query `/health` and acquire full session credentials.
**Prevention:** Never return sensitive tokens, API keys, or raw credential strings in unauthenticated API/health responses; use boolean indicators (`hasSession: true/false`) instead of returning raw secret values.
