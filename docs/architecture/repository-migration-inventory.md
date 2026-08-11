# Repository Migration Inventory

## Baseline

- Source commit: `21c3eb8dab2205b5ea78ea7b53bf0fbd76bb81ee`
- Evidence date: `2026-08-11`
- Summary: 42 logical records, 111 canonical routes, 12 localized redirects.

## Summary

| Logical records | Published | Redirect-only | Unpublished | Canonical routes | Localized redirects |
| --- | --- | --- | --- | --- | --- |
| 42 | 37 | 4 | 1 | 111 | 12 |

## Published Tools

| Inventory key | Registry ID | Slug | Kind | Category | Target candidate | Routes |
| --- | --- | --- | --- | --- | --- | --- |
| tool:length | length | length-converter | unit | units | res_tool_length | /en/tools/length-converter<br>/zh-cn/tools/length-converter<br>/zh-tw/tools/length-converter |
| tool:weight | weight | weight-converter | unit | units | res_tool_weight | /en/tools/weight-converter<br>/zh-cn/tools/weight-converter<br>/zh-tw/tools/weight-converter |
| tool:temperature | temperature | temperature-converter | unit | units | res_tool_temperature | /en/tools/temperature-converter<br>/zh-cn/tools/temperature-converter<br>/zh-tw/tools/temperature-converter |
| tool:area | area | area-converter | unit | units | res_tool_area | /en/tools/area-converter<br>/zh-cn/tools/area-converter<br>/zh-tw/tools/area-converter |
| tool:volume | volume | volume-converter | unit | units | res_tool_volume | /en/tools/volume-converter<br>/zh-cn/tools/volume-converter<br>/zh-tw/tools/volume-converter |
| tool:speed | speed | speed-converter | unit | units | res_tool_speed | /en/tools/speed-converter<br>/zh-cn/tools/speed-converter<br>/zh-tw/tools/speed-converter |
| tool:time | time | time-converter | unit | units | res_tool_time | /en/tools/time-converter<br>/zh-cn/tools/time-converter<br>/zh-tw/tools/time-converter |
| tool:storage | storage | data-storage-converter | unit | units | res_tool_storage | /en/tools/data-storage-converter<br>/zh-cn/tools/data-storage-converter<br>/zh-tw/tools/data-storage-converter |
| tool:json | json | json-tools | json | developer | res_tool_json | /en/tools/json-tools<br>/zh-cn/tools/json-tools<br>/zh-tw/tools/json-tools |
| tool:base64 | base64 | base64-encoder-decoder | base64 | developer | res_tool_base64 | /en/tools/base64-encoder-decoder<br>/zh-cn/tools/base64-encoder-decoder<br>/zh-tw/tools/base64-encoder-decoder |
| tool:url | url | url-encoder-decoder | url | developer | res_tool_url | /en/tools/url-encoder-decoder<br>/zh-cn/tools/url-encoder-decoder<br>/zh-tw/tools/url-encoder-decoder |
| tool:uuid | uuid | uuid-generator | uuid | developer | res_tool_uuid | /en/tools/uuid-generator<br>/zh-cn/tools/uuid-generator<br>/zh-tw/tools/uuid-generator |
| tool:timestamp | timestamp | timestamp-converter | timestamp | developer | res_tool_timestamp | /en/tools/timestamp-converter<br>/zh-cn/tools/timestamp-converter<br>/zh-tw/tools/timestamp-converter |
| tool:case | case | text-case-converter | case | developer | res_tool_case | /en/tools/text-case-converter<br>/zh-cn/tools/text-case-converter<br>/zh-tw/tools/text-case-converter |
| tool:text | text | word-counter | text | developer | res_tool_text | /en/tools/word-counter<br>/zh-cn/tools/word-counter<br>/zh-tw/tools/word-counter |
| tool:color | color | color-converter | color | developer | res_tool_color | /en/tools/color-converter<br>/zh-cn/tools/color-converter<br>/zh-tw/tools/color-converter |
| tool:percentage | percentage | percentage-calculator | calculator | calculators | res_tool_percentage | /en/tools/percentage-calculator<br>/zh-cn/tools/percentage-calculator<br>/zh-tw/tools/percentage-calculator |
| tool:discount | discount | discount-calculator | calculator | calculators | res_tool_discount | /en/tools/discount-calculator<br>/zh-cn/tools/discount-calculator<br>/zh-tw/tools/discount-calculator |
| tool:bmi | bmi | bmi-calculator | calculator | calculators | res_tool_bmi | /en/tools/bmi-calculator<br>/zh-cn/tools/bmi-calculator<br>/zh-tw/tools/bmi-calculator |
| tool:compound | compound | compound-interest-calculator | calculator | calculators | res_tool_compound | /en/tools/compound-interest-calculator<br>/zh-cn/tools/compound-interest-calculator<br>/zh-tw/tools/compound-interest-calculator |
| tool:datecalc | datecalc | date-interval-calculator | calculator | calculators | res_tool_datecalc | /en/tools/date-interval-calculator<br>/zh-cn/tools/date-interval-calculator<br>/zh-tw/tools/date-interval-calculator |
| tool:qr | qr | qr-code-generator | qr | qr | res_tool_qr | /en/tools/qr-code-generator<br>/zh-cn/tools/qr-code-generator<br>/zh-tw/tools/qr-code-generator |
| tool:irr | irr | irr-calculator | irr | calculators | res_tool_irr | /en/tools/irr-calculator<br>/zh-cn/tools/irr-calculator<br>/zh-tw/tools/irr-calculator |
| tool:cheque | cheque | cheque-amount-converter | cheque | calculators | res_tool_cheque | /en/tools/cheque-amount-converter<br>/zh-cn/tools/cheque-amount-converter<br>/zh-tw/tools/cheque-amount-converter |
| tool:password | password | password-generator | password | developer | res_tool_password | /en/tools/password-generator<br>/zh-cn/tools/password-generator<br>/zh-tw/tools/password-generator |
| tool:ipv4-network | ipv4-network | ipv4-network-toolbox | ipv4-network | network-ip | res_tool_ipv4-network | /en/tools/ipv4-network-toolbox<br>/zh-cn/tools/ipv4-network-toolbox<br>/zh-tw/tools/ipv4-network-toolbox |
| tool:ipv6-toolbox | ipv6-toolbox | ipv6-toolbox | ipv6-toolbox | network-ip | res_tool_ipv6-toolbox | /en/tools/ipv6-toolbox<br>/zh-cn/tools/ipv6-toolbox<br>/zh-tw/tools/ipv6-toolbox |

