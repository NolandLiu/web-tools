# Invalid Catalog Fixture Matrix

These examples are synthetic validation categories used by `TASK-115`.
They are not production Catalog records and must not contain private user data.

The matrix covers one principal failure per case:

- duplicate authority file
- duplicate resource id
- invalid slug
- invalid website URL
- invalid status
- unknown taxonomy
- missing relation target
- missing locale
- invalid tool binding
- category cycle
- unsafe evidence string

Unsafe URL and rich-text samples are inert strings used only to verify that
schema and graph validation reject unsafe or unsupported Catalog input.
