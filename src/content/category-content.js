export const CATEGORY_CONTENT = {
  units: {
    en: {
      introduction: "Unit converters translate a known quantity into another unit without changing the underlying measurement. This collection covers physical length, mass, temperature, area, volume, speed, duration, and data-capacity conventions.",
      useCases: ["Compare specifications written for different countries or industries.", "Prepare a value for a form, drawing, recipe, journey, or technical note that expects another unit."],
      distinction: "Choose this category when the task is a unit-to-unit conversion. Developer tools transform text and formats, while calculators combine several inputs with a formula.",
    },
    "zh-CN": {
      introduction: "单位转换在不改变实际测量量的前提下，把已知数值换成另一种单位。本分类覆盖长度、质量、温度、面积、体积、速度、时长和数据容量约定。",
      useCases: ["比较不同国家或行业使用的规格。", "为需要另一单位的表单、图纸、配方、行程或技术说明准备数值。"],
      distinction: "当任务是单位与单位之间换算时选择本分类；开发工具处理文本与格式，计算工具则用多个输入执行公式。",
    },
    "zh-TW": {
      introduction: "單位轉換在不改變實際量測量的前提下，把已知數值換成另一種單位。本分類涵蓋長度、質量、溫度、面積、體積、速度、時長與資料容量慣例。",
      useCases: ["比較不同國家或產業使用的規格。", "為需要另一單位的表單、圖面、食譜、行程或技術說明準備數值。"],
      distinction: "當工作是單位與單位之間換算時選擇本分類；開發工具處理文字與格式，計算工具則以多個輸入執行公式。",
    },
  },
  developer: {
    en: {
      introduction: "Format and developer tools transform or inspect representations directly in the browser. They cover JSON, Base64, URL components, UUIDs, timestamps, text, color notations, and cryptographically generated constrained passwords.",
      useCases: ["Inspect or prepare a value while debugging an application.", "Perform a local text, format, identifier, or password-generation task without sending the input to an external service."],
      distinction: "These tools operate on representations and identifiers. Unit converters change measurement units, and calculators evaluate numeric scenarios.",
    },
    "zh-CN": {
      introduction: "格式与开发工具直接在浏览器中转换或检查表示形式，覆盖 JSON、Base64、URL 组件、UUID、时间戳、文本、颜色和密码学安全的约束密码生成。",
      useCases: ["调试应用时检查或准备数据。", "无需把输入发送给外部服务即可完成文本、格式、标识符或密码生成任务。"],
      distinction: "本分类处理表示形式和标识符；单位转换改变测量单位，计算工具评估数值场景。",
    },
    "zh-TW": {
      introduction: "格式與開發工具直接在瀏覽器中轉換或檢查表示形式，涵蓋 JSON、Base64、URL 元件、UUID、時間戳、文字、顏色及密碼學安全的限制密碼產生。",
      useCases: ["除錯應用程式時檢查或準備資料。", "不必把輸入傳送給外部服務即可完成文字、格式、識別碼或密碼產生工作。"],
      distinction: "本分類處理表示形式和識別碼；單位轉換改變量測單位，計算工具評估數值情境。",
    },
  },
  calculators: {
    en: {
      introduction: "Calculators combine clearly labelled inputs with focused rules or formulas. This collection covers everyday arithmetic, BMI and compound growth references, elapsed dates, fixed-period IRR, and cheque amount wording.",
      useCases: ["Check everyday arithmetic before making a decision.", "Explore a simplified scenario and copy the numeric result for further work."],
      distinction: "Calculators evaluate a formula rather than translate equivalent units. Their outputs are reference values and do not replace professional financial, medical, or legal advice.",
    },
    "zh-CN": {
      introduction: "计算工具通过清晰标注的输入执行明确规则或公式，覆盖日常算术、BMI 与复利参考、日期差、固定周期 IRR 和支票金额文字。",
      useCases: ["在做决定前核对日常算术。", "探索简化情景，并复制结果用于后续工作。"],
      distinction: "计算工具执行公式，而不是转换等价单位；结果仅供参考，不能代替专业金融、医疗或法律意见。",
    },
    "zh-TW": {
      introduction: "計算工具以清楚標示的輸入執行明確規則或公式，涵蓋日常算術、BMI 與複利參考、日期差、固定週期 IRR 及支票金額文字。",
      useCases: ["作決定前核對日常算術。", "探索簡化情境，並複製結果供後續使用。"],
      distinction: "計算工具執行公式，而不是轉換等值單位；結果僅供參考，不能取代專業金融、醫療或法律意見。",
    },
  },
  qr: {
    en: {
      introduction: "The QR Code category contains the browser-local generator for turning short text or a URL into a downloadable PNG. The source content remains visible so it can be checked before the image is shared.",
      useCases: ["Create a scannable link for a printed handout or another screen.", "Move a short piece of plain text between devices after testing reader compatibility."],
      distinction: "QR generation encodes content into an image; it does not shorten, validate, encrypt, host, or track the content.",
    },
    "zh-CN": {
      introduction: "QR Code 分类包含浏览器本地生成器，可把短文本或 URL 转为可下载 PNG。原始内容保持可见，方便在分享图片前核对。",
      useCases: ["为印刷资料或另一块屏幕创建可扫描链接。", "测试扫码兼容性后，在设备之间传递短文本。"],
      distinction: "QR 生成只是把内容编码成图片，不会缩短、校验、加密、托管或追踪内容。",
    },
    "zh-TW": {
      introduction: "QR Code 分類包含瀏覽器本機產生器，可把短文字或 URL 轉成可下載 PNG。原始內容保持可見，方便分享圖片前核對。",
      useCases: ["為印刷資料或另一個螢幕建立可掃描連結。", "測試掃描相容性後，在裝置間傳遞短文字。"],
      distinction: "QR 產生只是把內容編碼成圖片，不會縮短、驗證、加密、託管或追蹤內容。",
    },
  },
  "network-ip": {
    en: {
      introduction: "Network and IP tools inspect address notation, subnet boundaries, and public registration or lookup data. Four tools run entirely in the browser; IP lookup and RDAP use explicit same-origin API requests only after local public-address checks.",
      useCases: ["Plan IPv4 subnet boundaries or summarize exact IPv4 ranges.", "Normalize IPv6 addresses and check public IP registration data with clear privacy limits."],
      distinction: "Choose this category for IP addressing and network metadata. It does not include DNS, port scanning, domain WHOIS, risk scoring, or bulk lookup.",
    },
    "zh-CN": {
      introduction: "网络与 IP 工具用于检查地址表示、子网边界以及公开注册或查询数据。四个工具完全在浏览器本地运行；IP 查询和 RDAP 只在本地确认公网地址后，通过明确提交调用同源 API。",
      useCases: ["规划 IPv4 子网边界或汇总精确 IPv4 范围。", "规范化 IPv6 地址，并在清晰隐私边界下检查公开 IP 注册资料。"],
      distinction: "当任务涉及 IP 地址和网络元数据时选择本分类。本分类不包含 DNS、端口扫描、域名 WHOIS、风险评分或批量查询。",
    },
    "zh-TW": {
      introduction: "網絡與 IP 工具用於檢查位址表示、子網邊界以及公開註冊或查詢資料。四個工具完全在瀏覽器本機執行；IP 查詢和 RDAP 只在本機確認公網位址後，透過明確提交呼叫同源 API。",
      useCases: ["規劃 IPv4 子網邊界或彙總精確 IPv4 範圍。", "規範化 IPv6 位址，並在清楚隱私邊界下檢查公開 IP 註冊資料。"],
      distinction: "當工作涉及 IP 位址和網絡中繼資料時選擇本分類。本分類不包含 DNS、連接埠掃描、網域 WHOIS、風險評分或批次查詢。",
    },
  },
};