## Published Projections And Information Pages

| Inventory key | Current kind | Registry ID | Migration target | Target candidate | Routes |
| --- | --- | --- | --- | --- | --- |
| projection:home | site-projection | home | projection |  | /en/<br>/zh-cn/<br>/zh-tw/ |
| category:units | category-projection | units | category | cat_units | /en/categories/unit-converters<br>/zh-cn/categories/unit-converters<br>/zh-tw/categories/unit-converters |
| category:developer | category-projection | developer | category | cat_developer | /en/categories/developer-tools<br>/zh-cn/categories/developer-tools<br>/zh-tw/categories/developer-tools |
| category:calculators | category-projection | calculators | category | cat_calculators | /en/categories/calculators<br>/zh-cn/categories/calculators<br>/zh-tw/categories/calculators |
| category:qr | category-projection | qr | category | cat_qr | /en/categories/qr-code<br>/zh-cn/categories/qr-code<br>/zh-tw/categories/qr-code |
| category:network-ip | category-projection | network-ip | category | cat_network-ip | /en/categories/network-ip<br>/zh-cn/categories/network-ip<br>/zh-tw/categories/network-ip |
| info:about | public-info-page | about | unresolved |  | /en/about<br>/zh-cn/about<br>/zh-tw/about |
| info:privacy | public-info-page | privacy | unresolved |  | /en/privacy<br>/zh-cn/privacy<br>/zh-tw/privacy |
| info:terms | public-info-page | terms | unresolved |  | /en/terms<br>/zh-cn/terms<br>/zh-tw/terms |
| info:contact | public-info-page | contact | unresolved |  | /en/contact<br>/zh-cn/contact<br>/zh-tw/contact |

