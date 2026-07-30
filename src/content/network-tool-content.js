const reviewedAt = "2026-07-30";

const refs = [
  { label: "IANA IPv4 Special-Purpose Address Registry", url: "https://www.iana.org/assignments/iana-ipv4-special-registry/iana-ipv4-special-registry.xhtml" },
  { label: "IANA IPv6 Special-Purpose Address Registry", url: "https://www.iana.org/assignments/iana-ipv6-special-registry/iana-ipv6-special-registry.xhtml" },
  { label: "RFC 5952 — IPv6 text representation", url: "https://www.rfc-editor.org/rfc/rfc5952" },
  { label: "RFC 3021 — 31-bit IPv4 prefixes", url: "https://www.rfc-editor.org/rfc/rfc3021" },
  { label: "IANA RDAP Bootstrap", url: "https://data.iana.org/rdap/" },
];

const make = ({ summary, introduction, useCases, steps, example, principles, limitations, faqs, aliases, keywords }) => ({
  summary,
  introduction,
  useCases,
  steps,
  example,
  principles,
  limitations,
  faqs,
  references: refs,
  aliases,
  keywords,
  reviewedAt,
});

export const NETWORK_TOOL_CONTENT = {
  en: {
    "ipv4-network": make({
      summary: "Calculate IPv4 subnets, masks, host capacity, ranges, conversions, and same-subnet checks locally.",
      introduction: "The IPv4 network toolbox groups subnet calculation, mask conversion, host planning, range-to-CIDR conversion, IPv4 notation conversion, local classification, and same-subnet checks on one canonical page. Each module keeps its own input, validation, result, copy, and reset state.",
      useCases: ["Plan a LAN prefix and usable host capacity before configuring routers or firewalls.", "Convert address ranges, masks, and IPv4 notation without sending network data outside the browser."],
      steps: ["Start with the subnet module and try 192.168.1.10/24.", "Use the anchor navigation to move to mask, host, range, converter, or same-subnet modules.", "Review each module result independently; correcting one module does not clear or overwrite another module."],
      example: { title: "Subnet and range planning", description: "192.168.1.10/24 reports the 192.168.1.0 network, 255.255.255.0 mask, 254 usable hosts, and range boundaries." },
      principles: ["IPv4 addresses are converted to unsigned 32-bit integers. Masks must be contiguous, ranges are summarized exactly, and /31 follows RFC 3021 point-to-point behavior."],
      limitations: ["Classful networking is not used.", "Ambiguous leading-zero IPv4 octets and non-contiguous masks are rejected.", "The page does not contact DNS or any external network service."],
      faqs: [{ question: "Why are several IPv4 functions on one page?", answer: "They share the same IPv4 addressing model, so grouping them avoids duplicate pages while keeping each module independent." }, { question: "Does range-to-CIDR approximate?", answer: "No. Returned CIDR blocks do not cover addresses outside the requested IPv4 range." }],
      aliases: ["subnet calculator", "subnet mask", "CIDR calculator", "wildcard mask", "same subnet", "IP range", "range to CIDR", "CIDR to range", "IP to decimal", "IP to binary", "IP to hex", "IPv4 converter"],
      keywords: ["network address", "broadcast address", "host calculator", "CIDR", "IPv4", "mask converter", "host recommendation", "range converter"],
    }),
    "ipv6-toolbox": make({
      summary: "Expand, compress, normalize, classify, and calculate IPv6 prefix ranges locally.",
      introduction: "The IPv6 toolbox combines address formatting and prefix range calculation. The formatting module applies RFC 5952 representation rules, while the prefix module uses 128-bit integer arithmetic to find start and end addresses.",
      useCases: ["Normalize an IPv6 address before using it in documentation or configuration.", "Check the first and last address in a /64, /128, or other IPv6 prefix."],
      steps: ["Enter an IPv6 address without a zone ID.", "Use the formatting module for expanded and RFC 5952 output.", "Use the prefix module for start address, end address, and exact address count."],
      example: { title: "Documentation prefix", description: "2001:db8::1 is recognized as documentation space and is not suitable for public lookup." },
      principles: ["The parser expands :: once, converts eight 16-bit groups to a 128-bit BigInt, and compresses the longest zero run according to RFC 5952."],
      limitations: ["Zone IDs such as %en0 are not supported.", "DNS, reverse DNS, and network lookup are not performed.", "IPv4-mapped IPv6 is parsed but no X-forwarded or proxy interpretation is attempted."],
      faqs: [{ question: "Can one zero group be compressed?", answer: "No. RFC 5952 avoids compressing a single 0000 group." }, { question: "Does this page query the network?", answer: "No. IPv6 formatting and prefix calculations run locally in the browser." }],
      aliases: ["IPv6 expand", "IPv6 compress", "IPv6 normalize", "IPv6 prefix", "IPv6 range", "RFC 5952"],
      keywords: ["IPv6", "RFC 5952", "prefix", "BigInt", "address type", "normalize"],
    }),
    "ip-info": make({
      summary: "Run user-triggered same-origin IP lookup and RDAP queries after local public-address checks.",
      introduction: "IP information lookup combines estimated public IP data and RDAP registration lookup on one page. The two modules have separate inputs, buttons, loading states, errors, results, and reset controls, and each request is sent only after explicit user action.",
      useCases: ["Estimate the country, ASN, or network operator for a public IP.", "Inspect public RDAP registration data for a public IPv4 or IPv6 address."],
      steps: ["Enter one public IPv4 or IPv6 address in the module you want to use.", "Submit IP lookup or RDAP explicitly; the other module is not changed.", "Review the estimate or registration data, remembering that geolocation is approximate and RDAP data is public registry data."],
      example: { title: "Local precheck", description: "192.168.1.1 is blocked locally and returns a local explanation instead of a network request." },
      principles: ["The browser calls only /api/network/ip-lookup or /api/network/ip-rdap. Private, loopback, link-local, documentation, multicast, and reserved addresses are blocked locally before any request."],
      limitations: ["A production IP data supplier and Cloudflare rate-limit policy must be configured before deployment.", "IP geolocation is an estimate and may represent an ISP node or registry location.", "The page does not accept domains, bulk input, or traditional TCP WHOIS."],
      faqs: [{ question: "Does lookup run while I type?", answer: "No. Lookup and RDAP only run after their own submit buttons are pressed." }, { question: "Can RDAP reveal a person?", answer: "It shows public registration data and does not prove personal identity or precise location." }],
      aliases: ["IP lookup", "IP location", "IP geolocation", "ASN lookup", "IP WHOIS", "IP RDAP", "RDAP lookup", "RIR lookup"],
      keywords: ["IP lookup", "location estimate", "ASN", "provider", "privacy", "RDAP", "WHOIS", "RIR", "registration"],
    }),
  },
  "zh-CN": {},
  "zh-TW": {},
};

