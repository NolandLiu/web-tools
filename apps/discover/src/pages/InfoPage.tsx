import { messages } from "../discover-data.js";

type InfoPageProps = {
  route: {
    locale: string;
    slug?: string;
  };
};

const infoContent = {
  en: {
    about: {
      eyebrow: "About GoDeskHub",
      title: "A compact directory for useful, privacy-first resources.",
      body: [
        "GoDeskHub Discover helps you find tools, websites, guides, and collections without turning the homepage into a noisy portal.",
        "Owned tools remain on tools.godeskhub.com. Discover keeps the broader resource catalog readable, searchable, and easy to browse.",
      ],
      points: ["Curated resources", "Privacy-first tooling", "Three-language navigation"],
    },
    contact: {
      eyebrow: "Contact",
      title: "Send concise feedback or resource corrections.",
      body: [
        "Use the contact channel for broken links, inaccurate descriptions, accessibility issues, or resource suggestions.",
        "Do not include private tool input, generated passwords, financial data, QR content, or files in feedback.",
      ],
      points: ["Bug reports", "Resource corrections", "Accessibility feedback"],
    },
    privacy: {
      eyebrow: "Privacy",
      title: "Discover is designed to avoid collecting tool content.",
      body: [
        "The directory can link to external resources, but GoDeskHub tools keep calculator, converter, text, password, QR, and file content in the browser unless a tool clearly states otherwise.",
        "Analytics, metadata, structured data, and feedback links must not include tool input or generated output.",
      ],
      points: ["No tool input in analytics", "Local-first tools", "Clear external links"],
    },
    terms: {
      eyebrow: "Terms",
      title: "Use resources carefully and verify important results.",
      body: [
        "GoDeskHub provides practical tools and references for general use. Results can depend on browser behavior, source data, and user input.",
        "Financial, medical, legal, and operational decisions should be checked against authoritative sources or qualified professionals.",
      ],
      points: ["General information", "No professional advice", "Verify critical outputs"],
    },
  },
  "zh-CN": {
    about: {
      eyebrow: "关于 GoDeskHub",
      title: "一个紧凑、实用、重视隐私的资源发现目录。",
      body: [
        "GoDeskHub Discover 帮助你查找工具、网站、指南和集合，不把首页做成嘈杂门户。",
        "自有工具继续运行在 tools.godeskhub.com。Discover 负责让更广泛的资源目录更易读、可搜索、可浏览。",
      ],
      points: ["精选资源", "隐私优先工具", "三语导航"],
    },
    contact: {
      eyebrow: "联系",
      title: "反馈链接错误、内容修正或可访问性问题。",
      body: [
        "你可以反馈失效链接、不准确描述、可访问性问题或资源建议。",
        "请不要在反馈中包含工具输入、生成密码、金融数据、二维码内容或文件。",
      ],
      points: ["问题反馈", "资源修正", "可访问性建议"],
    },
    privacy: {
      eyebrow: "隐私",
      title: "Discover 的设计目标是避免收集工具内容。",
      body: [
        "目录可以链接到外部资源，但 GoDeskHub 自有工具会把计算、转换、文本、密码、二维码和文件内容保留在浏览器中，除非工具页面明确说明。",
        "Analytics、metadata、结构化数据和反馈链接不得包含工具输入或生成结果。",
      ],
      points: ["工具输入不进入 analytics", "本地优先工具", "明确标识外部链接"],
    },
    terms: {
      eyebrow: "条款",
      title: "谨慎使用资源，并核对重要结果。",
      body: [
        "GoDeskHub 提供通用的实用工具和参考资源。结果可能受到浏览器行为、来源数据和用户输入影响。",
        "金融、医疗、法律和运营决策应以权威来源或专业人士意见为准。",
      ],
      points: ["一般信息", "不构成专业建议", "重要结果需核对"],
    },
  },
  "zh-TW": {
    about: {
      eyebrow: "關於 GoDeskHub",
      title: "一個緊湊、實用、重視隱私的資源發現目錄。",
      body: [
        "GoDeskHub Discover 協助你查找工具、網站、指南和集合，不把首頁做成嘈雜入口。",
        "自有工具繼續運行在 tools.godeskhub.com。Discover 負責讓更廣泛的資源目錄更易讀、可搜尋、可瀏覽。",
      ],
      points: ["精選資源", "隱私優先工具", "三語導航"],
    },
    contact: {
      eyebrow: "聯絡",
      title: "回報連結錯誤、內容修正或可訪問性問題。",
      body: [
        "你可以回報失效連結、不準確描述、可訪問性問題或資源建議。",
        "請不要在回饋中包含工具輸入、生成密碼、金融資料、QR Code 內容或檔案。",
      ],
      points: ["問題回報", "資源修正", "可訪問性建議"],
    },
    privacy: {
      eyebrow: "隱私",
      title: "Discover 的設計目標是避免收集工具內容。",
      body: [
        "目錄可以連結到外部資源，但 GoDeskHub 自有工具會把計算、轉換、文字、密碼、QR Code 和檔案內容保留在瀏覽器中，除非工具頁面明確說明。",
        "Analytics、metadata、結構化資料和回饋連結不得包含工具輸入或生成結果。",
      ],
      points: ["工具輸入不進入 analytics", "本機優先工具", "明確標示外部連結"],
    },
    terms: {
      eyebrow: "條款",
      title: "謹慎使用資源，並核對重要結果。",
      body: [
        "GoDeskHub 提供通用的實用工具和參考資源。結果可能受到瀏覽器行為、來源資料和使用者輸入影響。",
        "金融、醫療、法律和營運決策應以權威來源或專業人士意見為準。",
      ],
      points: ["一般資訊", "不構成專業建議", "重要結果需核對"],
    },
  },
};

export function InfoPage({ route }: InfoPageProps) {
  const t = messages[route.locale] ?? messages.en;
  const label = route.slug && route.slug in t.footer ? t.footer[route.slug as keyof typeof t.footer] : "GoDeskHub";
  const content = infoContent[route.locale as keyof typeof infoContent]?.[route.slug as keyof typeof infoContent.en]
    ?? infoContent.en[route.slug as keyof typeof infoContent.en]
    ?? infoContent.en.about;

  return (
    <section className="discover-page-section" aria-labelledby="discover-info-title">
      <article className="discover-info-layout">
        <aside className="discover-info-sidebar" aria-label={label}>
          <span>{content.eyebrow}</span>
          <strong>{label}</strong>
        </aside>
        <div className="discover-info-card">
          <p className="discover-info-eyebrow">{content.eyebrow}</p>
          <h1 id="discover-info-title">{content.title}</h1>
          {content.body.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
          <ul>
            {content.points.map(point => <li key={point}>{point}</li>)}
          </ul>
        </div>
      </article>
    </section>
  );
}
