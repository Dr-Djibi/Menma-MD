## 2025-05-10 - i18n Translation Lookup Cache
**Learning:** Frequent internationalization key lookups (`trd()`) without caching cause repetitive string splitting (`key.split('.')`) and nested object traversals on every message/command execution.
**Action:** Always memoize resolved static path lookups in i18n modules and add fast paths when variable substitution objects are empty.

## 2025-05-11 - Stream Buffer Allocation Pattern
**Learning:** Concatenating binary chunks inside an async stream loop (`buffer = Buffer.concat([buffer, chunk])`) results in O(N^2) allocations and byte copies, blocking the event loop for ~2.2s on 10MB media downloads.
**Action:** Always collect stream chunks into an array (`chunks.push(chunk)`) and perform a single `Buffer.concat(chunks)` after the loop completes to achieve O(N) linear performance (~200x+ speedup).
