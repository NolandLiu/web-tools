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
      introduction: "Format and developer tools transform or inspect text-based representations directly in the browser. They cover JSON, Base64, URL components, UUIDs, timestamps, text casing and counts, and common color notations.",
      useCases: ["Inspect or prepare a value while debugging an application.", "Perform a small text or format conversion without pasting content into an external service."],
      distinction: "These tools operate on representations and identifiers. Unit converters change measurement units, and calculators evaluate numeric scenarios.",
    },
    "zh-CN": {
      introduction: "格式与开发工具直接在浏览器中转换或检查文本表示，覆盖 JSON、Base64、URL 组件、UUID、时间戳、文本大小写与统计及常见颜色格式。",
      useCases: ["调试应用时检查或准备一个数值或文本。", "无需把内容粘贴到外部服务即可完成小型格式转换。"],
      distinction: "本分类处理表示形式和标识符；单位转换改变测量单位，计算工具评估数值场景。",
    },
    "zh-TW": {
      introduction: "格式與開發工具直接在瀏覽器中轉換或檢查文字表示，涵蓋 JSON、Base64、URL 元件、UUID、時間戳、文字大小寫與統計，以及常見顏色格式。",
      useCases: ["除錯應用程式時檢查或準備一段資料。", "不必把內容貼到外部服務即可完成小型格式轉換。"],
      distinction: "本分類處理表示形式和識別碼；單位轉換改變量測單位，計算工具評估數值情境。",
    },
  },
  calculators: {
    en: {
      introduction: "Calculators combine clearly labelled inputs with a focused formula. This collection covers percentages, discounts, BMI reference values, monthly compound growth, and elapsed date differences.",
      useCases: ["Check everyday arithmetic before making a decision.", "Explore a simplified scenario and copy the numeric result for further work."],
      distinction: "Calculators evaluate a formula rather than translate equivalent units. Their outputs are reference values and do not replace professional financial, medical, or legal advice.",
    },
    "zh-CN": {
      introduction: "计算工具通过清晰标注的输入执行一个明确公式，覆盖百分比、折扣、BMI 参考值、每月复利增长和日期经过差值。",
      useCases: ["在做决定前核对日常算术。", "探索简化情景，并复制结果用于后续工作。"],
      distinction: "计算工具执行公式，而不是转换等价单位；结果仅供参考，不能代替专业金融、医疗或法律意见。",
    },
    "zh-TW": {
      introduction: "計算工具以清楚標示的輸入執行一個明確公式，涵蓋百分比、折扣、BMI 參考值、每月複利成長和日期經過差值。",
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
};