for (const [id, item] of Object.entries(NETWORK_TOOL_CONTENT.en)) {
  NETWORK_TOOL_CONTENT["zh-CN"][id] = make({
    summary: id === "ipv4-network"
      ? "本地计算 IPv4 子网、掩码、主机容量、范围、地址转换和同子网判断。"
      : id === "ipv6-toolbox"
        ? "本地展开、压缩、规范化、分类并计算 IPv6 前缀范围。"
        : "本地预检公网地址后，通过用户明确触发的同源请求查询 IP 信息和 RDAP 资料。",
    introduction: id === "ipv4-network"
      ? "IPv4 网络工具箱把子网计算、掩码转换、主机容量规划、范围转 CIDR、IPv4 表示形式转换、本地分类和同子网判断放在一个规范页面。每个模块保留自己的输入、验证、结果、复制和重置状态。"
      : id === "ipv6-toolbox"
        ? "IPv6 工具箱合并地址格式化和前缀范围计算。格式化模块按 RFC 5952 输出规范形式，前缀模块使用 128 位整数计算起止地址。"
        : "IP 信息查询把公网 IP 估算查询和 RDAP 注册资料查询放在同一页面。两个模块拥有独立输入、按钮、加载、错误、结果和重置控制，并且只在用户明确提交后发起请求。",
    useCases: id === "ipv4-network"
      ? ["配置路由器或防火墙前规划局域网前缀和可用主机数。", "在不离开浏览器的情况下转换地址范围、掩码和 IPv4 表示形式。"]
      : id === "ipv6-toolbox"
        ? ["在写入文档或配置前规范化 IPv6 地址。", "检查 /64、/128 或其他 IPv6 前缀的起始和结束地址。"]
        : ["估算公网 IP 的国家、ASN 或网络运营商。", "查看公开 IPv4 或 IPv6 地址的 RDAP 注册资料。"],
    steps: id === "ipv4-network"
      ? ["从子网模块开始，可试用 192.168.1.10/24。", "使用锚点导航切换到掩码、主机、范围、转换或同子网模块。", "分别查看各模块结果；修正某个模块不会清除或覆盖其他模块。"]
      : id === "ipv6-toolbox"
        ? ["输入不含 zone ID 的 IPv6 地址。", "使用格式化模块查看展开形式和 RFC 5952 形式。", "使用前缀模块查看起始地址、结束地址和精确地址数量。"]
        : ["在要使用的模块中输入一个公网 IPv4 或 IPv6 地址。", "明确提交 IP 查询或 RDAP；另一个模块不会被改变。", "查看估算或注册资料，并注意地理位置仅为估算，RDAP 是公开注册数据。"],
    example: { title: item.example.title, description: item.example.description },
    principles: item.principles,
    limitations: item.limitations,
    faqs: item.faqs,
    aliases: item.aliases.concat(id === "ipv4-network"
      ? ["子网计算", "掩码转换", "CIDR 转换", "同子网"]
      : id === "ipv6-toolbox"
        ? ["IPv6 展开", "IPv6 压缩", "IPv6 前缀"]
        : ["IP 查询", "RDAP 查询", "WHOIS 查询"]),
    keywords: item.keywords.concat(["网络", "IP", "隐私", "本地处理", "工具箱"]),
  });
  NETWORK_TOOL_CONTENT["zh-TW"][id] = make({
    summary: id === "ipv4-network"
      ? "本機計算 IPv4 子網、遮罩、主機容量、範圍、位址轉換和同子網判斷。"
      : id === "ipv6-toolbox"
        ? "本機展開、壓縮、規範化、分類並計算 IPv6 前綴範圍。"
        : "本機預檢公網位址後，透過使用者明確觸發的同源要求查詢 IP 資訊和 RDAP 資料。",
    introduction: id === "ipv4-network"
      ? "IPv4 網絡工具箱把子網計算、遮罩轉換、主機容量規劃、範圍轉 CIDR、IPv4 表示形式轉換、本機分類和同子網判斷放在一個規範頁面。每個模組保留自己的輸入、驗證、結果、複製和重置狀態。"
      : id === "ipv6-toolbox"
        ? "IPv6 工具箱合併位址格式化和前綴範圍計算。格式化模組按 RFC 5952 輸出規範形式，前綴模組使用 128 位元整數計算起止位址。"
        : "IP 資訊查詢把公網 IP 估算查詢和 RDAP 註冊資料查詢放在同一頁面。兩個模組擁有獨立輸入、按鈕、載入、錯誤、結果和重置控制，並且只在使用者明確提交後發起要求。",
    useCases: id === "ipv4-network"
      ? ["設定路由器或防火牆前規劃局域網前綴和可用主機數。", "在不離開瀏覽器的情況下轉換位址範圍、遮罩和 IPv4 表示形式。"]
      : id === "ipv6-toolbox"
        ? ["在寫入文件或設定前規範化 IPv6 位址。", "檢查 /64、/128 或其他 IPv6 前綴的起始和結束位址。"]
        : ["估算公網 IP 的國家、ASN 或網絡營運商。", "查看公開 IPv4 或 IPv6 位址的 RDAP 註冊資料。"],
    steps: id === "ipv4-network"
      ? ["從子網模組開始，可試用 192.168.1.10/24。", "使用錨點導覽切換到遮罩、主機、範圍、轉換或同子網模組。", "分別查看各模組結果；修正某個模組不會清除或覆蓋其他模組。"]
      : id === "ipv6-toolbox"
        ? ["輸入不含 zone ID 的 IPv6 位址。", "使用格式化模組查看展開形式和 RFC 5952 形式。", "使用前綴模組查看起始位址、結束位址和精確位址數量。"]
        : ["在要使用的模組中輸入一個公網 IPv4 或 IPv6 位址。", "明確提交 IP 查詢或 RDAP；另一個模組不會被改變。", "查看估算或註冊資料，並注意地理位置僅為估算，RDAP 是公開註冊資料。"],
    example: { title: item.example.title, description: item.example.description },
    principles: item.principles,
    limitations: item.limitations,
    faqs: item.faqs,
    aliases: item.aliases.concat(id === "ipv4-network"
      ? ["子網計算", "遮罩轉換", "CIDR 轉換", "同子網"]
      : id === "ipv6-toolbox"
        ? ["IPv6 展開", "IPv6 壓縮", "IPv6 前綴"]
        : ["IP 查詢", "RDAP 查詢", "WHOIS 查詢"]),
    keywords: item.keywords.concat(["網絡", "IP", "隱私", "本機處理", "工具箱"]),
  });
}