## Compatibility Redirects

| Inventory key | Legacy slug | Target tool | Anchor | Routes |
| --- | --- | --- | --- | --- |
| redirect:ipv4-subnet-calculator | ipv4-subnet-calculator | ipv4-network | subnet | /en/tools/ipv4-subnet-calculator -> /en/tools/ipv4-network-toolbox#subnet (301)<br>/zh-cn/tools/ipv4-subnet-calculator -> /zh-cn/tools/ipv4-network-toolbox#subnet (301)<br>/zh-tw/tools/ipv4-subnet-calculator -> /zh-tw/tools/ipv4-network-toolbox#subnet (301) |
| redirect:ip-range-cidr-converter | ip-range-cidr-converter | ipv4-network | range-cidr | /en/tools/ip-range-cidr-converter -> /en/tools/ipv4-network-toolbox#range-cidr (301)<br>/zh-cn/tools/ip-range-cidr-converter -> /zh-cn/tools/ipv4-network-toolbox#range-cidr (301)<br>/zh-tw/tools/ip-range-cidr-converter -> /zh-tw/tools/ipv4-network-toolbox#range-cidr (301) |
| redirect:ip-address-converter | ip-address-converter | ipv4-network | ipv4-converter | /en/tools/ip-address-converter -> /en/tools/ipv4-network-toolbox#ipv4-converter (301)<br>/zh-cn/tools/ip-address-converter -> /zh-cn/tools/ipv4-network-toolbox#ipv4-converter (301)<br>/zh-tw/tools/ip-address-converter -> /zh-tw/tools/ipv4-network-toolbox#ipv4-converter (301) |
| redirect:ipv6-address-tool | ipv6-address-tool | ipv6-toolbox | ipv6-normalize | /en/tools/ipv6-address-tool -> /en/tools/ipv6-toolbox#ipv6-normalize (301)<br>/zh-cn/tools/ipv6-address-tool -> /zh-cn/tools/ipv6-toolbox#ipv6-normalize (301)<br>/zh-tw/tools/ipv6-address-tool -> /zh-tw/tools/ipv6-toolbox#ipv6-normalize (301) |

## Unpublished Sources

| Inventory key | Registry ID | Migration target | Functions | Notes |
| --- | --- | --- | --- | --- |
| unpublished:ip-info | ip-info | unresolved | functions/api/network/ip-lookup.js<br>functions/api/network/ip-rdap.js | Implementation and tests are retained but not published. |

## Findings

| Code | Severity | Inventory keys | Sources | Remediation owner | Message |
| --- | --- | --- | --- | --- | --- |
| CONTENT_OWNERSHIP_DISTRIBUTED | warning | tool:ipv4-network<br>tool:ipv6-toolbox | src/content/index.js<br>src/content/network-tool-content.js | future Catalog content migration | Some tool content is distributed across specialized content modules. |
| INFO_PAGE_CONTENT_OWNERSHIP_SPLIT | warning | info:about<br>info:privacy<br>info:terms<br>info:contact | src/App.tsx<br>src/lib/static-content.js | future public information page migration | Public information page body ownership is split between client and static rendering sources. |
| INFO_PAGE_TARGET_UNRESOLVED | warning | info:about<br>info:privacy<br>info:terms<br>info:contact | src/registry.js<br>src/App.tsx<br>src/lib/static-content.js | future Catalog schema decision | Public information pages have no approved ADR-023 v1 target entity type. |
| IP_INFO_RETAINED_UNPUBLISHED | warning | unpublished:ip-info | src/tools/NetworkTools.tsx<br>functions/api/network/ip-lookup.js<br>functions/api/network/ip-rdap.js | future network provider decision | IP information lookup implementation and tests remain in source while the public page and API routes stay unpublished. |
| TARGET_IDS_NOT_ALLOCATED | warning | projection:home<br>tool:json<br>category:units | docs/adr/ADR-022-identifier-slug-locale-task-naming.md | future Catalog identity allocation | Inventory target ID candidates are suggestions and are not formal Catalog allocations. |
