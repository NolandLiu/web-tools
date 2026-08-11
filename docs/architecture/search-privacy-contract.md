# Search Privacy Contract

- Owner tasks: `TASK-148` and `SEARCH-P3-005`.
- Raw search queries must not leave the browser.
- Normalized queries and query tokens must not leave the browser.
- Allowed future signals are aggregate counters only.
- Forbidden search analytics fields include passwords, JSON, URLs, amounts, IP addresses, and free-form text.
- Search UI must not write query text to URL, metadata, JSON-LD, feedback links, localStorage, sessionStorage, IndexedDB, or network requests.
- This document does not approve sending analytics events.
