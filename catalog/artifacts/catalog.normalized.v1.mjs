export default {
  "artifactVersion": "catalog.normalized.v1",
  "catalogSchemaVersion": "0.1.0",
  "records": {
    "categories": [
      {
        "schemaVersion": "0.1.0",
        "slug": "calculators",
        "status": "published",
        "id": "cat_calculators",
        "order": 20
      },
      {
        "schemaVersion": "0.1.0",
        "slug": "developer-tools",
        "status": "published",
        "id": "cat_developer",
        "order": 30
      },
      {
        "schemaVersion": "0.1.0",
        "slug": "network-ip",
        "status": "published",
        "id": "cat_network-ip",
        "order": 10
      },
      {
        "schemaVersion": "0.1.0",
        "slug": "qr-code",
        "status": "published",
        "id": "cat_qr",
        "order": 50
      },
      {
        "schemaVersion": "0.1.0",
        "slug": "unit-converters",
        "status": "published",
        "id": "cat_units",
        "order": 40
      }
    ],
    "collections": [
      {
        "schemaVersion": "0.1.0",
        "slug": "published-tools",
        "status": "published",
        "id": "col_published-tools",
        "mode": "manual",
        "resourceIds": [
          "res_tool_length-converter",
          "res_tool_weight-converter",
          "res_tool_temperature-converter",
          "res_tool_area-converter",
          "res_tool_volume-converter",
          "res_tool_speed-converter",
          "res_tool_time-converter",
          "res_tool_data-storage-converter",
          "res_tool_json-tools",
          "res_tool_base64-encoder-decoder",
          "res_tool_url-encoder-decoder",
          "res_tool_uuid-generator",
          "res_tool_timestamp-converter",
          "res_tool_text-case-converter",
          "res_tool_word-counter",
          "res_tool_color-converter",
          "res_tool_percentage-calculator",
          "res_tool_discount-calculator",
          "res_tool_bmi-calculator",
          "res_tool_compound-interest-calculator",
          "res_tool_date-interval-calculator",
          "res_tool_qr-code-generator",
          "res_tool_irr-calculator",
          "res_tool_cheque-amount-converter",
          "res_tool_password-generator",
          "res_tool_ipv4-network-toolbox",
          "res_tool_ipv6-toolbox"
        ]
      }
    ],
    "faqs": [
      {
        "schemaVersion": "0.1.0",
        "id": "faq_area-converter-q01",
        "status": "published",
        "placements": [
          {
            "resourceId": "res_tool_area-converter",
            "order": 1
          }
        ],
        "locales": [
          {
            "locale": "en",
            "question": "How many square metres are in a hectare?",
            "answer": "One hectare is 10,000 square metres."
          },
          {
            "locale": "zh-CN",
            "question": "1 公顷是多少平方米？",
            "answer": "1 公顷等于 10,000 平方米。"
          },
          {
            "locale": "zh-TW",
            "question": "1 公頃是多少平方公尺？",
            "answer": "1 公頃等於 10,000 平方公尺。"
          }
        ]
      },
      {
        "schemaVersion": "0.1.0",
        "id": "faq_area-converter-q02",
        "status": "published",
        "placements": [
          {
            "resourceId": "res_tool_area-converter",
            "order": 2
          }
        ],
        "locales": [
          {
            "locale": "en",
            "question": "Is an acre a square with fixed side length?",
            "answer": "An acre is an area of 4,046.8564224 square metres; its boundary can have many shapes."
          },
          {
            "locale": "zh-CN",
            "question": "英亩是否必须是正方形？",
            "answer": "不是。英亩是 4,046.8564224 平方米的面积，可以有不同形状。"
          },
          {
            "locale": "zh-TW",
            "question": "英畝一定是正方形嗎？",
            "answer": "不是。英畝是 4,046.8564224 平方公尺的面積，可以有不同形狀。"
          }
        ]
      },
      {
        "schemaVersion": "0.1.0",
        "id": "faq_base64-encoder-decoder-q01",
        "status": "published",
        "placements": [
          {
            "resourceId": "res_tool_base64-encoder-decoder",
            "order": 1
          }
        ],
        "locales": [
          {
            "locale": "en",
            "question": "Why is the Base64 output longer?",
            "answer": "Base64 represents each 3 input bytes with 4 printable characters, plus possible padding."
          },
          {
            "locale": "zh-CN",
            "question": "为什么输出更长？",
            "answer": "Base64 通常用 4 个字符表示 3 个输入字节，并可能加入填充。"
          },
          {
            "locale": "zh-TW",
            "question": "為什麼輸出更長？",
            "answer": "Base64 通常以 4 個字元表示 3 個輸入位元組，並可能加入填補。"
          }
        ]
      },
      {
        "schemaVersion": "0.1.0",
        "id": "faq_base64-encoder-decoder-q02",
        "status": "published",
        "placements": [
          {
            "resourceId": "res_tool_base64-encoder-decoder",
            "order": 2
          }
        ],
        "locales": [
          {
            "locale": "en",
            "question": "Can Base64 protect a password?",
            "answer": "No. It provides no confidentiality and must not be treated as encryption."
          },
          {
            "locale": "zh-CN",
            "question": "可以保护密码吗？",
            "answer": "不可以，Base64 没有保密能力。"
          },
          {
            "locale": "zh-TW",
            "question": "可以保護密碼嗎？",
            "answer": "不可以，Base64 沒有保密能力。"
          }
        ]
      },
      {
        "schemaVersion": "0.1.0",
        "id": "faq_base64-encoder-decoder-q03",
        "status": "published",
        "placements": [
          {
            "resourceId": "res_tool_base64-encoder-decoder",
            "order": 3
          }
        ],
        "locales": [
          {
            "locale": "en",
            "question": "Does it support Chinese text?",
            "answer": "Yes. Text is converted to UTF-8 bytes before encoding and decoded back with UTF-8."
          },
          {
            "locale": "zh-CN",
            "question": "支持中文吗？",
            "answer": "支持，文本会先转换为 UTF-8 字节。"
          },
          {
            "locale": "zh-TW",
            "question": "支援中文嗎？",
            "answer": "支援，文字會先轉成 UTF-8 位元組。"
          }
        ]
      },
      {
        "schemaVersion": "0.1.0",
        "id": "faq_bmi-calculator-q01",
        "status": "published",
        "placements": [
          {
            "resourceId": "res_tool_bmi-calculator",
            "order": 1
          }
        ],
        "locales": [
          {
            "locale": "en",
            "question": "Do the displayed BMI ranges provide a diagnosis?",
            "answer": "No. They are general adult screening labels and do not provide a diagnosis."
          },
          {
            "locale": "zh-CN",
            "question": "显示的 BMI 范围会构成诊断吗？",
            "answer": "不会，这些只是成人一般筛查标签，不构成诊断。"
          },
          {
            "locale": "zh-TW",
            "question": "顯示的 BMI 範圍會構成診斷嗎？",
            "answer": "不會，這些只是成人一般篩檢標籤，不構成診斷。"
          }
        ]
      },
      {
        "schemaVersion": "0.1.0",
        "id": "faq_bmi-calculator-q02",
        "status": "published",
        "placements": [
          {
            "resourceId": "res_tool_bmi-calculator",
            "order": 2
          }
        ],
        "locales": [
          {
            "locale": "en",
            "question": "Can children use the same interpretation?",
            "answer": "No. Child and adolescent assessment requires age- and sex-specific growth references."
          },
          {
            "locale": "zh-CN",
            "question": "儿童能使用相同解释吗？",
            "answer": "不能，儿童和青少年需要按年龄和性别评估。"
          },
          {
            "locale": "zh-TW",
            "question": "兒童能用相同方式解讀嗎？",
            "answer": "不能，兒童與青少年需依年齡和性別評估。"
          }
        ]
      },
      {
        "schemaVersion": "0.1.0",
        "id": "faq_bmi-calculator-q03",
        "status": "published",
        "placements": [
          {
            "resourceId": "res_tool_bmi-calculator",
            "order": 3
          }
        ],
        "locales": [
          {
            "locale": "en",
            "question": "Why are centimetres converted?",
            "answer": "The BMI formula uses height in metres, so centimetres are divided by 100 first."
          },
          {
            "locale": "zh-CN",
            "question": "为什么要转换厘米？",
            "answer": "BMI 公式使用米，所以先将厘米除以 100。"
          },
          {
            "locale": "zh-TW",
            "question": "為什麼要轉換公分？",
            "answer": "BMI 公式使用公尺，因此先將公分除以 100。"
          }
        ]
      },
      {
        "schemaVersion": "0.1.0",
        "id": "faq_cheque-amount-converter-q01",
        "status": "published",
        "placements": [
          {
            "resourceId": "res_tool_cheque-amount-converter",
            "order": 1
          }
        ],
        "locales": [
          {
            "locale": "en",
            "question": "Does the result have to specify dollars, yuan, or another currency?",
            "answer": "No. The default is currency-neutral, and the currency selector is optional."
          },
          {
            "locale": "zh-CN",
            "question": "必须添加美元或人民币吗？",
            "answer": "不必须。默认无币种，币种下拉菜单只是可选辅助。"
          },
          {
            "locale": "zh-TW",
            "question": "必須加入美元或人民幣嗎？",
            "answer": "不必。預設無幣別，幣別下拉選單只是可選輔助。"
          }
        ]
      },
      {
        "schemaVersion": "0.1.0",
        "id": "faq_cheque-amount-converter-q02",
        "status": "published",
        "placements": [
          {
            "resourceId": "res_tool_cheque-amount-converter",
            "order": 2
          }
        ],
        "locales": [
          {
            "locale": "en",
            "question": "Will a third decimal digit be rounded?",
            "answer": "No. Inputs with more than two decimal places are rejected."
          },
          {
            "locale": "zh-CN",
            "question": "第三位小数会四舍五入吗？",
            "answer": "不会，超过两位小数的输入会被拒绝。"
          },
          {
            "locale": "zh-TW",
            "question": "第三位小數會四捨五入嗎？",
            "answer": "不會，超過兩位小數的輸入會被拒絕。"
          }
        ]
      },
      {
        "schemaVersion": "0.1.0",
        "id": "faq_cheque-amount-converter-q03",
        "status": "published",
        "placements": [
          {
            "resourceId": "res_tool_cheque-amount-converter",
            "order": 3
          }
        ],
        "locales": [
          {
            "locale": "en",
            "question": "Can I switch Chinese financial numerals?",
            "answer": "Yes. The Chinese result can use either Traditional or Simplified financial numerals."
          },
          {
            "locale": "zh-CN",
            "question": "可以切换简体和繁体金融大写吗？",
            "answer": "可以。中文结果可以选择繁体或简体金融大写。"
          },
          {
            "locale": "zh-TW",
            "question": "可以切換簡體和繁體金融大寫嗎？",
            "answer": "可以。中文結果可選擇繁體或簡體金融大寫。"
          }
        ]
      },
      {
        "schemaVersion": "0.1.0",
        "id": "faq_cheque-amount-converter-q04",
        "status": "published",
        "placements": [
          {
            "resourceId": "res_tool_cheque-amount-converter",
            "order": 4
          }
        ],
        "locales": [
          {
            "locale": "en",
            "question": "Should I draw a line after the amount on paper?",
            "answer": "Many cheque-writing practices fill the remaining blank space after the written amount to reduce tampering risk. Check your bank's exact requirement."
          },
          {
            "locale": "zh-CN",
            "question": "纸质支票金额后要画横线吗？",
            "answer": "很多支票书写习惯会在大写金额后填满剩余空白，以降低被他人补写金额的风险；请以银行要求为准。"
          },
          {
            "locale": "zh-TW",
            "question": "紙本支票金額後要畫橫線嗎？",
            "answer": "很多支票書寫習慣會在大寫金額後填滿剩餘空白，以降低被他人補寫金額的風險；請以銀行要求為準。"
          }
        ]
      },
      {
        "schemaVersion": "0.1.0",
        "id": "faq_color-converter-q01",
        "status": "published",
        "placements": [
          {
            "resourceId": "res_tool_color-converter",
            "order": 1
          }
        ],
        "locales": [
          {
            "locale": "en",
            "question": "Does three-digit HEX work?",
            "answer": "Yes. Each digit is doubled, so #abc is interpreted as #aabbcc."
          },
          {
            "locale": "zh-CN",
            "question": "支持三位 HEX 吗？",
            "answer": "支持，例如 #abc 会扩展为 #aabbcc。"
          },
          {
            "locale": "zh-TW",
            "question": "支援三位 HEX 嗎？",
            "answer": "支援，例如 #abc 會展開為 #aabbcc。"
          }
        ]
      },
      {
        "schemaVersion": "0.1.0",
        "id": "faq_color-converter-q02",
        "status": "published",
        "placements": [
          {
            "resourceId": "res_tool_color-converter",
            "order": 2
          }
        ],
        "locales": [
          {
            "locale": "en",
            "question": "Are RGB values clamped?",
            "answer": "No. Values outside 0–255 are rejected instead of clamped."
          },
          {
            "locale": "zh-CN",
            "question": "RGB 超出范围会被截断吗？",
            "answer": "不会，低于 0 或高于 255 会被判为无效。"
          },
          {
            "locale": "zh-TW",
            "question": "RGB 超出範圍會被截斷嗎？",
            "answer": "不會，低於 0 或高於 255 會被判定無效。"
          }
        ]
      },
      {
        "schemaVersion": "0.1.0",
        "id": "faq_compound-interest-calculator-q01",
        "status": "published",
        "placements": [
          {
            "resourceId": "res_tool_compound-interest-calculator",
            "order": 1
          }
        ],
        "locales": [
          {
            "locale": "en",
            "question": "Can I choose annual, monthly, or daily compounding?",
            "answer": "Yes. Enter 1, 12, or up to 365 compounding periods per year."
          },
          {
            "locale": "zh-CN",
            "question": "可以选择按年、按月或按日复利吗？",
            "answer": "可以，分别输入每年 1、12 或最多 365 次复利。"
          },
          {
            "locale": "zh-TW",
            "question": "可以選擇按年、按月或按日複利嗎？",
            "answer": "可以，分別輸入每年 1、12 或最多 365 次複利。"
          }
        ]
      },
      {
        "schemaVersion": "0.1.0",
        "id": "faq_compound-interest-calculator-q02",
        "status": "published",
        "placements": [
          {
            "resourceId": "res_tool_compound-interest-calculator",
            "order": 2
          }
        ],
        "locales": [
          {
            "locale": "en",
            "question": "Are regular contributions included?",
            "answer": "No. Only one initial principal is included."
          },
          {
            "locale": "zh-CN",
            "question": "包含定期投入吗？",
            "answer": "不包含，只计算一次初始本金。"
          },
          {
            "locale": "zh-TW",
            "question": "包含定期投入嗎？",
            "answer": "不包含，只計算一次初始本金。"
          }
        ]
      },
      {
        "schemaVersion": "0.1.0",
        "id": "faq_compound-interest-calculator-q03",
        "status": "published",
        "placements": [
          {
            "resourceId": "res_tool_compound-interest-calculator",
            "order": 3
          }
        ],
        "locales": [
          {
            "locale": "en",
            "question": "Is the displayed interest simple interest?",
            "answer": "No. It is the final compounded amount minus the principal."
          },
          {
            "locale": "zh-CN",
            "question": "显示利息是单利吗？",
            "answer": "不是，是最终复利金额减去本金。"
          },
          {
            "locale": "zh-TW",
            "question": "顯示利息是單利嗎？",
            "answer": "不是，是最終複利金額減去本金。"
          }
        ]
      },
      {
        "schemaVersion": "0.1.0",
        "id": "faq_data-storage-converter-q01",
        "status": "published",
        "placements": [
          {
            "resourceId": "res_tool_data-storage-converter",
            "order": 1
          }
        ],
        "locales": [
          {
            "locale": "en",
            "question": "What is the difference between GB and GiB?",
            "answer": "GB is decimal and equals 1,000,000,000 bytes; GiB is binary and equals 1,073,741,824 bytes."
          },
          {
            "locale": "zh-CN",
            "question": "GB 与 GiB 有什么区别？",
            "answer": "GB 是十进制单位，等于 1,000,000,000 B；GiB 是二进制单位，等于 1,073,741,824 B。"
          },
          {
            "locale": "zh-TW",
            "question": "GB 與 GiB 有什麼差別？",
            "answer": "GB 是十進位單位，等於 1,000,000,000 B；GiB 是二進位單位，等於 1,073,741,824 B。"
          }
        ]
      },
      {
        "schemaVersion": "0.1.0",
        "id": "faq_data-storage-converter-q02",
        "status": "published",
        "placements": [
          {
            "resourceId": "res_tool_data-storage-converter",
            "order": 2
          }
        ],
        "locales": [
          {
            "locale": "en",
            "question": "Why can drive capacity and system display differ?",
            "answer": "Drive vendors commonly use decimal units while some systems present binary quantities, so the numeric labels differ for the same byte count."
          },
          {
            "locale": "zh-CN",
            "question": "为什么硬盘容量与系统显示可能不同？",
            "answer": "硬盘厂商通常使用十进制单位，部分系统以二进制数量显示，因此同一字节数的标签数值不同。"
          },
          {
            "locale": "zh-TW",
            "question": "為什麼硬碟容量與系統顯示可能不同？",
            "answer": "硬碟廠商通常使用十進位單位，部分系統以二進位數量顯示，因此同一位元組數的標示數值不同。"
          }
        ]
      },
      {
        "schemaVersion": "0.1.0",
        "id": "faq_date-interval-calculator-q01",
        "status": "published",
        "placements": [
          {
            "resourceId": "res_tool_date-interval-calculator",
            "order": 1
          }
        ],
        "locales": [
          {
            "locale": "en",
            "question": "Does the order of the dates matter?",
            "answer": "No. The absolute difference is used."
          },
          {
            "locale": "zh-CN",
            "question": "日期顺序有影响吗？",
            "answer": "没有，工具使用绝对差值。"
          },
          {
            "locale": "zh-TW",
            "question": "日期順序有影響嗎？",
            "answer": "沒有，工具使用絕對差值。"
          }
        ]
      },
      {
        "schemaVersion": "0.1.0",
        "id": "faq_date-interval-calculator-q02",
        "status": "published",
        "placements": [
          {
            "resourceId": "res_tool_date-interval-calculator",
            "order": 2
          }
        ],
        "locales": [
          {
            "locale": "en",
            "question": "Are both start and end dates counted?",
            "answer": "No. The result is the elapsed gap between them."
          },
          {
            "locale": "zh-CN",
            "question": "是否同时包含开始和结束日？",
            "answer": "不包含，结果是两者之间的经过间隔。"
          },
          {
            "locale": "zh-TW",
            "question": "會同時包含開始和結束日嗎？",
            "answer": "不會，結果是兩者之間的經過間隔。"
          }
        ]
      },
      {
        "schemaVersion": "0.1.0",
        "id": "faq_date-interval-calculator-q03",
        "status": "published",
        "placements": [
          {
            "resourceId": "res_tool_date-interval-calculator",
            "order": 3
          }
        ],
        "locales": [
          {
            "locale": "en",
            "question": "Does it exclude weekends?",
            "answer": "No. Every elapsed day is treated equally."
          },
          {
            "locale": "zh-CN",
            "question": "会排除周末吗？",
            "answer": "不会，所有经过日同等处理。"
          },
          {
            "locale": "zh-TW",
            "question": "會排除週末嗎？",
            "answer": "不會，所有經過日同等處理。"
          }
        ]
      },
      {
        "schemaVersion": "0.1.0",
        "id": "faq_discount-calculator-q01",
        "status": "published",
        "placements": [
          {
            "resourceId": "res_tool_discount-calculator",
            "order": 1
          }
        ],
        "locales": [
          {
            "locale": "en",
            "question": "Can the discount exceed 100%?",
            "answer": "No. Rates below 0 or above 100 are rejected."
          },
          {
            "locale": "zh-CN",
            "question": "折扣率可以超过 100% 吗？",
            "answer": "不可以，低于 0 或高于 100 会被拒绝。"
          },
          {
            "locale": "zh-TW",
            "question": "折扣率可以超過 100% 嗎？",
            "answer": "不可以，低於 0 或高於 100 會被拒絕。"
          }
        ]
      },
      {
        "schemaVersion": "0.1.0",
        "id": "faq_discount-calculator-q02",
        "status": "published",
        "placements": [
          {
            "resourceId": "res_tool_discount-calculator",
            "order": 2
          }
        ],
        "locales": [
          {
            "locale": "en",
            "question": "Does it know my currency?",
            "answer": "No. Values are unitless, so use the same currency for the original price and result."
          },
          {
            "locale": "zh-CN",
            "question": "工具知道货币吗？",
            "answer": "不知道，输入和结果使用同一货币即可。"
          },
          {
            "locale": "zh-TW",
            "question": "工具知道貨幣嗎？",
            "answer": "不知道，只要輸入和結果採同一貨幣即可。"
          }
        ]
      },
      {
        "schemaVersion": "0.1.0",
        "id": "faq_ipv4-network-toolbox-q01",
        "status": "published",
        "placements": [
          {
            "resourceId": "res_tool_ipv4-network-toolbox",
            "order": 1
          }
        ],
        "locales": [
          {
            "locale": "en",
            "question": "Why are several IPv4 functions on one page?",
            "answer": "They share the same IPv4 addressing model, so grouping them avoids duplicate pages while keeping each module independent."
          },
          {
            "locale": "zh-CN",
            "question": "Why are several IPv4 functions on one page?",
            "answer": "They share the same IPv4 addressing model, so grouping them avoids duplicate pages while keeping each module independent."
          },
          {
            "locale": "zh-TW",
            "question": "Why are several IPv4 functions on one page?",
            "answer": "They share the same IPv4 addressing model, so grouping them avoids duplicate pages while keeping each module independent."
          }
        ]
      },
      {
        "schemaVersion": "0.1.0",
        "id": "faq_ipv4-network-toolbox-q02",
        "status": "published",
        "placements": [
          {
            "resourceId": "res_tool_ipv4-network-toolbox",
            "order": 2
          }
        ],
        "locales": [
          {
            "locale": "en",
            "question": "Does range-to-CIDR approximate?",
            "answer": "No. Returned CIDR blocks do not cover addresses outside the requested IPv4 range."
          },
          {
            "locale": "zh-CN",
            "question": "Does range-to-CIDR approximate?",
            "answer": "No. Returned CIDR blocks do not cover addresses outside the requested IPv4 range."
          },
          {
            "locale": "zh-TW",
            "question": "Does range-to-CIDR approximate?",
            "answer": "No. Returned CIDR blocks do not cover addresses outside the requested IPv4 range."
          }
        ]
      },
      {
        "schemaVersion": "0.1.0",
        "id": "faq_ipv6-toolbox-q01",
        "status": "published",
        "placements": [
          {
            "resourceId": "res_tool_ipv6-toolbox",
            "order": 1
          }
        ],
        "locales": [
          {
            "locale": "en",
            "question": "Can one zero group be compressed?",
            "answer": "No. RFC 5952 avoids compressing a single 0000 group."
          },
          {
            "locale": "zh-CN",
            "question": "Can one zero group be compressed?",
            "answer": "No. RFC 5952 avoids compressing a single 0000 group."
          },
          {
            "locale": "zh-TW",
            "question": "Can one zero group be compressed?",
            "answer": "No. RFC 5952 avoids compressing a single 0000 group."
          }
        ]
      },
      {
        "schemaVersion": "0.1.0",
        "id": "faq_ipv6-toolbox-q02",
        "status": "published",
        "placements": [
          {
            "resourceId": "res_tool_ipv6-toolbox",
            "order": 2
          }
        ],
        "locales": [
          {
            "locale": "en",
            "question": "Does this page query the network?",
            "answer": "No. IPv6 formatting and prefix calculations run locally in the browser."
          },
          {
            "locale": "zh-CN",
            "question": "Does this page query the network?",
            "answer": "No. IPv6 formatting and prefix calculations run locally in the browser."
          },
          {
            "locale": "zh-TW",
            "question": "Does this page query the network?",
            "answer": "No. IPv6 formatting and prefix calculations run locally in the browser."
          }
        ]
      },
      {
        "schemaVersion": "0.1.0",
        "id": "faq_irr-calculator-q01",
        "status": "published",
        "placements": [
          {
            "resourceId": "res_tool_irr-calculator",
            "order": 1
          }
        ],
        "locales": [
          {
            "locale": "en",
            "question": "Does this calculator support XIRR?",
            "answer": "No. It accepts period numbers only and assumes equal spacing."
          },
          {
            "locale": "zh-CN",
            "question": "支持 XIRR 吗？",
            "answer": "不支持；本工具只使用期数，并假设现金流等间隔。"
          },
          {
            "locale": "zh-TW",
            "question": "支援 XIRR 嗎？",
            "answer": "不支援；本工具只使用期數，並假設現金流等間隔。"
          }
        ]
      },
      {
        "schemaVersion": "0.1.0",
        "id": "faq_irr-calculator-q02",
        "status": "published",
        "placements": [
          {
            "resourceId": "res_tool_irr-calculator",
            "order": 2
          }
        ],
        "locales": [
          {
            "locale": "en",
            "question": "Why can one cash-flow sequence have multiple IRRs?",
            "answer": "When cash-flow signs change more than once, the NPV equation can cross zero at more than one rate."
          },
          {
            "locale": "zh-CN",
            "question": "为什么可能有多个 IRR？",
            "answer": "现金流符号多次变化时，净现值曲线可能多次穿过零点。"
          },
          {
            "locale": "zh-TW",
            "question": "為何可能有多個 IRR？",
            "answer": "現金流正負號多次變化時，淨現值曲線可能多次穿過零點。"
          }
        ]
      },
      {
        "schemaVersion": "0.1.0",
        "id": "faq_irr-calculator-q03",
        "status": "published",
        "placements": [
          {
            "resourceId": "res_tool_irr-calculator",
            "order": 3
          }
        ],
        "locales": [
          {
            "locale": "en",
            "question": "What does no root mean?",
            "answer": "No stable zero crossing was found within the documented bounded search domain; the tool does not fabricate a rate."
          },
          {
            "locale": "zh-CN",
            "question": "无根是什么意思？",
            "answer": "在记录的有界搜索域内没有找到稳定零点，工具不会伪造结果。"
          },
          {
            "locale": "zh-TW",
            "question": "無根是什麼意思？",
            "answer": "在記錄的有界搜尋域內沒有找到穩定零點，工具不會捏造結果。"
          }
        ]
      },
      {
        "schemaVersion": "0.1.0",
        "id": "faq_json-tools-q01",
        "status": "published",
        "placements": [
          {
            "resourceId": "res_tool_json-tools",
            "order": 1
          }
        ],
        "locales": [
          {
            "locale": "en",
            "question": "Does formatting change the JSON data?",
            "answer": "For valid JSON values it changes whitespace and indentation, not the parsed value. Number precision limits of JavaScript still apply."
          },
          {
            "locale": "zh-CN",
            "question": "格式化会改变数据吗？",
            "answer": "对有效 JSON，它主要改变空白和缩进；JavaScript 数值精度限制仍然存在。"
          },
          {
            "locale": "zh-TW",
            "question": "格式化會改變資料嗎？",
            "answer": "對有效 JSON，主要改變空白和縮排；JavaScript 數值精度限制仍存在。"
          }
        ]
      },
      {
        "schemaVersion": "0.1.0",
        "id": "faq_json-tools-q02",
        "status": "published",
        "placements": [
          {
            "resourceId": "res_tool_json-tools",
            "order": 2
          }
        ],
        "locales": [
          {
            "locale": "en",
            "question": "Is minified JSON encrypted or compressed as a file?",
            "answer": "No. Minification only removes insignificant whitespace; the text remains readable and is not encryption or general-purpose compression."
          },
          {
            "locale": "zh-CN",
            "question": "压缩是否等于加密？",
            "answer": "不是。压缩模式只移除非必要空白，文本仍可读取。"
          },
          {
            "locale": "zh-TW",
            "question": "壓縮等於加密嗎？",
            "answer": "不是，只會移除非必要空白，文字仍可讀取。"
          }
        ]
      },
      {
        "schemaVersion": "0.1.0",
        "id": "faq_json-tools-q03",
        "status": "published",
        "placements": [
          {
            "resourceId": "res_tool_json-tools",
            "order": 3
          }
        ],
        "locales": [
          {
            "locale": "en",
            "question": "Is the pasted JSON uploaded?",
            "answer": "No. This implementation parses and renders the text in the current browser."
          },
          {
            "locale": "zh-CN",
            "question": "JSON 会上传吗？",
            "answer": "不会，解析和输出都在当前浏览器进行。"
          },
          {
            "locale": "zh-TW",
            "question": "JSON 會上傳嗎？",
            "answer": "不會，解析和輸出都在目前瀏覽器進行。"
          }
        ]
      },
      {
        "schemaVersion": "0.1.0",
        "id": "faq_length-converter-q01",
        "status": "published",
        "placements": [
          {
            "resourceId": "res_tool_length-converter",
            "order": 1
          }
        ],
        "locales": [
          {
            "locale": "en",
            "question": "How many feet are in one metre?",
            "answer": "The converter uses the exact international foot definition of 0.3048 metre, so one metre is about 3.280839895 feet."
          },
          {
            "locale": "zh-CN",
            "question": "1 米等于多少英尺？",
            "answer": "工具采用国际英尺的精确定义 0.3048 米，因此 1 米约为 3.280839895 英尺。"
          },
          {
            "locale": "zh-TW",
            "question": "1 公尺等於多少英尺？",
            "answer": "工具採用國際英尺的精確定義 0.3048 公尺，因此 1 公尺約為 3.280839895 英尺。"
          }
        ]
      },
      {
        "schemaVersion": "0.1.0",
        "id": "faq_length-converter-q02",
        "status": "published",
        "placements": [
          {
            "resourceId": "res_tool_length-converter",
            "order": 2
          }
        ],
        "locales": [
          {
            "locale": "en",
            "question": "Can I enter a negative length?",
            "answer": "The calculator accepts any finite number, including negative values, although a negative physical length may not make sense for the task."
          },
          {
            "locale": "zh-CN",
            "question": "可以输入负数吗？",
            "answer": "可以输入任何有限数值，但负长度在多数实际场景中没有物理意义。"
          },
          {
            "locale": "zh-TW",
            "question": "可以輸入負數嗎？",
            "answer": "可以輸入任何有限數值，但負長度在多數實際情境中沒有物理意義。"
          }
        ]
      },
      {
        "schemaVersion": "0.1.0",
        "id": "faq_password-generator-q01",
        "status": "published",
        "placements": [
          {
            "resourceId": "res_tool_password-generator",
            "order": 1
          }
        ],
        "locales": [
          {
            "locale": "en",
            "question": "Are passwords stored or added to the URL?",
            "answer": "No. Configuration changes clear old results, and refresh does not restore generated passwords."
          },
          {
            "locale": "zh-CN",
            "question": "密码会保存或写入 URL 吗？",
            "answer": "不会；配置变化会清除旧结果，刷新后也不会恢复密码。"
          },
          {
            "locale": "zh-TW",
            "question": "密碼會儲存或寫入 URL 嗎？",
            "answer": "不會；設定變更會清除舊結果，重新整理後亦不會恢復密碼。"
          }
        ]
      },
      {
        "schemaVersion": "0.1.0",
        "id": "faq_password-generator-q02",
        "status": "published",
        "placements": [
          {
            "resourceId": "res_tool_password-generator",
            "order": 2
          }
        ],
        "locales": [
          {
            "locale": "en",
            "question": "Does excluding confusing characters make a password stronger?",
            "answer": "It can improve readability but reduces the character pool, so length and other rules still matter."
          },
          {
            "locale": "zh-CN",
            "question": "排除易混淆字符一定更安全吗？",
            "answer": "这能改善可读性，但会缩小字符池，仍须合理设置长度和规则。"
          },
          {
            "locale": "zh-TW",
            "question": "排除易混淆字元一定更安全嗎？",
            "answer": "這可改善可讀性，但會縮小字元池，仍須合理設定長度和規則。"
          }
        ]
      },
      {
        "schemaVersion": "0.1.0",
        "id": "faq_password-generator-q03",
        "status": "published",
        "placements": [
          {
            "resourceId": "res_tool_password-generator",
            "order": 3
          }
        ],
        "locales": [
          {
            "locale": "en",
            "question": "Does the strength label guarantee safety?",
            "answer": "No. It is a relative configuration indicator, not a promise or cracking-time estimate."
          },
          {
            "locale": "zh-CN",
            "question": "强度提示是否保证安全？",
            "answer": "不保证；它只是相对配置提示。"
          },
          {
            "locale": "zh-TW",
            "question": "強度提示是否保證安全？",
            "answer": "不保證；它只是相對設定提示。"
          }
        ]
      },
      {
        "schemaVersion": "0.1.0",
        "id": "faq_percentage-calculator-q01",
        "status": "published",
        "placements": [
          {
            "resourceId": "res_tool_percentage-calculator",
            "order": 1
          }
        ],
        "locales": [
          {
            "locale": "en",
            "question": "Does the result include the original value?",
            "answer": "No. It returns only the percentage amount."
          },
          {
            "locale": "zh-CN",
            "question": "结果包含原数值吗？",
            "answer": "不包含，只返回百分比对应的数值。"
          },
          {
            "locale": "zh-TW",
            "question": "結果包含原數值嗎？",
            "answer": "不包含，只回傳百分比對應的數值。"
          }
        ]
      },
      {
        "schemaVersion": "0.1.0",
        "id": "faq_percentage-calculator-q02",
        "status": "published",
        "placements": [
          {
            "resourceId": "res_tool_percentage-calculator",
            "order": 2
          }
        ],
        "locales": [
          {
            "locale": "en",
            "question": "Can the percentage exceed 100?",
            "answer": "Yes. The implementation accepts any finite percentage."
          },
          {
            "locale": "zh-CN",
            "question": "百分比可以超过 100 吗？",
            "answer": "可以，当前实现接受任何有限百分比。"
          },
          {
            "locale": "zh-TW",
            "question": "百分比可以超過 100 嗎？",
            "answer": "可以，目前實作接受任何有限百分比。"
          }
        ]
      },
      {
        "schemaVersion": "0.1.0",
        "id": "faq_qr-code-generator-q01",
        "status": "published",
        "placements": [
          {
            "resourceId": "res_tool_qr-code-generator",
            "order": 1
          }
        ],
        "locales": [
          {
            "locale": "en",
            "question": "Is the QR content uploaded?",
            "answer": "No. The application generates the image in the current browser."
          },
          {
            "locale": "zh-CN",
            "question": "QR 内容会上传吗？",
            "answer": "不会，图片在当前浏览器生成。"
          },
          {
            "locale": "zh-TW",
            "question": "QR 內容會上傳嗎？",
            "answer": "不會，圖片在目前瀏覽器產生。"
          }
        ]
      },
      {
        "schemaVersion": "0.1.0",
        "id": "faq_qr-code-generator-q02",
        "status": "published",
        "placements": [
          {
            "resourceId": "res_tool_qr-code-generator",
            "order": 2
          }
        ],
        "locales": [
          {
            "locale": "en",
            "question": "Why can a long QR Code be hard to scan?",
            "answer": "More data requires a denser symbol. At a fixed image size, smaller modules are harder for some cameras and printers to resolve."
          },
          {
            "locale": "zh-CN",
            "question": "长内容为什么难扫？",
            "answer": "数据越多符号越密，在固定图片尺寸下模块更小。"
          },
          {
            "locale": "zh-TW",
            "question": "長內容為何較難掃描？",
            "answer": "資料越多符號越密，在固定圖片尺寸下模組更小。"
          }
        ]
      },
      {
        "schemaVersion": "0.1.0",
        "id": "faq_qr-code-generator-q03",
        "status": "published",
        "placements": [
          {
            "resourceId": "res_tool_qr-code-generator",
            "order": 3
          }
        ],
        "locales": [
          {
            "locale": "en",
            "question": "Which colors work best?",
            "answer": "A dark foreground on a light, high-contrast background is the safest general choice."
          },
          {
            "locale": "zh-CN",
            "question": "什么颜色最稳妥？",
            "answer": "通常使用深色前景和浅色高对比背景。"
          },
          {
            "locale": "zh-TW",
            "question": "什麼顏色最穩妥？",
            "answer": "通常使用深色前景和淺色高對比背景。"
          }
        ]
      },
      {
        "schemaVersion": "0.1.0",
        "id": "faq_speed-converter-q01",
        "status": "published",
        "placements": [
          {
            "resourceId": "res_tool_speed-converter",
            "order": 1
          }
        ],
        "locales": [
          {
            "locale": "en",
            "question": "What is a knot?",
            "answer": "One knot is one nautical mile per hour and is represented here as 0.5144444444 metre per second."
          },
          {
            "locale": "zh-CN",
            "question": "“节”是什么？",
            "answer": "1 节是每小时 1 海里，本工具按约 0.5144444444 米／秒计算。"
          },
          {
            "locale": "zh-TW",
            "question": "「節」是什麼？",
            "answer": "1 節是每小時 1 海里，本工具以約 0.5144444444 公尺／秒計算。"
          }
        ]
      },
      {
        "schemaVersion": "0.1.0",
        "id": "faq_speed-converter-q02",
        "status": "published",
        "placements": [
          {
            "resourceId": "res_tool_speed-converter",
            "order": 2
          }
        ],
        "locales": [
          {
            "locale": "en",
            "question": "Does mph mean miles per hour?",
            "answer": "Yes. The option uses the international mile and a 3,600-second hour."
          },
          {
            "locale": "zh-CN",
            "question": "mph 是否指英里／小时？",
            "answer": "是，使用国际英里和 3,600 秒的小时。"
          },
          {
            "locale": "zh-TW",
            "question": "mph 是英里／小時嗎？",
            "answer": "是，使用國際英里和 3,600 秒的小時。"
          }
        ]
      },
      {
        "schemaVersion": "0.1.0",
        "id": "faq_temperature-converter-q01",
        "status": "published",
        "placements": [
          {
            "resourceId": "res_tool_temperature-converter",
            "order": 1
          }
        ],
        "locales": [
          {
            "locale": "en",
            "question": "Why does kelvin not use a degree symbol?",
            "answer": "The SI unit name is kelvin and its symbol is K, without a degree sign."
          },
          {
            "locale": "zh-CN",
            "question": "开尔文为什么没有度数符号？",
            "answer": "SI 单位名称是开尔文，符号为 K，不使用度数符号。"
          },
          {
            "locale": "zh-TW",
            "question": "克氏為什麼沒有度數符號？",
            "answer": "SI 單位名稱是 kelvin，符號為 K，不使用度數符號。"
          }
        ]
      },
      {
        "schemaVersion": "0.1.0",
        "id": "faq_temperature-converter-q02",
        "status": "published",
        "placements": [
          {
            "resourceId": "res_tool_temperature-converter",
            "order": 2
          }
        ],
        "locales": [
          {
            "locale": "en",
            "question": "At what value are Celsius and Fahrenheit equal?",
            "answer": "Both scales have the same numerical value at −40."
          },
          {
            "locale": "zh-CN",
            "question": "摄氏和华氏何时数值相同？",
            "answer": "两者在 −40 时数值相同。"
          },
          {
            "locale": "zh-TW",
            "question": "攝氏和華氏何時數值相同？",
            "answer": "兩者在 −40 時數值相同。"
          }
        ]
      },
      {
        "schemaVersion": "0.1.0",
        "id": "faq_text-case-converter-q01",
        "status": "published",
        "placements": [
          {
            "resourceId": "res_tool_text-case-converter",
            "order": 1
          }
        ],
        "locales": [
          {
            "locale": "en",
            "question": "Does title mode understand editorial style guides?",
            "answer": "No. It capitalizes word starts and does not keep language-specific minor words lowercase."
          },
          {
            "locale": "zh-CN",
            "question": "标题模式是否遵循新闻标题规范？",
            "answer": "不会，它只按规则大写词首。"
          },
          {
            "locale": "zh-TW",
            "question": "標題模式會遵循新聞標題規範嗎？",
            "answer": "不會，只會依規則大寫詞首。"
          }
        ]
      },
      {
        "schemaVersion": "0.1.0",
        "id": "faq_text-case-converter-q02",
        "status": "published",
        "placements": [
          {
            "resourceId": "res_tool_text-case-converter",
            "order": 2
          }
        ],
        "locales": [
          {
            "locale": "en",
            "question": "Will camel mode preserve acronyms?",
            "answer": "Not reliably. It applies simple casing rules rather than an acronym dictionary."
          },
          {
            "locale": "zh-CN",
            "question": "驼峰模式会保留缩写吗？",
            "answer": "不一定，它没有缩写词典。"
          },
          {
            "locale": "zh-TW",
            "question": "駝峰模式會保留縮寫嗎？",
            "answer": "不一定，它沒有縮寫字典。"
          }
        ]
      },
      {
        "schemaVersion": "0.1.0",
        "id": "faq_time-converter-q01",
        "status": "published",
        "placements": [
          {
            "resourceId": "res_tool_time-converter",
            "order": 1
          }
        ],
        "locales": [
          {
            "locale": "en",
            "question": "Is every day treated as 24 hours?",
            "answer": "Yes. A day is fixed at 86,400 seconds in this converter."
          },
          {
            "locale": "zh-CN",
            "question": "每一天都按 24 小时吗？",
            "answer": "是，本转换器固定按 86,400 秒计算一天。"
          },
          {
            "locale": "zh-TW",
            "question": "每一天都按 24 小時計算嗎？",
            "answer": "是，本轉換器固定以 86,400 秒計算一天。"
          }
        ]
      },
      {
        "schemaVersion": "0.1.0",
        "id": "faq_time-converter-q02",
        "status": "published",
        "placements": [
          {
            "resourceId": "res_tool_time-converter",
            "order": 2
          }
        ],
        "locales": [
          {
            "locale": "en",
            "question": "Can I convert months or years?",
            "answer": "No. Their calendar lengths vary, so they are intentionally not offered as fixed units."
          },
          {
            "locale": "zh-CN",
            "question": "可以转换月份或年份吗？",
            "answer": "不可以，因为它们的日历长度并不固定。"
          },
          {
            "locale": "zh-TW",
            "question": "可以轉換月份或年份嗎？",
            "answer": "不可以，因為其日曆長度不固定。"
          }
        ]
      },
      {
        "schemaVersion": "0.1.0",
        "id": "faq_timestamp-converter-q01",
        "status": "published",
        "placements": [
          {
            "resourceId": "res_tool_timestamp-converter",
            "order": 1
          }
        ],
        "locales": [
          {
            "locale": "en",
            "question": "How are seconds and milliseconds distinguished?",
            "answer": "You select the unit explicitly, so historic and far-future values are not guessed by digit count."
          },
          {
            "locale": "zh-CN",
            "question": "如何区分秒和毫秒？",
            "answer": "由用户明确选择单位，不根据位数猜测历史或远期时间。"
          },
          {
            "locale": "zh-TW",
            "question": "如何區分秒和毫秒？",
            "answer": "由使用者明確選擇單位，不依位數猜測歷史或遠期時間。"
          }
        ]
      },
      {
        "schemaVersion": "0.1.0",
        "id": "faq_timestamp-converter-q02",
        "status": "published",
        "placements": [
          {
            "resourceId": "res_tool_timestamp-converter",
            "order": 2
          }
        ],
        "locales": [
          {
            "locale": "en",
            "question": "Why does the ISO result end in Z?",
            "answer": "Z denotes UTC. The tool converts the instant to a UTC ISO string for display."
          },
          {
            "locale": "zh-CN",
            "question": "ISO 结果为什么以 Z 结尾？",
            "answer": "Z 表示 UTC，工具会把时刻转换为 UTC 文本。"
          },
          {
            "locale": "zh-TW",
            "question": "ISO 結果為何以 Z 結尾？",
            "answer": "Z 表示 UTC，工具會把該時刻轉成 UTC 文字。"
          }
        ]
      },
      {
        "schemaVersion": "0.1.0",
        "id": "faq_timestamp-converter-q03",
        "status": "published",
        "placements": [
          {
            "resourceId": "res_tool_timestamp-converter",
            "order": 3
          }
        ],
        "locales": [
          {
            "locale": "en",
            "question": "Which timezone is used for date-time input?",
            "answer": "The browser interprets datetime-local values in its current local timezone."
          },
          {
            "locale": "zh-CN",
            "question": "日期时间输入使用哪个时区？",
            "answer": "使用浏览器当前本地时区。"
          },
          {
            "locale": "zh-TW",
            "question": "日期時間輸入使用哪個時區？",
            "answer": "使用瀏覽器目前的本機時區。"
          }
        ]
      },
      {
        "schemaVersion": "0.1.0",
        "id": "faq_url-encoder-decoder-q01",
        "status": "published",
        "placements": [
          {
            "resourceId": "res_tool_url-encoder-decoder",
            "order": 1
          }
        ],
        "locales": [
          {
            "locale": "en",
            "question": "Why was the slash encoded?",
            "answer": "encodeURIComponent treats the input as one component, so a slash is data rather than a path separator."
          },
          {
            "locale": "zh-CN",
            "question": "为什么斜杠也被编码？",
            "answer": "因为 encodeURIComponent 把整段输入视为一个组件，斜杠不是路径分隔符。"
          },
          {
            "locale": "zh-TW",
            "question": "為什麼斜線也被編碼？",
            "answer": "因為 encodeURIComponent 把整段輸入視為一個元件，斜線不是路徑分隔符。"
          }
        ]
      },
      {
        "schemaVersion": "0.1.0",
        "id": "faq_url-encoder-decoder-q02",
        "status": "published",
        "placements": [
          {
            "resourceId": "res_tool_url-encoder-decoder",
            "order": 2
          }
        ],
        "locales": [
          {
            "locale": "en",
            "question": "Does decoding validate the whole URL?",
            "answer": "No. It only decodes percent escapes in the supplied text."
          },
          {
            "locale": "zh-CN",
            "question": "解码会校验完整网址吗？",
            "answer": "不会，只处理输入文本中的百分号转义。"
          },
          {
            "locale": "zh-TW",
            "question": "解碼會驗證完整網址嗎？",
            "answer": "不會，只處理輸入文字中的百分比跳脫。"
          }
        ]
      },
      {
        "schemaVersion": "0.1.0",
        "id": "faq_uuid-generator-q01",
        "status": "published",
        "placements": [
          {
            "resourceId": "res_tool_uuid-generator",
            "order": 1
          }
        ],
        "locales": [
          {
            "locale": "en",
            "question": "Which UUID version is generated?",
            "answer": "The tool generates UUID version 4 values."
          },
          {
            "locale": "zh-CN",
            "question": "生成哪个版本？",
            "answer": "只生成 UUID 版本 4。"
          },
          {
            "locale": "zh-TW",
            "question": "會產生哪個版本？",
            "answer": "只產生 UUID 版本 4。"
          }
        ]
      },
      {
        "schemaVersion": "0.1.0",
        "id": "faq_uuid-generator-q02",
        "status": "published",
        "placements": [
          {
            "resourceId": "res_tool_uuid-generator",
            "order": 2
          }
        ],
        "locales": [
          {
            "locale": "en",
            "question": "Can I derive a timestamp from it?",
            "answer": "No. Version 4 UUIDs are random and do not encode creation time."
          },
          {
            "locale": "zh-CN",
            "question": "能从中读取生成时间吗？",
            "answer": "不能，版本 4 是随机标识符，不编码时间。"
          },
          {
            "locale": "zh-TW",
            "question": "能從中讀取產生時間嗎？",
            "answer": "不能，版本 4 是隨機識別碼，不含時間。"
          }
        ]
      },
      {
        "schemaVersion": "0.1.0",
        "id": "faq_volume-converter-q01",
        "status": "published",
        "placements": [
          {
            "resourceId": "res_tool_volume-converter",
            "order": 1
          }
        ],
        "locales": [
          {
            "locale": "en",
            "question": "Which gallon does the tool use?",
            "answer": "It uses the US liquid gallon. An imperial gallon has a different volume and is not offered."
          },
          {
            "locale": "zh-CN",
            "question": "这里使用哪一种加仑？",
            "answer": "使用美制液体加仑，未提供容量不同的英制加仑。"
          },
          {
            "locale": "zh-TW",
            "question": "這裡使用哪一種加侖？",
            "answer": "使用美制液體加侖，未提供容量不同的英制加侖。"
          }
        ]
      },
      {
        "schemaVersion": "0.1.0",
        "id": "faq_volume-converter-q02",
        "status": "published",
        "placements": [
          {
            "resourceId": "res_tool_volume-converter",
            "order": 2
          }
        ],
        "locales": [
          {
            "locale": "en",
            "question": "Can litres be converted directly to kilograms?",
            "answer": "Not without the substance density, which this volume-only tool does not request."
          },
          {
            "locale": "zh-CN",
            "question": "可以把升直接换成千克吗？",
            "answer": "不可以，必须知道物质密度，而本工具不要求该数据。"
          },
          {
            "locale": "zh-TW",
            "question": "公升能直接換成公斤嗎？",
            "answer": "不能，必須先知道物質密度，而本工具不要求此資料。"
          }
        ]
      },
      {
        "schemaVersion": "0.1.0",
        "id": "faq_weight-converter-q01",
        "status": "published",
        "placements": [
          {
            "resourceId": "res_tool_weight-converter",
            "order": 1
          }
        ],
        "locales": [
          {
            "locale": "en",
            "question": "Does ton mean metric ton?",
            "answer": "Yes. The t option is a metric ton of 1,000 kilograms, not a US short ton or UK long ton."
          },
          {
            "locale": "zh-CN",
            "question": "“吨”指哪一种吨？",
            "answer": "指 1,000 千克的公吨，不是美制短吨或英制长吨。"
          },
          {
            "locale": "zh-TW",
            "question": "「噸」是指哪一種噸？",
            "answer": "是 1,000 公斤的公噸，不是美制短噸或英制長噸。"
          }
        ]
      },
      {
        "schemaVersion": "0.1.0",
        "id": "faq_weight-converter-q02",
        "status": "published",
        "placements": [
          {
            "resourceId": "res_tool_weight-converter",
            "order": 2
          }
        ],
        "locales": [
          {
            "locale": "en",
            "question": "Are pounds and ounces avoirdupois units?",
            "answer": "Yes. The implemented factors use the common international avoirdupois pound and ounce."
          },
          {
            "locale": "zh-CN",
            "question": "磅和盎司采用常衡制吗？",
            "answer": "是，当前因子采用常见的国际常衡磅和盎司。"
          },
          {
            "locale": "zh-TW",
            "question": "磅與盎司採用常衡制嗎？",
            "answer": "是，現有因子採常見的國際常衡磅與盎司。"
          }
        ]
      },
      {
        "schemaVersion": "0.1.0",
        "id": "faq_word-counter-q01",
        "status": "published",
        "placements": [
          {
            "resourceId": "res_tool_word-counter",
            "order": 1
          }
        ],
        "locales": [
          {
            "locale": "en",
            "question": "Are spaces counted as characters?",
            "answer": "Yes. Character counting includes whitespace grapheme clusters."
          },
          {
            "locale": "zh-CN",
            "question": "空格算字符吗？",
            "answer": "算，字符统计包含空白字素。"
          },
          {
            "locale": "zh-TW",
            "question": "空格算字元嗎？",
            "answer": "算，字元統計包含空白字素。"
          }
        ]
      },
      {
        "schemaVersion": "0.1.0",
        "id": "faq_word-counter-q02",
        "status": "published",
        "placements": [
          {
            "resourceId": "res_tool_word-counter",
            "order": 2
          }
        ],
        "locales": [
          {
            "locale": "en",
            "question": "How are Chinese words counted?",
            "answer": "Only whitespace boundaries are used, so an unspaced Chinese sentence is one word group."
          },
          {
            "locale": "zh-CN",
            "question": "中文词数如何计算？",
            "answer": "只按空白边界，连续无空格中文算一个词组。"
          },
          {
            "locale": "zh-TW",
            "question": "中文詞數如何計算？",
            "answer": "只按空白邊界，連續無空格中文算一個詞組。"
          }
        ]
      },
      {
        "schemaVersion": "0.1.0",
        "id": "faq_word-counter-q03",
        "status": "published",
        "placements": [
          {
            "resourceId": "res_tool_word-counter",
            "order": 3
          }
        ],
        "locales": [
          {
            "locale": "en",
            "question": "Does a trailing newline add a line?",
            "answer": "Splitting by line breaks can produce an additional empty final line when the input ends with a newline."
          },
          {
            "locale": "zh-CN",
            "question": "末尾换行会增加行数吗？",
            "answer": "输入以换行结束时，分隔规则可能产生一个末尾空行。"
          },
          {
            "locale": "zh-TW",
            "question": "末尾換行會增加行數嗎？",
            "answer": "輸入以換行結束時，分隔規則可能產生一個末尾空行。"
          }
        ]
      }
    ],
    "health": [
      {
        "schemaVersion": "0.1.0",
        "id": "health_area-converter-catalog-binding",
        "resourceId": "res_tool_area-converter",
        "checkType": "tool-binding",
        "status": "healthy",
        "checkedAt": "2026-08-11T00:00:00.000Z",
        "evidence": "Catalog resource resolves to a published code-owned tool binding."
      },
      {
        "schemaVersion": "0.1.0",
        "id": "health_base64-encoder-decoder-catalog-binding",
        "resourceId": "res_tool_base64-encoder-decoder",
        "checkType": "tool-binding",
        "status": "healthy",
        "checkedAt": "2026-08-11T00:00:00.000Z",
        "evidence": "Catalog resource resolves to a published code-owned tool binding."
      },
      {
        "schemaVersion": "0.1.0",
        "id": "health_bmi-calculator-catalog-binding",
        "resourceId": "res_tool_bmi-calculator",
        "checkType": "tool-binding",
        "status": "healthy",
        "checkedAt": "2026-08-11T00:00:00.000Z",
        "evidence": "Catalog resource resolves to a published code-owned tool binding."
      },
      {
        "schemaVersion": "0.1.0",
        "id": "health_cheque-amount-converter-catalog-binding",
        "resourceId": "res_tool_cheque-amount-converter",
        "checkType": "tool-binding",
        "status": "healthy",
        "checkedAt": "2026-08-11T00:00:00.000Z",
        "evidence": "Catalog resource resolves to a published code-owned tool binding."
      },
      {
        "schemaVersion": "0.1.0",
        "id": "health_color-converter-catalog-binding",
        "resourceId": "res_tool_color-converter",
        "checkType": "tool-binding",
        "status": "healthy",
        "checkedAt": "2026-08-11T00:00:00.000Z",
        "evidence": "Catalog resource resolves to a published code-owned tool binding."
      },
      {
        "schemaVersion": "0.1.0",
        "id": "health_compound-interest-calculator-catalog-binding",
        "resourceId": "res_tool_compound-interest-calculator",
        "checkType": "tool-binding",
        "status": "healthy",
        "checkedAt": "2026-08-11T00:00:00.000Z",
        "evidence": "Catalog resource resolves to a published code-owned tool binding."
      },
      {
        "schemaVersion": "0.1.0",
        "id": "health_data-storage-converter-catalog-binding",
        "resourceId": "res_tool_data-storage-converter",
        "checkType": "tool-binding",
        "status": "healthy",
        "checkedAt": "2026-08-11T00:00:00.000Z",
        "evidence": "Catalog resource resolves to a published code-owned tool binding."
      },
      {
        "schemaVersion": "0.1.0",
        "id": "health_date-interval-calculator-catalog-binding",
        "resourceId": "res_tool_date-interval-calculator",
        "checkType": "tool-binding",
        "status": "healthy",
        "checkedAt": "2026-08-11T00:00:00.000Z",
        "evidence": "Catalog resource resolves to a published code-owned tool binding."
      },
      {
        "schemaVersion": "0.1.0",
        "id": "health_discount-calculator-catalog-binding",
        "resourceId": "res_tool_discount-calculator",
        "checkType": "tool-binding",
        "status": "healthy",
        "checkedAt": "2026-08-11T00:00:00.000Z",
        "evidence": "Catalog resource resolves to a published code-owned tool binding."
      },
      {
        "schemaVersion": "0.1.0",
        "id": "health_ip-lookup-hidden",
        "resourceId": "res_tool_ip-lookup",
        "checkType": "tool-binding",
        "status": "healthy",
        "checkedAt": "2026-08-11T00:00:00.000Z",
        "evidence": "Hidden capability is validated but excluded from public routes and search."
      },
      {
        "schemaVersion": "0.1.0",
        "id": "health_ip-whois-rdap-hidden",
        "resourceId": "res_tool_ip-whois-rdap",
        "checkType": "tool-binding",
        "status": "healthy",
        "checkedAt": "2026-08-11T00:00:00.000Z",
        "evidence": "Hidden capability is validated but excluded from public routes and search."
      },
      {
        "schemaVersion": "0.1.0",
        "id": "health_ipv4-network-toolbox-catalog-binding",
        "resourceId": "res_tool_ipv4-network-toolbox",
        "checkType": "tool-binding",
        "status": "healthy",
        "checkedAt": "2026-08-11T00:00:00.000Z",
        "evidence": "Catalog resource resolves to a published code-owned tool binding."
      },
      {
        "schemaVersion": "0.1.0",
        "id": "health_ipv6-toolbox-catalog-binding",
        "resourceId": "res_tool_ipv6-toolbox",
        "checkType": "tool-binding",
        "status": "healthy",
        "checkedAt": "2026-08-11T00:00:00.000Z",
        "evidence": "Catalog resource resolves to a published code-owned tool binding."
      },
      {
        "schemaVersion": "0.1.0",
        "id": "health_irr-calculator-catalog-binding",
        "resourceId": "res_tool_irr-calculator",
        "checkType": "tool-binding",
        "status": "healthy",
        "checkedAt": "2026-08-11T00:00:00.000Z",
        "evidence": "Catalog resource resolves to a published code-owned tool binding."
      },
      {
        "schemaVersion": "0.1.0",
        "id": "health_json-tools-catalog-binding",
        "resourceId": "res_tool_json-tools",
        "checkType": "tool-binding",
        "status": "healthy",
        "checkedAt": "2026-08-11T00:00:00.000Z",
        "evidence": "Catalog resource resolves to a published code-owned tool binding."
      },
      {
        "schemaVersion": "0.1.0",
        "id": "health_length-converter-catalog-binding",
        "resourceId": "res_tool_length-converter",
        "checkType": "tool-binding",
        "status": "healthy",
        "checkedAt": "2026-08-11T00:00:00.000Z",
        "evidence": "Catalog resource resolves to a published code-owned tool binding."
      },
      {
        "schemaVersion": "0.1.0",
        "id": "health_password-generator-catalog-binding",
        "resourceId": "res_tool_password-generator",
        "checkType": "tool-binding",
        "status": "healthy",
        "checkedAt": "2026-08-11T00:00:00.000Z",
        "evidence": "Catalog resource resolves to a published code-owned tool binding."
      },
      {
        "schemaVersion": "0.1.0",
        "id": "health_percentage-calculator-catalog-binding",
        "resourceId": "res_tool_percentage-calculator",
        "checkType": "tool-binding",
        "status": "healthy",
        "checkedAt": "2026-08-11T00:00:00.000Z",
        "evidence": "Catalog resource resolves to a published code-owned tool binding."
      },
      {
        "schemaVersion": "0.1.0",
        "id": "health_qr-code-generator-catalog-binding",
        "resourceId": "res_tool_qr-code-generator",
        "checkType": "tool-binding",
        "status": "healthy",
        "checkedAt": "2026-08-11T00:00:00.000Z",
        "evidence": "Catalog resource resolves to a published code-owned tool binding."
      },
      {
        "schemaVersion": "0.1.0",
        "id": "health_speed-converter-catalog-binding",
        "resourceId": "res_tool_speed-converter",
        "checkType": "tool-binding",
        "status": "healthy",
        "checkedAt": "2026-08-11T00:00:00.000Z",
        "evidence": "Catalog resource resolves to a published code-owned tool binding."
      },
      {
        "schemaVersion": "0.1.0",
        "id": "health_temperature-converter-catalog-binding",
        "resourceId": "res_tool_temperature-converter",
        "checkType": "tool-binding",
        "status": "healthy",
        "checkedAt": "2026-08-11T00:00:00.000Z",
        "evidence": "Catalog resource resolves to a published code-owned tool binding."
      },
      {
        "schemaVersion": "0.1.0",
        "id": "health_text-case-converter-catalog-binding",
        "resourceId": "res_tool_text-case-converter",
        "checkType": "tool-binding",
        "status": "healthy",
        "checkedAt": "2026-08-11T00:00:00.000Z",
        "evidence": "Catalog resource resolves to a published code-owned tool binding."
      },
      {
        "schemaVersion": "0.1.0",
        "id": "health_time-converter-catalog-binding",
        "resourceId": "res_tool_time-converter",
        "checkType": "tool-binding",
        "status": "healthy",
        "checkedAt": "2026-08-11T00:00:00.000Z",
        "evidence": "Catalog resource resolves to a published code-owned tool binding."
      },
      {
        "schemaVersion": "0.1.0",
        "id": "health_timestamp-converter-catalog-binding",
        "resourceId": "res_tool_timestamp-converter",
        "checkType": "tool-binding",
        "status": "healthy",
        "checkedAt": "2026-08-11T00:00:00.000Z",
        "evidence": "Catalog resource resolves to a published code-owned tool binding."
      },
      {
        "schemaVersion": "0.1.0",
        "id": "health_url-encoder-decoder-catalog-binding",
        "resourceId": "res_tool_url-encoder-decoder",
        "checkType": "tool-binding",
        "status": "healthy",
        "checkedAt": "2026-08-11T00:00:00.000Z",
        "evidence": "Catalog resource resolves to a published code-owned tool binding."
      },
      {
        "schemaVersion": "0.1.0",
        "id": "health_uuid-generator-catalog-binding",
        "resourceId": "res_tool_uuid-generator",
        "checkType": "tool-binding",
        "status": "healthy",
        "checkedAt": "2026-08-11T00:00:00.000Z",
        "evidence": "Catalog resource resolves to a published code-owned tool binding."
      },
      {
        "schemaVersion": "0.1.0",
        "id": "health_volume-converter-catalog-binding",
        "resourceId": "res_tool_volume-converter",
        "checkType": "tool-binding",
        "status": "healthy",
        "checkedAt": "2026-08-11T00:00:00.000Z",
        "evidence": "Catalog resource resolves to a published code-owned tool binding."
      },
      {
        "schemaVersion": "0.1.0",
        "id": "health_weight-converter-catalog-binding",
        "resourceId": "res_tool_weight-converter",
        "checkType": "tool-binding",
        "status": "healthy",
        "checkedAt": "2026-08-11T00:00:00.000Z",
        "evidence": "Catalog resource resolves to a published code-owned tool binding."
      },
      {
        "schemaVersion": "0.1.0",
        "id": "health_word-counter-catalog-binding",
        "resourceId": "res_tool_word-counter",
        "checkType": "tool-binding",
        "status": "healthy",
        "checkedAt": "2026-08-11T00:00:00.000Z",
        "evidence": "Catalog resource resolves to a published code-owned tool binding."
      }
    ],
    "locales": [
      {
        "resourceId": "res_ai-skill-browser-console-error-triage",
        "locale": "en",
        "name": "Browser console error triage",
        "summary": "Use AI to turn a console error, page path, and reproduction steps into a focused debugging checklist.",
        "seoTitle": "Browser console error triage AI skill | GoDeskHub",
        "seoDescription": "A practical AI workflow for grouping browser console errors by evidence and choosing targeted checks.",
        "searchAliases": [
          "browser error triage",
          "console debugging",
          "frontend bug checklist"
        ],
        "searchKeywords": [
          "AI skill",
          "debugging",
          "frontend"
        ]
      },
      {
        "resourceId": "res_ai-skill-browser-console-error-triage",
        "locale": "zh-CN",
        "name": "浏览器控制台错误分诊",
        "summary": "用 AI 将控制台错误、页面路径和复现步骤整理成聚焦的调试清单。",
        "seoTitle": "浏览器控制台错误分诊 AI 技能 | GoDeskHub",
        "seoDescription": "一个按证据归类浏览器控制台错误，并选择目标检查项的实用 AI 工作流。",
        "searchAliases": [
          "浏览器错误分诊",
          "控制台调试",
          "前端缺陷清单"
        ],
        "searchKeywords": [
          "AI 技能",
          "调试",
          "前端"
        ]
      },
      {
        "resourceId": "res_ai-skill-browser-console-error-triage",
        "locale": "zh-TW",
        "name": "瀏覽器控制台錯誤分診",
        "summary": "用 AI 將控制台錯誤、頁面路徑和重現步驟整理成聚焦的除錯清單。",
        "seoTitle": "瀏覽器控制台錯誤分診 AI 技能 | GoDeskHub",
        "seoDescription": "一個按證據歸類瀏覽器控制台錯誤，並選擇目標檢查項的實用 AI 工作流程。",
        "searchAliases": [
          "瀏覽器錯誤分診",
          "控制台除錯",
          "前端缺陷清單"
        ],
        "searchKeywords": [
          "AI 技能",
          "除錯",
          "前端"
        ]
      },
      {
        "resourceId": "res_ai-skill-code-review-checklist",
        "locale": "en",
        "name": "Code review checklist",
        "summary": "Use AI to structure a code review around correctness, privacy, accessibility, and tests.",
        "seoTitle": "Code review checklist AI skill | GoDeskHub",
        "seoDescription": "A practical AI workflow for turning diffs and acceptance criteria into prioritized code review checks.",
        "searchAliases": [
          "AI code review",
          "review checklist",
          "pull request review"
        ],
        "searchKeywords": [
          "AI skill",
          "code review",
          "privacy",
          "accessibility",
          "tests"
        ]
      },
      {
        "resourceId": "res_ai-skill-code-review-checklist",
        "locale": "zh-CN",
        "name": "代码评审清单",
        "summary": "用 AI 围绕正确性、隐私、无障碍和测试覆盖整理代码评审重点。",
        "seoTitle": "代码评审清单 AI 技能 | GoDeskHub",
        "seoDescription": "面向代码差异和验收标准的 AI 工作流，帮助生成有优先级的评审检查项。",
        "searchAliases": [
          "AI 代码评审",
          "评审清单",
          "PR 评审"
        ],
        "searchKeywords": [
          "AI 技能",
          "代码评审",
          "隐私",
          "无障碍",
          "测试"
        ]
      },
      {
        "resourceId": "res_ai-skill-code-review-checklist",
        "locale": "zh-TW",
        "name": "程式碼評審清單",
        "summary": "用 AI 圍繞正確性、隱私、無障礙和測試覆蓋整理程式碼評審重點。",
        "seoTitle": "程式碼評審清單 AI 技能 | GoDeskHub",
        "seoDescription": "面向程式碼差異和驗收標準的 AI 工作流程，協助產生有優先級的評審檢查項。",
        "searchAliases": [
          "AI 程式碼評審",
          "評審清單",
          "PR 評審"
        ],
        "searchKeywords": [
          "AI 技能",
          "程式碼評審",
          "隱私",
          "無障礙",
          "測試"
        ]
      },
      {
        "resourceId": "res_ai-skill-localization-copy-checker",
        "locale": "en",
        "name": "Localization copy checker",
        "summary": "Use AI to compare English, Simplified Chinese, and Traditional Chinese product copy for meaning and completeness.",
        "seoTitle": "Localization copy checker AI skill | GoDeskHub",
        "seoDescription": "A reusable AI workflow for checking multilingual product copy consistency before release.",
        "searchAliases": [
          "localization checker",
          "translation QA",
          "multilingual copy review"
        ],
        "searchKeywords": [
          "AI skill",
          "localization",
          "copy review"
        ]
      },
      {
        "resourceId": "res_ai-skill-localization-copy-checker",
        "locale": "zh-CN",
        "name": "本地化文案检查",
        "summary": "用 AI 对比英文、简体中文和繁体中文产品文案的含义一致性与完整性。",
        "seoTitle": "本地化文案检查 AI 技能 | GoDeskHub",
        "seoDescription": "一个发布前检查多语言产品文案一致性的可复用 AI 工作流。",
        "searchAliases": [
          "本地化检查",
          "翻译 QA",
          "多语言文案审查"
        ],
        "searchKeywords": [
          "AI 技能",
          "本地化",
          "文案审查"
        ]
      },
      {
        "resourceId": "res_ai-skill-localization-copy-checker",
        "locale": "zh-TW",
        "name": "本地化文案檢查",
        "summary": "用 AI 對比英文、簡體中文和繁體中文產品文案的含義一致性與完整性。",
        "seoTitle": "本地化文案檢查 AI 技能 | GoDeskHub",
        "seoDescription": "一個發布前檢查多語言產品文案一致性的可重用 AI 工作流程。",
        "searchAliases": [
          "本地化檢查",
          "翻譯 QA",
          "多語言文案審查"
        ],
        "searchKeywords": [
          "AI 技能",
          "本地化",
          "文案審查"
        ]
      },
      {
        "resourceId": "res_ai-skill-privacy-safe-summarizer",
        "locale": "en",
        "name": "Privacy-safe summarizer",
        "summary": "Summarize notes or feedback while keeping private details out of public output.",
        "seoTitle": "Privacy-safe summarizer AI skill | GoDeskHub",
        "seoDescription": "A cautious AI workflow for producing public-safe summaries from redacted notes and evidence.",
        "searchAliases": [
          "safe summary",
          "redacted summary",
          "privacy summary"
        ],
        "searchKeywords": [
          "AI skill",
          "summary",
          "privacy",
          "redaction",
          "notes"
        ]
      },
      {
        "resourceId": "res_ai-skill-privacy-safe-summarizer",
        "locale": "zh-CN",
        "name": "隐私安全摘要",
        "summary": "在保留关键信息的同时，避免把私密细节写入可公开分享的摘要。",
        "seoTitle": "隐私安全摘要 AI 技能 | GoDeskHub",
        "seoDescription": "谨慎使用 AI，从已脱敏的笔记和证据中生成适合公开分享的摘要。",
        "searchAliases": [
          "安全摘要",
          "脱敏摘要",
          "隐私摘要"
        ],
        "searchKeywords": [
          "AI 技能",
          "摘要",
          "隐私",
          "脱敏",
          "笔记"
        ]
      },
      {
        "resourceId": "res_ai-skill-privacy-safe-summarizer",
        "locale": "zh-TW",
        "name": "隱私安全摘要",
        "summary": "在保留關鍵資訊的同時，避免把私密細節寫入可公開分享的摘要。",
        "seoTitle": "隱私安全摘要 AI 技能 | GoDeskHub",
        "seoDescription": "謹慎使用 AI，從已去識別化的筆記和證據中產生適合公開分享的摘要。",
        "searchAliases": [
          "安全摘要",
          "去識別化摘要",
          "隱私摘要"
        ],
        "searchKeywords": [
          "AI 技能",
          "摘要",
          "隱私",
          "去識別化",
          "筆記"
        ]
      },
      {
        "resourceId": "res_ai-skill-prompt-brief-refiner",
        "locale": "en",
        "name": "Prompt brief refiner",
        "summary": "Turn a rough request into a structured, reviewable brief before implementation begins.",
        "seoTitle": "Prompt brief refiner AI skill | GoDeskHub",
        "seoDescription": "Use a privacy-aware AI workflow to refine rough requests into scoped briefs, acceptance criteria, assumptions, and risks.",
        "searchAliases": [
          "prompt brief",
          "requirements prompt",
          "scope refiner"
        ],
        "searchKeywords": [
          "AI skill",
          "prompt",
          "requirements",
          "acceptance criteria",
          "scope"
        ]
      },
      {
        "resourceId": "res_ai-skill-prompt-brief-refiner",
        "locale": "zh-CN",
        "name": "提示词需求整理",
        "summary": "把粗略需求整理成结构清晰、可评审、可执行的任务说明。",
        "seoTitle": "提示词需求整理 AI 技能 | GoDeskHub",
        "seoDescription": "使用隐私友好的 AI 工作流，将粗略想法整理为范围、非范围、验收标准、假设和风险。",
        "searchAliases": [
          "提示词需求",
          "需求整理",
          "任务说明"
        ],
        "searchKeywords": [
          "AI 技能",
          "提示词",
          "需求",
          "验收标准",
          "范围"
        ]
      },
      {
        "resourceId": "res_ai-skill-prompt-brief-refiner",
        "locale": "zh-TW",
        "name": "提示詞需求整理",
        "summary": "把粗略需求整理成結構清晰、可評審、可執行的任務說明。",
        "seoTitle": "提示詞需求整理 AI 技能 | GoDeskHub",
        "seoDescription": "使用隱私友善的 AI 工作流程，將粗略想法整理為範圍、非範圍、驗收標準、假設和風險。",
        "searchAliases": [
          "提示詞需求",
          "需求整理",
          "任務說明"
        ],
        "searchKeywords": [
          "AI 技能",
          "提示詞",
          "需求",
          "驗收標準",
          "範圍"
        ]
      },
      {
        "resourceId": "res_guide_ip-subnet-basics",
        "locale": "en",
        "name": "IP subnet basics",
        "summary": "A compact guide to CIDR prefixes, network addresses, broadcast addresses, and usable host ranges.",
        "seoTitle": "IP subnet basics guide | GoDeskHub",
        "seoDescription": "Learn the practical meaning of CIDR prefixes, subnet masks, network addresses, and usable ranges.",
        "searchAliases": [
          "CIDR guide",
          "subnet basics",
          "network address guide"
        ],
        "searchKeywords": [
          "IPv4",
          "subnet",
          "network"
        ]
      },
      {
        "resourceId": "res_guide_ip-subnet-basics",
        "locale": "zh-CN",
        "name": "IP 子网基础",
        "summary": "用简洁方式说明 CIDR 掩码位、网络地址、广播地址和可用主机范围。",
        "seoTitle": "IP 子网基础指南 | GoDeskHub",
        "seoDescription": "了解 CIDR 掩码位、子网掩码、网络地址和可用范围的实际含义。",
        "searchAliases": [
          "CIDR 指南",
          "子网基础",
          "网络地址指南"
        ],
        "searchKeywords": [
          "IPv4",
          "子网",
          "网络"
        ]
      },
      {
        "resourceId": "res_guide_ip-subnet-basics",
        "locale": "zh-TW",
        "name": "IP 子網基礎",
        "summary": "用簡潔方式說明 CIDR 遮罩位、網絡地址、廣播地址和可用主機範圍。",
        "seoTitle": "IP 子網基礎指南 | GoDeskHub",
        "seoDescription": "了解 CIDR 遮罩位、子網遮罩、網絡地址和可用範圍的實際含義。",
        "searchAliases": [
          "CIDR 指南",
          "子網基礎",
          "網絡地址指南"
        ],
        "searchKeywords": [
          "IPv4",
          "子網",
          "網絡"
        ]
      },
      {
        "resourceId": "res_guide_local-data-tool-safety",
        "locale": "en",
        "name": "Local data tool safety",
        "summary": "A checklist for using browser-based tools without putting sensitive text, files, or results into public places.",
        "seoTitle": "Local data tool safety guide | GoDeskHub",
        "seoDescription": "Review practical safety checks before using browser-based tools with sensitive text, files, or results.",
        "searchAliases": [
          "local tool safety",
          "browser tool privacy",
          "safe online tools"
        ],
        "searchKeywords": [
          "privacy",
          "local processing",
          "browser"
        ]
      },
      {
        "resourceId": "res_guide_local-data-tool-safety",
        "locale": "zh-CN",
        "name": "本地数据工具安全",
        "summary": "一份浏览器工具使用清单，帮助避免把敏感文本、文件或结果放到公开位置。",
        "seoTitle": "本地数据工具安全指南 | GoDeskHub",
        "seoDescription": "在使用浏览器工具处理敏感文本、文件或结果前，先核对实用安全检查项。",
        "searchAliases": [
          "本地工具安全",
          "浏览器工具隐私",
          "安全在线工具"
        ],
        "searchKeywords": [
          "隐私",
          "本地处理",
          "浏览器"
        ]
      },
      {
        "resourceId": "res_guide_local-data-tool-safety",
        "locale": "zh-TW",
        "name": "本機資料工具安全",
        "summary": "一份瀏覽器工具使用清單，協助避免把敏感文字、文件或結果放到公開位置。",
        "seoTitle": "本機資料工具安全指南 | GoDeskHub",
        "seoDescription": "在使用瀏覽器工具處理敏感文字、文件或結果前，先核對實用安全檢查項。",
        "searchAliases": [
          "本機工具安全",
          "瀏覽器工具隱私",
          "安全線上工具"
        ],
        "searchKeywords": [
          "隱私",
          "本機處理",
          "瀏覽器"
        ]
      },
      {
        "resourceId": "res_tool_area-converter",
        "locale": "en",
        "name": "Area converter",
        "summary": "Convert square meters, acres, and square feet.",
        "seoTitle": "Area converter | GoDeskHub",
        "seoDescription": "Convert square meters, acres, and square feet.",
        "searchAliases": [
          "land area converter",
          "sqm to sqft",
          "acre to hectare",
          "square meter converter"
        ],
        "searchKeywords": [
          "area",
          "square metre",
          "square foot",
          "acre",
          "hectare"
        ]
      },
      {
        "resourceId": "res_tool_area-converter",
        "locale": "zh-CN",
        "name": "面积转换",
        "summary": "平方米、公顷、英亩等面积换算。",
        "seoTitle": "面积转换 | GoDeskHub",
        "seoDescription": "平方米、公顷、英亩等面积换算。",
        "searchAliases": [
          "土地面积转换",
          "平方米转平方英尺",
          "英亩转公顷",
          "平方单位转换"
        ],
        "searchKeywords": [
          "面积",
          "平方米",
          "平方英尺",
          "英亩",
          "公顷"
        ]
      },
      {
        "resourceId": "res_tool_area-converter",
        "locale": "zh-TW",
        "name": "面積轉換",
        "summary": "平方公尺、公頃、英畝等面積換算。",
        "seoTitle": "面積轉換 | GoDeskHub",
        "seoDescription": "平方公尺、公頃、英畝等面積換算。",
        "searchAliases": [
          "土地面積轉換",
          "平方公尺轉平方英尺",
          "英畝轉公頃",
          "平方單位轉換"
        ],
        "searchKeywords": [
          "面積",
          "平方公尺",
          "平方英尺",
          "英畝",
          "公頃"
        ]
      },
      {
        "resourceId": "res_tool_base64-encoder-decoder",
        "locale": "en",
        "name": "Base64 encoder and decoder",
        "summary": "Encode and decode Unicode text with Base64.",
        "seoTitle": "Base64 encoder and decoder | GoDeskHub",
        "seoDescription": "Encode and decode Unicode text with Base64.",
        "searchAliases": [
          "base64 encode",
          "base64 decode",
          "b64",
          "unicode base64"
        ],
        "searchKeywords": [
          "Base64",
          "encode",
          "decode",
          "UTF-8",
          "text",
          "not encryption"
        ]
      },
      {
        "resourceId": "res_tool_base64-encoder-decoder",
        "locale": "zh-CN",
        "name": "Base64 编解码",
        "summary": "支持 Unicode 文本编码和解码。",
        "seoTitle": "Base64 编解码 | GoDeskHub",
        "seoDescription": "支持 Unicode 文本编码和解码。",
        "searchAliases": [
          "Base64 编码",
          "Base64 解码",
          "b64",
          "Unicode Base64"
        ],
        "searchKeywords": [
          "Base64",
          "编码",
          "解码",
          "UTF-8",
          "文本",
          "非加密"
        ]
      },
      {
        "resourceId": "res_tool_base64-encoder-decoder",
        "locale": "zh-TW",
        "name": "Base64 編解碼",
        "summary": "支援 Unicode 文字編碼和解碼。",
        "seoTitle": "Base64 編解碼 | GoDeskHub",
        "seoDescription": "支援 Unicode 文字編碼和解碼。",
        "searchAliases": [
          "Base64 編碼",
          "Base64 解碼",
          "b64",
          "Unicode Base64"
        ],
        "searchKeywords": [
          "Base64",
          "編碼",
          "解碼",
          "UTF-8",
          "文字",
          "非加密"
        ]
      },
      {
        "resourceId": "res_tool_bmi-calculator",
        "locale": "en",
        "name": "BMI calculator",
        "summary": "Calculate a body mass index reference.",
        "seoTitle": "BMI calculator | GoDeskHub",
        "seoDescription": "Calculate a body mass index reference.",
        "searchAliases": [
          "body mass index",
          "BMI checker",
          "kg cm BMI",
          "health calculator"
        ],
        "searchKeywords": [
          "BMI",
          "body mass index",
          "weight",
          "height",
          "health",
          "not diagnosis"
        ]
      },
      {
        "resourceId": "res_tool_bmi-calculator",
        "locale": "zh-CN",
        "name": "BMI 计算",
        "summary": "身体质量指数参考计算。",
        "seoTitle": "BMI 计算 | GoDeskHub",
        "seoDescription": "身体质量指数参考计算。",
        "searchAliases": [
          "身体质量指数",
          "BMI 查询",
          "千克厘米 BMI",
          "健康计算"
        ],
        "searchKeywords": [
          "BMI",
          "身体质量指数",
          "体重",
          "身高",
          "健康",
          "非诊断"
        ]
      },
      {
        "resourceId": "res_tool_bmi-calculator",
        "locale": "zh-TW",
        "name": "BMI 計算",
        "summary": "身體質量指數參考計算。",
        "seoTitle": "BMI 計算 | GoDeskHub",
        "seoDescription": "身體質量指數參考計算。",
        "searchAliases": [
          "身體質量指數",
          "BMI 查詢",
          "公斤公分 BMI",
          "健康計算"
        ],
        "searchKeywords": [
          "BMI",
          "身體質量指數",
          "體重",
          "身高",
          "健康",
          "非診斷"
        ]
      },
      {
        "resourceId": "res_tool_cheque-amount-converter",
        "locale": "en",
        "name": "Cheque amount converter",
        "summary": "Write a decimal amount in English and Chinese financial words.",
        "seoTitle": "Cheque amount converter | GoDeskHub",
        "seoDescription": "Write a decimal amount in English and Chinese financial words.",
        "searchAliases": [
          "check amount",
          "number to words",
          "financial numerals",
          "cheque writing",
          "HKD cheque",
          "RMB uppercase amount"
        ],
        "searchKeywords": [
          "cheque",
          "check",
          "amount",
          "English words",
          "financial numerals",
          "Traditional Chinese",
          "Simplified Chinese",
          "currency label"
        ]
      },
      {
        "resourceId": "res_tool_cheque-amount-converter",
        "locale": "zh-CN",
        "name": "支票金额转换",
        "summary": "把十进制金额转换为英文和中文金融大写。",
        "seoTitle": "支票金额转换 | GoDeskHub",
        "seoDescription": "把十进制金额转换为英文和中文金融大写。",
        "searchAliases": [
          "支票金额",
          "数字转英文",
          "金融大写",
          "金额大写",
          "港币支票",
          "人民币大写"
        ],
        "searchKeywords": [
          "支票",
          "金额",
          "英文大写",
          "繁体中文",
          "简体中文",
          "金融大写",
          "币种标签"
        ]
      },
      {
        "resourceId": "res_tool_cheque-amount-converter",
        "locale": "zh-TW",
        "name": "支票金額轉換",
        "summary": "把十進位金額轉換為英文和中文金融大寫。",
        "seoTitle": "支票金額轉換 | GoDeskHub",
        "seoDescription": "把十進位金額轉換為英文和中文金融大寫。",
        "searchAliases": [
          "支票金額",
          "數字轉英文",
          "金融大寫",
          "金額大寫",
          "港幣支票",
          "人民幣大寫"
        ],
        "searchKeywords": [
          "支票",
          "金額",
          "英文大寫",
          "繁體中文",
          "簡體中文",
          "金融大寫",
          "幣別標籤"
        ]
      },
      {
        "resourceId": "res_tool_color-converter",
        "locale": "en",
        "name": "Color converter",
        "summary": "Convert HEX, RGB, and HSL colors.",
        "seoTitle": "Color converter | GoDeskHub",
        "seoDescription": "Convert HEX, RGB, and HSL colors.",
        "searchAliases": [
          "hex to rgb",
          "rgb to hex",
          "rgb to hsl",
          "css color converter"
        ],
        "searchKeywords": [
          "color",
          "HEX",
          "RGB",
          "HSL",
          "CSS",
          "palette"
        ]
      },
      {
        "resourceId": "res_tool_color-converter",
        "locale": "zh-CN",
        "name": "颜色转换",
        "summary": "HEX、RGB、HSL 基础转换。",
        "seoTitle": "颜色转换 | GoDeskHub",
        "seoDescription": "HEX、RGB、HSL 基础转换。",
        "searchAliases": [
          "HEX 转 RGB",
          "RGB 转 HEX",
          "RGB 转 HSL",
          "CSS 颜色转换"
        ],
        "searchKeywords": [
          "颜色",
          "HEX",
          "RGB",
          "HSL",
          "CSS",
          "调色板"
        ]
      },
      {
        "resourceId": "res_tool_color-converter",
        "locale": "zh-TW",
        "name": "顏色轉換",
        "summary": "HEX、RGB、HSL 基礎轉換。",
        "seoTitle": "顏色轉換 | GoDeskHub",
        "seoDescription": "HEX、RGB、HSL 基礎轉換。",
        "searchAliases": [
          "HEX 轉 RGB",
          "RGB 轉 HEX",
          "RGB 轉 HSL",
          "CSS 顏色轉換"
        ],
        "searchKeywords": [
          "顏色",
          "HEX",
          "RGB",
          "HSL",
          "CSS",
          "調色盤"
        ]
      },
      {
        "resourceId": "res_tool_compound-interest-calculator",
        "locale": "en",
        "name": "Compound interest calculator",
        "summary": "Calculate reference compound growth.",
        "seoTitle": "Compound interest calculator | GoDeskHub",
        "seoDescription": "Calculate reference compound growth.",
        "searchAliases": [
          "compound interest",
          "monthly compounding",
          "investment growth",
          "interest calculator"
        ],
        "searchKeywords": [
          "compound",
          "principal",
          "annual rate",
          "years",
          "monthly",
          "interest"
        ]
      },
      {
        "resourceId": "res_tool_compound-interest-calculator",
        "locale": "zh-CN",
        "name": "复利计算",
        "summary": "复利增长参考计算。",
        "seoTitle": "复利计算 | GoDeskHub",
        "seoDescription": "复利增长参考计算。",
        "searchAliases": [
          "复利计算",
          "每月复利",
          "投资增长",
          "利息计算"
        ],
        "searchKeywords": [
          "复利",
          "本金",
          "年利率",
          "年数",
          "每月",
          "利息"
        ]
      },
      {
        "resourceId": "res_tool_compound-interest-calculator",
        "locale": "zh-TW",
        "name": "複利計算",
        "summary": "複利成長參考計算。",
        "seoTitle": "複利計算 | GoDeskHub",
        "seoDescription": "複利成長參考計算。",
        "searchAliases": [
          "複利計算",
          "每月複利",
          "投資成長",
          "利息計算"
        ],
        "searchKeywords": [
          "複利",
          "本金",
          "年利率",
          "年數",
          "每月",
          "利息"
        ]
      },
      {
        "resourceId": "res_tool_data-storage-converter",
        "locale": "en",
        "name": "Data storage converter",
        "summary": "Convert bytes through petabytes.",
        "seoTitle": "Data storage converter | GoDeskHub",
        "seoDescription": "Convert bytes through petabytes.",
        "searchAliases": [
          "file size converter",
          "gb to mb",
          "gib to mib",
          "bytes converter"
        ],
        "searchKeywords": [
          "storage",
          "byte",
          "kilobyte",
          "kibibyte",
          "gigabyte",
          "gibibyte",
          "1000",
          "1024"
        ]
      },
      {
        "resourceId": "res_tool_data-storage-converter",
        "locale": "zh-CN",
        "name": "数据存储转换",
        "summary": "B、KB、MB、GB、TB 换算。",
        "seoTitle": "数据存储转换 | GoDeskHub",
        "seoDescription": "B、KB、MB、GB、TB 换算。",
        "searchAliases": [
          "文件大小转换",
          "GB 转 MB",
          "GiB 转 MiB",
          "字节转换"
        ],
        "searchKeywords": [
          "存储",
          "字节",
          "KB",
          "KiB",
          "GB",
          "GiB",
          "1000",
          "1024"
        ]
      },
      {
        "resourceId": "res_tool_data-storage-converter",
        "locale": "zh-TW",
        "name": "資料儲存轉換",
        "summary": "B、KB、MB、GB、TB 換算。",
        "seoTitle": "資料儲存轉換 | GoDeskHub",
        "seoDescription": "B、KB、MB、GB、TB 換算。",
        "searchAliases": [
          "檔案大小轉換",
          "GB 轉 MB",
          "GiB 轉 MiB",
          "位元組轉換"
        ],
        "searchKeywords": [
          "儲存",
          "位元組",
          "KB",
          "KiB",
          "GB",
          "GiB",
          "1000",
          "1024"
        ]
      },
      {
        "resourceId": "res_tool_date-interval-calculator",
        "locale": "en",
        "name": "Date interval calculator",
        "summary": "Calculate the days between two dates.",
        "seoTitle": "Date interval calculator | GoDeskHub",
        "seoDescription": "Calculate the days between two dates.",
        "searchAliases": [
          "days between dates",
          "date difference",
          "day interval",
          "elapsed days"
        ],
        "searchKeywords": [
          "date",
          "interval",
          "difference",
          "days",
          "elapsed",
          "timezone"
        ]
      },
      {
        "resourceId": "res_tool_date-interval-calculator",
        "locale": "zh-CN",
        "name": "日期间隔计算",
        "summary": "计算两个日期相隔天数。",
        "seoTitle": "日期间隔计算 | GoDeskHub",
        "seoDescription": "计算两个日期相隔天数。",
        "searchAliases": [
          "日期相差天数",
          "日期差",
          "天数间隔",
          "经过天数"
        ],
        "searchKeywords": [
          "日期",
          "间隔",
          "差值",
          "天数",
          "经过",
          "时区"
        ]
      },
      {
        "resourceId": "res_tool_date-interval-calculator",
        "locale": "zh-TW",
        "name": "日期間隔計算",
        "summary": "計算兩個日期相隔天數。",
        "seoTitle": "日期間隔計算 | GoDeskHub",
        "seoDescription": "計算兩個日期相隔天數。",
        "searchAliases": [
          "日期相差天數",
          "日期差",
          "天數間隔",
          "經過天數"
        ],
        "searchKeywords": [
          "日期",
          "間隔",
          "差值",
          "天數",
          "經過",
          "時區"
        ]
      },
      {
        "resourceId": "res_tool_discount-calculator",
        "locale": "en",
        "name": "Discount calculator",
        "summary": "Calculate final price and savings.",
        "seoTitle": "Discount calculator | GoDeskHub",
        "seoDescription": "Calculate final price and savings.",
        "searchAliases": [
          "sale price calculator",
          "percent off",
          "discount price",
          "savings calculator"
        ],
        "searchKeywords": [
          "discount",
          "sale",
          "price",
          "saving",
          "percentage"
        ]
      },
      {
        "resourceId": "res_tool_discount-calculator",
        "locale": "zh-CN",
        "name": "折扣计算",
        "summary": "计算折后价和节省金额。",
        "seoTitle": "折扣计算 | GoDeskHub",
        "seoDescription": "计算折后价和节省金额。",
        "searchAliases": [
          "折后价计算",
          "促销价格",
          "优惠计算",
          "节省金额"
        ],
        "searchKeywords": [
          "折扣",
          "促销",
          "价格",
          "节省",
          "百分比"
        ]
      },
      {
        "resourceId": "res_tool_discount-calculator",
        "locale": "zh-TW",
        "name": "折扣計算",
        "summary": "計算折後價與省下金額。",
        "seoTitle": "折扣計算 | GoDeskHub",
        "seoDescription": "計算折後價與省下金額。",
        "searchAliases": [
          "折後價計算",
          "促銷價格",
          "優惠計算",
          "省下金額"
        ],
        "searchKeywords": [
          "折扣",
          "促銷",
          "價格",
          "省下",
          "百分比"
        ]
      },
      {
        "resourceId": "res_tool_ip-lookup",
        "locale": "en",
        "name": "IP lookup",
        "summary": "Hidden capability record for the unpublished IP information lookup.",
        "seoTitle": "IP lookup | GoDeskHub",
        "seoDescription": "Hidden capability record for the unpublished IP information lookup.",
        "searchAliases": [
          "ip lookup",
          "ip geolocation"
        ],
        "searchKeywords": [
          "ip",
          "lookup",
          "hidden"
        ]
      },
      {
        "resourceId": "res_tool_ip-lookup",
        "locale": "zh-CN",
        "name": "IP 查询",
        "summary": "未发布 IP 信息查询的隐藏能力记录。",
        "seoTitle": "IP 查询 | GoDeskHub",
        "seoDescription": "未发布 IP 信息查询的隐藏能力记录。",
        "searchAliases": [
          "IP 查询",
          "IP 地理位置"
        ],
        "searchKeywords": [
          "IP",
          "查询",
          "隐藏"
        ]
      },
      {
        "resourceId": "res_tool_ip-lookup",
        "locale": "zh-TW",
        "name": "IP 查詢",
        "summary": "未發佈 IP 資訊查詢的隱藏能力記錄。",
        "seoTitle": "IP 查詢 | GoDeskHub",
        "seoDescription": "未發佈 IP 資訊查詢的隱藏能力記錄。",
        "searchAliases": [
          "IP 查詢",
          "IP 地理位置"
        ],
        "searchKeywords": [
          "IP",
          "查詢",
          "隱藏"
        ]
      },
      {
        "resourceId": "res_tool_ip-whois-rdap",
        "locale": "en",
        "name": "IP WHOIS and RDAP",
        "summary": "Hidden capability record for unpublished IP registry lookup.",
        "seoTitle": "IP WHOIS and RDAP | GoDeskHub",
        "seoDescription": "Hidden capability record for unpublished IP registry lookup.",
        "searchAliases": [
          "rdap",
          "whois"
        ],
        "searchKeywords": [
          "ip",
          "rdap",
          "whois",
          "hidden"
        ]
      },
      {
        "resourceId": "res_tool_ip-whois-rdap",
        "locale": "zh-CN",
        "name": "IP WHOIS 与 RDAP",
        "summary": "未发布 IP 注册信息查询的隐藏能力记录。",
        "seoTitle": "IP WHOIS 与 RDAP | GoDeskHub",
        "seoDescription": "未发布 IP 注册信息查询的隐藏能力记录。",
        "searchAliases": [
          "RDAP",
          "WHOIS"
        ],
        "searchKeywords": [
          "IP",
          "RDAP",
          "WHOIS",
          "隐藏"
        ]
      },
      {
        "resourceId": "res_tool_ip-whois-rdap",
        "locale": "zh-TW",
        "name": "IP WHOIS 與 RDAP",
        "summary": "未發佈 IP 註冊資訊查詢的隱藏能力記錄。",
        "seoTitle": "IP WHOIS 與 RDAP | GoDeskHub",
        "seoDescription": "未發佈 IP 註冊資訊查詢的隱藏能力記錄。",
        "searchAliases": [
          "RDAP",
          "WHOIS"
        ],
        "searchKeywords": [
          "IP",
          "RDAP",
          "WHOIS",
          "隱藏"
        ]
      },
      {
        "resourceId": "res_tool_ipv4-network-toolbox",
        "locale": "en",
        "name": "IPv4 network toolbox",
        "summary": "Calculate IPv4 subnets, masks, host capacity, ranges, conversions, and same-subnet checks locally.",
        "seoTitle": "IPv4 network toolbox | GoDeskHub",
        "seoDescription": "Calculate IPv4 subnets, masks, host capacity, ranges, conversions, and same-subnet checks locally.",
        "searchAliases": [
          "subnet calculator",
          "subnet mask",
          "CIDR calculator",
          "wildcard mask",
          "same subnet",
          "IP range",
          "range to CIDR",
          "CIDR to range",
          "IP to decimal",
          "IP to binary",
          "IP to hex",
          "IPv4 converter"
        ],
        "searchKeywords": [
          "network address",
          "broadcast address",
          "host calculator",
          "CIDR",
          "IPv4",
          "mask converter",
          "host recommendation",
          "range converter"
        ]
      },
      {
        "resourceId": "res_tool_ipv4-network-toolbox",
        "locale": "zh-CN",
        "name": "IPv4 网络工具箱",
        "summary": "本地计算 IPv4 子网、掩码、主机容量、范围、地址转换和同子网判断。",
        "seoTitle": "IPv4 网络工具箱 | GoDeskHub",
        "seoDescription": "本地计算 IPv4 子网、掩码、主机容量、范围、地址转换和同子网判断。",
        "searchAliases": [
          "subnet calculator",
          "subnet mask",
          "CIDR calculator",
          "wildcard mask",
          "same subnet",
          "IP range",
          "range to CIDR",
          "CIDR to range",
          "IP to decimal",
          "IP to binary",
          "IP to hex",
          "IPv4 converter",
          "子网计算",
          "掩码转换",
          "CIDR 转换",
          "同子网"
        ],
        "searchKeywords": [
          "network address",
          "broadcast address",
          "host calculator",
          "CIDR",
          "IPv4",
          "mask converter",
          "host recommendation",
          "range converter",
          "网络",
          "IP",
          "隐私",
          "本地处理",
          "工具箱"
        ]
      },
      {
        "resourceId": "res_tool_ipv4-network-toolbox",
        "locale": "zh-TW",
        "name": "IPv4 網絡工具箱",
        "summary": "本機計算 IPv4 子網、遮罩、主機容量、範圍、位址轉換和同子網判斷。",
        "seoTitle": "IPv4 網絡工具箱 | GoDeskHub",
        "seoDescription": "本機計算 IPv4 子網、遮罩、主機容量、範圍、位址轉換和同子網判斷。",
        "searchAliases": [
          "subnet calculator",
          "subnet mask",
          "CIDR calculator",
          "wildcard mask",
          "same subnet",
          "IP range",
          "range to CIDR",
          "CIDR to range",
          "IP to decimal",
          "IP to binary",
          "IP to hex",
          "IPv4 converter",
          "子網計算",
          "遮罩轉換",
          "CIDR 轉換",
          "同子網"
        ],
        "searchKeywords": [
          "network address",
          "broadcast address",
          "host calculator",
          "CIDR",
          "IPv4",
          "mask converter",
          "host recommendation",
          "range converter",
          "網絡",
          "IP",
          "隱私",
          "本機處理",
          "工具箱"
        ]
      },
      {
        "resourceId": "res_tool_ipv6-toolbox",
        "locale": "en",
        "name": "IPv6 toolbox",
        "summary": "Expand, compress, normalize, classify, and calculate IPv6 prefix ranges locally.",
        "seoTitle": "IPv6 toolbox | GoDeskHub",
        "seoDescription": "Expand, compress, normalize, classify, and calculate IPv6 prefix ranges locally.",
        "searchAliases": [
          "IPv6 expand",
          "IPv6 compress",
          "IPv6 normalize",
          "IPv6 prefix",
          "IPv6 range",
          "RFC 5952"
        ],
        "searchKeywords": [
          "IPv6",
          "RFC 5952",
          "prefix",
          "BigInt",
          "address type",
          "normalize"
        ]
      },
      {
        "resourceId": "res_tool_ipv6-toolbox",
        "locale": "zh-CN",
        "name": "IPv6 工具箱",
        "summary": "本地展开、压缩、规范化、分类并计算 IPv6 前缀范围。",
        "seoTitle": "IPv6 工具箱 | GoDeskHub",
        "seoDescription": "本地展开、压缩、规范化、分类并计算 IPv6 前缀范围。",
        "searchAliases": [
          "IPv6 expand",
          "IPv6 compress",
          "IPv6 normalize",
          "IPv6 prefix",
          "IPv6 range",
          "RFC 5952",
          "IPv6 展开",
          "IPv6 压缩",
          "IPv6 前缀"
        ],
        "searchKeywords": [
          "IPv6",
          "RFC 5952",
          "prefix",
          "BigInt",
          "address type",
          "normalize",
          "网络",
          "IP",
          "隐私",
          "本地处理",
          "工具箱"
        ]
      },
      {
        "resourceId": "res_tool_ipv6-toolbox",
        "locale": "zh-TW",
        "name": "IPv6 工具箱",
        "summary": "本機展開、壓縮、規範化、分類並計算 IPv6 前綴範圍。",
        "seoTitle": "IPv6 工具箱 | GoDeskHub",
        "seoDescription": "本機展開、壓縮、規範化、分類並計算 IPv6 前綴範圍。",
        "searchAliases": [
          "IPv6 expand",
          "IPv6 compress",
          "IPv6 normalize",
          "IPv6 prefix",
          "IPv6 range",
          "RFC 5952",
          "IPv6 展開",
          "IPv6 壓縮",
          "IPv6 前綴"
        ],
        "searchKeywords": [
          "IPv6",
          "RFC 5952",
          "prefix",
          "BigInt",
          "address type",
          "normalize",
          "網絡",
          "IP",
          "隱私",
          "本機處理",
          "工具箱"
        ]
      },
      {
        "resourceId": "res_tool_irr-calculator",
        "locale": "en",
        "name": "IRR calculator",
        "summary": "Calculate fixed-period IRR and its annualized equivalent.",
        "seoTitle": "IRR calculator | GoDeskHub",
        "seoDescription": "Calculate fixed-period IRR and its annualized equivalent.",
        "searchAliases": [
          "internal rate of return",
          "periodic IRR",
          "annualized IRR",
          "investment return"
        ],
        "searchKeywords": [
          "IRR",
          "cash flow",
          "NPV",
          "periodic",
          "annualized",
          "multiple roots"
        ]
      },
      {
        "resourceId": "res_tool_irr-calculator",
        "locale": "zh-CN",
        "name": "IRR 计算器",
        "summary": "计算固定周期内部收益率及其年化结果。",
        "seoTitle": "IRR 计算器 | GoDeskHub",
        "seoDescription": "计算固定周期内部收益率及其年化结果。",
        "searchAliases": [
          "内部收益率",
          "每期 IRR",
          "年化 IRR",
          "投资回报"
        ],
        "searchKeywords": [
          "IRR",
          "现金流",
          "净现值",
          "每期",
          "年化",
          "多根"
        ]
      },
      {
        "resourceId": "res_tool_irr-calculator",
        "locale": "zh-TW",
        "name": "IRR 計算器",
        "summary": "計算固定週期內部收益率及其年化結果。",
        "seoTitle": "IRR 計算器 | GoDeskHub",
        "seoDescription": "計算固定週期內部收益率及其年化結果。",
        "searchAliases": [
          "內部收益率",
          "每期 IRR",
          "年化 IRR",
          "投資回報"
        ],
        "searchKeywords": [
          "IRR",
          "現金流",
          "淨現值",
          "每期",
          "年化",
          "多根"
        ]
      },
      {
        "resourceId": "res_tool_json-tools",
        "locale": "en",
        "name": "JSON tools",
        "summary": "Format, minify, and validate JSON locally.",
        "seoTitle": "JSON tools | GoDeskHub",
        "seoDescription": "Format, minify, and validate JSON locally.",
        "searchAliases": [
          "json formatter",
          "json validator",
          "json minifier",
          "pretty print json"
        ],
        "searchKeywords": [
          "JSON",
          "format",
          "minify",
          "validate",
          "parser",
          "developer"
        ]
      },
      {
        "resourceId": "res_tool_json-tools",
        "locale": "zh-CN",
        "name": "JSON 工具",
        "summary": "在本地格式化、压缩并校验 JSON。",
        "seoTitle": "JSON 工具 | GoDeskHub",
        "seoDescription": "在本地格式化、压缩并校验 JSON。",
        "searchAliases": [
          "JSON 格式化",
          "JSON 校验",
          "JSON 压缩",
          "JSON 美化"
        ],
        "searchKeywords": [
          "JSON",
          "格式化",
          "压缩",
          "校验",
          "解析器",
          "开发工具"
        ]
      },
      {
        "resourceId": "res_tool_json-tools",
        "locale": "zh-TW",
        "name": "JSON 工具",
        "summary": "在本機格式化、壓縮並驗證 JSON。",
        "seoTitle": "JSON 工具 | GoDeskHub",
        "seoDescription": "在本機格式化、壓縮並驗證 JSON。",
        "searchAliases": [
          "JSON 格式化",
          "JSON 驗證",
          "JSON 壓縮",
          "JSON 美化"
        ],
        "searchKeywords": [
          "JSON",
          "格式化",
          "壓縮",
          "驗證",
          "解析器",
          "開發工具"
        ]
      },
      {
        "resourceId": "res_tool_length-converter",
        "locale": "en",
        "name": "Length converter",
        "summary": "Convert meters, feet, miles, and more.",
        "seoTitle": "Length converter | GoDeskHub",
        "seoDescription": "Convert meters, feet, miles, and more.",
        "searchAliases": [
          "distance converter",
          "meters to feet",
          "km to miles",
          "m to ft"
        ],
        "searchKeywords": [
          "length",
          "distance",
          "metre",
          "meter",
          "foot",
          "mile",
          "yard"
        ]
      },
      {
        "resourceId": "res_tool_length-converter",
        "locale": "zh-CN",
        "name": "长度转换",
        "summary": "米、英尺、英里等单位互转。",
        "seoTitle": "长度转换 | GoDeskHub",
        "seoDescription": "米、英尺、英里等单位互转。",
        "searchAliases": [
          "距离转换",
          "米转英尺",
          "千米转英里",
          "m 转 ft"
        ],
        "searchKeywords": [
          "长度",
          "距离",
          "米",
          "英尺",
          "英里",
          "码"
        ]
      },
      {
        "resourceId": "res_tool_length-converter",
        "locale": "zh-TW",
        "name": "長度轉換",
        "summary": "公尺、英尺、英里等單位互轉。",
        "seoTitle": "長度轉換 | GoDeskHub",
        "seoDescription": "公尺、英尺、英里等單位互轉。",
        "searchAliases": [
          "距離轉換",
          "公尺轉英尺",
          "公里轉英里",
          "m 轉 ft"
        ],
        "searchKeywords": [
          "長度",
          "距離",
          "公尺",
          "英尺",
          "英里",
          "碼"
        ]
      },
      {
        "resourceId": "res_tool_password-generator",
        "locale": "en",
        "name": "Password generator",
        "summary": "Generate constrained passwords with browser cryptography.",
        "seoTitle": "Password generator | GoDeskHub",
        "seoDescription": "Generate constrained passwords with browser cryptography.",
        "searchAliases": [
          "secure password",
          "random password",
          "password maker"
        ],
        "searchKeywords": [
          "password",
          "crypto",
          "random",
          "minimum characters",
          "symbols",
          "batch"
        ]
      },
      {
        "resourceId": "res_tool_password-generator",
        "locale": "zh-CN",
        "name": "密码生成器",
        "summary": "使用浏览器密码学安全随机源生成符合规则的密码。",
        "seoTitle": "密码生成器 | GoDeskHub",
        "seoDescription": "使用浏览器密码学安全随机源生成符合规则的密码。",
        "searchAliases": [
          "安全密码",
          "随机密码",
          "密码生成",
          "批量密码"
        ],
        "searchKeywords": [
          "密码",
          "安全随机",
          "最少字符",
          "符号",
          "批量"
        ]
      },
      {
        "resourceId": "res_tool_password-generator",
        "locale": "zh-TW",
        "name": "密碼產生器",
        "summary": "使用瀏覽器密碼學安全隨機來源產生符合規則的密碼。",
        "seoTitle": "密碼產生器 | GoDeskHub",
        "seoDescription": "使用瀏覽器密碼學安全隨機來源產生符合規則的密碼。",
        "searchAliases": [
          "安全密碼",
          "隨機密碼",
          "密碼產生",
          "批次密碼"
        ],
        "searchKeywords": [
          "密碼",
          "安全隨機",
          "最少字元",
          "符號",
          "批次"
        ]
      },
      {
        "resourceId": "res_tool_percentage-calculator",
        "locale": "en",
        "name": "Percentage calculator",
        "summary": "Calculate a percentage of a value.",
        "seoTitle": "Percentage calculator | GoDeskHub",
        "seoDescription": "Calculate a percentage of a value.",
        "searchAliases": [
          "percent of number",
          "percentage of value",
          "percent calculator",
          "calculate percent"
        ],
        "searchKeywords": [
          "percentage",
          "percent",
          "ratio",
          "base value",
          "calculation"
        ]
      },
      {
        "resourceId": "res_tool_percentage-calculator",
        "locale": "zh-CN",
        "name": "百分比计算",
        "summary": "计算某数值的百分比。",
        "seoTitle": "百分比计算 | GoDeskHub",
        "seoDescription": "计算某数值的百分比。",
        "searchAliases": [
          "数值百分比",
          "百分比工具",
          "求百分之几",
          "percent 计算"
        ],
        "searchKeywords": [
          "百分比",
          "比例",
          "基准数值",
          "计算"
        ]
      },
      {
        "resourceId": "res_tool_percentage-calculator",
        "locale": "zh-TW",
        "name": "百分比計算",
        "summary": "計算某數值的百分比。",
        "seoTitle": "百分比計算 | GoDeskHub",
        "seoDescription": "計算某數值的百分比。",
        "searchAliases": [
          "數值百分比",
          "百分比工具",
          "求百分之幾",
          "percent 計算"
        ],
        "searchKeywords": [
          "百分比",
          "比例",
          "基準數值",
          "計算"
        ]
      },
      {
        "resourceId": "res_tool_qr-code-generator",
        "locale": "en",
        "name": "QR Code generator",
        "summary": "Create and download customizable QR Codes locally.",
        "seoTitle": "QR Code generator | GoDeskHub",
        "seoDescription": "Create and download customizable QR Codes locally.",
        "searchAliases": [
          "qr generator",
          "qr code maker",
          "text to qr",
          "url qr"
        ],
        "searchKeywords": [
          "QR Code",
          "PNG",
          "scanner",
          "capacity",
          "contrast",
          "local"
        ]
      },
      {
        "resourceId": "res_tool_qr-code-generator",
        "locale": "zh-CN",
        "name": "QR Code 生成器",
        "summary": "本地生成并下载可自定义的 QR Code。",
        "seoTitle": "QR Code 生成器 | GoDeskHub",
        "seoDescription": "本地生成并下载可自定义的 QR Code。",
        "searchAliases": [
          "QR 生成器",
          "二维码生成",
          "文本转 QR",
          "网址 QR"
        ],
        "searchKeywords": [
          "QR Code",
          "二维码",
          "PNG",
          "扫码",
          "容量",
          "对比度",
          "本地"
        ]
      },
      {
        "resourceId": "res_tool_qr-code-generator",
        "locale": "zh-TW",
        "name": "QR Code 產生器",
        "summary": "本機產生並下載可自訂的 QR Code。",
        "seoTitle": "QR Code 產生器 | GoDeskHub",
        "seoDescription": "本機產生並下載可自訂的 QR Code。",
        "searchAliases": [
          "QR 產生器",
          "二維碼產生",
          "文字轉 QR",
          "網址 QR"
        ],
        "searchKeywords": [
          "QR Code",
          "二維碼",
          "PNG",
          "掃描",
          "容量",
          "對比",
          "本機"
        ]
      },
      {
        "resourceId": "res_tool_speed-converter",
        "locale": "en",
        "name": "Speed converter",
        "summary": "Convert km/h, mph, knots, and m/s.",
        "seoTitle": "Speed converter | GoDeskHub",
        "seoDescription": "Convert km/h, mph, knots, and m/s.",
        "searchAliases": [
          "velocity converter",
          "kph to mph",
          "kmh to mph",
          "knots converter"
        ],
        "searchKeywords": [
          "speed",
          "metres per second",
          "kilometres per hour",
          "mph",
          "knot"
        ]
      },
      {
        "resourceId": "res_tool_speed-converter",
        "locale": "zh-CN",
        "name": "速度转换",
        "summary": "公里／小时、英里／小时、节互转。",
        "seoTitle": "速度转换 | GoDeskHub",
        "seoDescription": "公里／小时、英里／小时、节互转。",
        "searchAliases": [
          "速度单位转换",
          "公里时转英里时",
          "kmh 转 mph",
          "节转换"
        ],
        "searchKeywords": [
          "速度",
          "米每秒",
          "公里每小时",
          "英里每小时",
          "节"
        ]
      },
      {
        "resourceId": "res_tool_speed-converter",
        "locale": "zh-TW",
        "name": "速度轉換",
        "summary": "公里／小時、英里／小時、節互轉。",
        "seoTitle": "速度轉換 | GoDeskHub",
        "seoDescription": "公里／小時、英里／小時、節互轉。",
        "searchAliases": [
          "速度單位轉換",
          "公里時轉英里時",
          "kmh 轉 mph",
          "節轉換"
        ],
        "searchKeywords": [
          "速度",
          "公尺每秒",
          "公里每小時",
          "英里每小時",
          "節"
        ]
      },
      {
        "resourceId": "res_tool_temperature-converter",
        "locale": "en",
        "name": "Temperature converter",
        "summary": "Convert Celsius, Fahrenheit, and Kelvin.",
        "seoTitle": "Temperature converter | GoDeskHub",
        "seoDescription": "Convert Celsius, Fahrenheit, and Kelvin.",
        "searchAliases": [
          "celsius to fahrenheit",
          "fahrenheit to celsius",
          "kelvin converter",
          "temperature scale"
        ],
        "searchKeywords": [
          "temperature",
          "celsius",
          "fahrenheit",
          "kelvin",
          "absolute zero"
        ]
      },
      {
        "resourceId": "res_tool_temperature-converter",
        "locale": "zh-CN",
        "name": "温度转换",
        "summary": "摄氏、华氏、开尔文公式换算。",
        "seoTitle": "温度转换 | GoDeskHub",
        "seoDescription": "摄氏、华氏、开尔文公式换算。",
        "searchAliases": [
          "摄氏转华氏",
          "华氏转摄氏",
          "开尔文转换",
          "温标转换"
        ],
        "searchKeywords": [
          "温度",
          "摄氏",
          "华氏",
          "开尔文",
          "绝对零度"
        ]
      },
      {
        "resourceId": "res_tool_temperature-converter",
        "locale": "zh-TW",
        "name": "溫度轉換",
        "summary": "攝氏、華氏、克氏公式換算。",
        "seoTitle": "溫度轉換 | GoDeskHub",
        "seoDescription": "攝氏、華氏、克氏公式換算。",
        "searchAliases": [
          "攝氏轉華氏",
          "華氏轉攝氏",
          "克氏轉換",
          "溫標轉換"
        ],
        "searchKeywords": [
          "溫度",
          "攝氏",
          "華氏",
          "克氏",
          "絕對零度"
        ]
      },
      {
        "resourceId": "res_tool_text-case-converter",
        "locale": "en",
        "name": "Text case converter",
        "summary": "Convert upper, lower, title, and camel case.",
        "seoTitle": "Text case converter | GoDeskHub",
        "seoDescription": "Convert upper, lower, title, and camel case.",
        "searchAliases": [
          "uppercase converter",
          "lowercase converter",
          "title case",
          "camel case"
        ],
        "searchKeywords": [
          "text case",
          "uppercase",
          "lowercase",
          "title",
          "camelCase",
          "Unicode"
        ]
      },
      {
        "resourceId": "res_tool_text-case-converter",
        "locale": "zh-CN",
        "name": "文本大小写转换",
        "summary": "大写、小写、标题和驼峰格式。",
        "seoTitle": "文本大小写转换 | GoDeskHub",
        "seoDescription": "大写、小写、标题和驼峰格式。",
        "searchAliases": [
          "大写转换",
          "小写转换",
          "标题格式",
          "驼峰格式"
        ],
        "searchKeywords": [
          "文本大小写",
          "大写",
          "小写",
          "标题",
          "camelCase",
          "Unicode"
        ]
      },
      {
        "resourceId": "res_tool_text-case-converter",
        "locale": "zh-TW",
        "name": "文字大小寫轉換",
        "summary": "大寫、小寫、標題和駝峰格式。",
        "seoTitle": "文字大小寫轉換 | GoDeskHub",
        "seoDescription": "大寫、小寫、標題和駝峰格式。",
        "searchAliases": [
          "大寫轉換",
          "小寫轉換",
          "標題格式",
          "駝峰格式"
        ],
        "searchKeywords": [
          "文字大小寫",
          "大寫",
          "小寫",
          "標題",
          "camelCase",
          "Unicode"
        ]
      },
      {
        "resourceId": "res_tool_time-converter",
        "locale": "en",
        "name": "Time converter",
        "summary": "Convert milliseconds through weeks.",
        "seoTitle": "Time converter | GoDeskHub",
        "seoDescription": "Convert milliseconds through weeks.",
        "searchAliases": [
          "duration converter",
          "hours to minutes",
          "seconds to milliseconds",
          "days to weeks"
        ],
        "searchKeywords": [
          "time",
          "duration",
          "millisecond",
          "second",
          "hour",
          "day",
          "week"
        ]
      },
      {
        "resourceId": "res_tool_time-converter",
        "locale": "zh-CN",
        "name": "时间转换",
        "summary": "毫秒、秒、分钟、小时、天互转。",
        "seoTitle": "时间转换 | GoDeskHub",
        "seoDescription": "毫秒、秒、分钟、小时、天互转。",
        "searchAliases": [
          "时长转换",
          "小时转分钟",
          "秒转毫秒",
          "天转周"
        ],
        "searchKeywords": [
          "时间",
          "时长",
          "毫秒",
          "秒",
          "小时",
          "天",
          "周"
        ]
      },
      {
        "resourceId": "res_tool_time-converter",
        "locale": "zh-TW",
        "name": "時間轉換",
        "summary": "毫秒、秒、分鐘、小時、天互轉。",
        "seoTitle": "時間轉換 | GoDeskHub",
        "seoDescription": "毫秒、秒、分鐘、小時、天互轉。",
        "searchAliases": [
          "時長轉換",
          "小時轉分鐘",
          "秒轉毫秒",
          "天轉週"
        ],
        "searchKeywords": [
          "時間",
          "時長",
          "毫秒",
          "秒",
          "小時",
          "天",
          "週"
        ]
      },
      {
        "resourceId": "res_tool_timestamp-converter",
        "locale": "en",
        "name": "Timestamp converter",
        "summary": "Convert seconds, milliseconds, and dates.",
        "seoTitle": "Timestamp converter | GoDeskHub",
        "seoDescription": "Convert seconds, milliseconds, and dates.",
        "searchAliases": [
          "unix timestamp",
          "epoch converter",
          "seconds to date",
          "milliseconds to date"
        ],
        "searchKeywords": [
          "timestamp",
          "Unix",
          "epoch",
          "ISO 8601",
          "UTC",
          "timezone",
          "milliseconds"
        ]
      },
      {
        "resourceId": "res_tool_timestamp-converter",
        "locale": "zh-CN",
        "name": "时间戳转换",
        "summary": "秒、毫秒和日期时间互转。",
        "seoTitle": "时间戳转换 | GoDeskHub",
        "seoDescription": "秒、毫秒和日期时间互转。",
        "searchAliases": [
          "Unix 时间戳",
          "纪元转换",
          "秒转日期",
          "毫秒转日期"
        ],
        "searchKeywords": [
          "时间戳",
          "Unix",
          "纪元",
          "ISO 8601",
          "UTC",
          "时区",
          "毫秒"
        ]
      },
      {
        "resourceId": "res_tool_timestamp-converter",
        "locale": "zh-TW",
        "name": "時間戳轉換",
        "summary": "秒、毫秒和日期時間互轉。",
        "seoTitle": "時間戳轉換 | GoDeskHub",
        "seoDescription": "秒、毫秒和日期時間互轉。",
        "searchAliases": [
          "Unix 時間戳",
          "紀元轉換",
          "秒轉日期",
          "毫秒轉日期"
        ],
        "searchKeywords": [
          "時間戳",
          "Unix",
          "紀元",
          "ISO 8601",
          "UTC",
          "時區",
          "毫秒"
        ]
      },
      {
        "resourceId": "res_tool_url-encoder-decoder",
        "locale": "en",
        "name": "URL encoder and decoder",
        "summary": "Encode and decode URL text safely.",
        "seoTitle": "URL encoder and decoder | GoDeskHub",
        "seoDescription": "Encode and decode URL text safely.",
        "searchAliases": [
          "percent encoder",
          "url encode",
          "url decode",
          "encodeURIComponent"
        ],
        "searchKeywords": [
          "URL",
          "URI",
          "percent encoding",
          "component",
          "decodeURIComponent"
        ]
      },
      {
        "resourceId": "res_tool_url-encoder-decoder",
        "locale": "zh-CN",
        "name": "URL 编解码",
        "summary": "安全编码和还原 URL 文本。",
        "seoTitle": "URL 编解码 | GoDeskHub",
        "seoDescription": "安全编码和还原 URL 文本。",
        "searchAliases": [
          "百分号编码",
          "URL 编码",
          "URL 解码",
          "encodeURIComponent"
        ],
        "searchKeywords": [
          "URL",
          "URI",
          "百分号编码",
          "组件",
          "decodeURIComponent"
        ]
      },
      {
        "resourceId": "res_tool_url-encoder-decoder",
        "locale": "zh-TW",
        "name": "URL 編解碼",
        "summary": "安全編碼和還原 URL 文字。",
        "seoTitle": "URL 編解碼 | GoDeskHub",
        "seoDescription": "安全編碼和還原 URL 文字。",
        "searchAliases": [
          "百分比編碼",
          "URL 編碼",
          "URL 解碼",
          "encodeURIComponent"
        ],
        "searchKeywords": [
          "URL",
          "URI",
          "百分比編碼",
          "元件",
          "decodeURIComponent"
        ]
      },
      {
        "resourceId": "res_tool_uuid-generator",
        "locale": "en",
        "name": "UUID generator",
        "summary": "Generate secure UUID v4 values in your browser.",
        "seoTitle": "UUID generator | GoDeskHub",
        "seoDescription": "Generate secure UUID v4 values in your browser.",
        "searchAliases": [
          "guid generator",
          "uuid v4",
          "random id",
          "unique identifier"
        ],
        "searchKeywords": [
          "UUID",
          "GUID",
          "version 4",
          "random",
          "identifier",
          "crypto"
        ]
      },
      {
        "resourceId": "res_tool_uuid-generator",
        "locale": "zh-CN",
        "name": "UUID 生成器",
        "summary": "用安全随机源生成 UUID v4。",
        "seoTitle": "UUID 生成器 | GoDeskHub",
        "seoDescription": "用安全随机源生成 UUID v4。",
        "searchAliases": [
          "GUID 生成器",
          "UUID v4",
          "随机 ID",
          "唯一标识符"
        ],
        "searchKeywords": [
          "UUID",
          "GUID",
          "版本 4",
          "随机",
          "标识符",
          "加密随机"
        ]
      },
      {
        "resourceId": "res_tool_uuid-generator",
        "locale": "zh-TW",
        "name": "UUID 產生器",
        "summary": "用安全隨機源產生 UUID v4。",
        "seoTitle": "UUID 產生器 | GoDeskHub",
        "seoDescription": "用安全隨機源產生 UUID v4。",
        "searchAliases": [
          "GUID 產生器",
          "UUID v4",
          "隨機 ID",
          "唯一識別碼"
        ],
        "searchKeywords": [
          "UUID",
          "GUID",
          "版本 4",
          "隨機",
          "識別碼",
          "加密隨機"
        ]
      },
      {
        "resourceId": "res_tool_volume-converter",
        "locale": "en",
        "name": "Volume converter",
        "summary": "Convert liters, milliliters, gallons, and cups.",
        "seoTitle": "Volume converter | GoDeskHub",
        "seoDescription": "Convert liters, milliliters, gallons, and cups.",
        "searchAliases": [
          "liter converter",
          "litres to gallons",
          "ml to cups",
          "liquid volume"
        ],
        "searchKeywords": [
          "volume",
          "litre",
          "millilitre",
          "gallon",
          "cup",
          "cubic metre"
        ]
      },
      {
        "resourceId": "res_tool_volume-converter",
        "locale": "zh-CN",
        "name": "体积转换",
        "summary": "升、毫升、美制加仑和杯互转。",
        "seoTitle": "体积转换 | GoDeskHub",
        "seoDescription": "升、毫升、美制加仑和杯互转。",
        "searchAliases": [
          "升转换",
          "升转加仑",
          "毫升转杯",
          "液体体积"
        ],
        "searchKeywords": [
          "体积",
          "升",
          "毫升",
          "加仑",
          "杯",
          "立方米"
        ]
      },
      {
        "resourceId": "res_tool_volume-converter",
        "locale": "zh-TW",
        "name": "體積轉換",
        "summary": "公升、毫升、美制加侖與杯互轉。",
        "seoTitle": "體積轉換 | GoDeskHub",
        "seoDescription": "公升、毫升、美制加侖與杯互轉。",
        "searchAliases": [
          "公升轉換",
          "公升轉加侖",
          "毫升轉杯",
          "液體體積"
        ],
        "searchKeywords": [
          "體積",
          "公升",
          "毫升",
          "加侖",
          "杯",
          "立方公尺"
        ]
      },
      {
        "resourceId": "res_tool_weight-converter",
        "locale": "en",
        "name": "Weight converter",
        "summary": "Convert kilograms, pounds, ounces, and tons.",
        "seoTitle": "Weight converter | GoDeskHub",
        "seoDescription": "Convert kilograms, pounds, ounces, and tons.",
        "searchAliases": [
          "mass converter",
          "kg to lb",
          "grams to ounces",
          "kilograms to pounds"
        ],
        "searchKeywords": [
          "weight",
          "mass",
          "kilogram",
          "pound",
          "ounce",
          "metric ton"
        ]
      },
      {
        "resourceId": "res_tool_weight-converter",
        "locale": "zh-CN",
        "name": "重量转换",
        "summary": "千克、磅、盎司、吨互转。",
        "seoTitle": "重量转换 | GoDeskHub",
        "seoDescription": "千克、磅、盎司、吨互转。",
        "searchAliases": [
          "质量转换",
          "千克转磅",
          "克转盎司",
          "kg 转 lb"
        ],
        "searchKeywords": [
          "重量",
          "质量",
          "千克",
          "磅",
          "盎司",
          "公吨"
        ]
      },
      {
        "resourceId": "res_tool_weight-converter",
        "locale": "zh-TW",
        "name": "重量轉換",
        "summary": "公斤、磅、盎司、公噸互轉。",
        "seoTitle": "重量轉換 | GoDeskHub",
        "seoDescription": "公斤、磅、盎司、公噸互轉。",
        "searchAliases": [
          "質量轉換",
          "公斤轉磅",
          "公克轉盎司",
          "kg 轉 lb"
        ],
        "searchKeywords": [
          "重量",
          "質量",
          "公斤",
          "磅",
          "盎司",
          "公噸"
        ]
      },
      {
        "resourceId": "res_tool_word-counter",
        "locale": "en",
        "name": "Word counter",
        "summary": "Count characters, words, and lines locally.",
        "seoTitle": "Word counter | GoDeskHub",
        "seoDescription": "Count characters, words, and lines locally.",
        "searchAliases": [
          "character counter",
          "word count",
          "line counter",
          "text statistics"
        ],
        "searchKeywords": [
          "words",
          "characters",
          "lines",
          "whitespace",
          "Unicode",
          "count"
        ]
      },
      {
        "resourceId": "res_tool_word-counter",
        "locale": "zh-CN",
        "name": "字数统计",
        "summary": "字符数、字词数和行数统计。",
        "seoTitle": "字数统计 | GoDeskHub",
        "seoDescription": "字符数、字词数和行数统计。",
        "searchAliases": [
          "字符统计",
          "词数统计",
          "行数统计",
          "文本统计"
        ],
        "searchKeywords": [
          "字数",
          "字符",
          "字词",
          "行数",
          "空白",
          "Unicode"
        ]
      },
      {
        "resourceId": "res_tool_word-counter",
        "locale": "zh-TW",
        "name": "字數統計",
        "summary": "字元數、字詞數和行數統計。",
        "seoTitle": "字數統計 | GoDeskHub",
        "seoDescription": "字元數、字詞數和行數統計。",
        "searchAliases": [
          "字元統計",
          "詞數統計",
          "行數統計",
          "文字統計"
        ],
        "searchKeywords": [
          "字數",
          "字元",
          "字詞",
          "行數",
          "空白",
          "Unicode"
        ]
      },
      {
        "resourceId": "res_website_rfc-editor",
        "locale": "en",
        "name": "RFC Editor",
        "summary": "The official publication site for RFC documents used by Internet protocols and operations.",
        "seoTitle": "RFC Editor protocol reference | GoDeskHub",
        "seoDescription": "Use RFC Editor as the official source for published RFC protocol documents.",
        "searchAliases": [
          "RFC Editor",
          "RFC documents",
          "Internet standards"
        ],
        "searchKeywords": [
          "network",
          "protocol",
          "reference"
        ]
      },
      {
        "resourceId": "res_website_rfc-editor",
        "locale": "zh-CN",
        "name": "RFC Editor",
        "summary": "用于查阅互联网协议与运行文档的官方 RFC 发布网站。",
        "seoTitle": "RFC Editor 协议参考 | GoDeskHub",
        "seoDescription": "使用 RFC Editor 查阅已发布 RFC 协议文档的官方来源。",
        "searchAliases": [
          "RFC Editor",
          "RFC 文档",
          "互联网标准"
        ],
        "searchKeywords": [
          "网络",
          "协议",
          "参考"
        ]
      },
      {
        "resourceId": "res_website_rfc-editor",
        "locale": "zh-TW",
        "name": "RFC Editor",
        "summary": "用於查閱互聯網協議與運行文件的官方 RFC 發布網站。",
        "seoTitle": "RFC Editor 協議參考 | GoDeskHub",
        "seoDescription": "使用 RFC Editor 查閱已發布 RFC 協議文件的官方來源。",
        "searchAliases": [
          "RFC Editor",
          "RFC 文件",
          "互聯網標準"
        ],
        "searchKeywords": [
          "網絡",
          "協議",
          "參考"
        ]
      },
      {
        "resourceId": "res_website_whatwg-url-standard",
        "locale": "en",
        "name": "WHATWG URL Standard",
        "summary": "The living standard for URL parsing and serialization behavior used by modern browsers.",
        "seoTitle": "WHATWG URL Standard reference | GoDeskHub",
        "seoDescription": "Bookmark the WHATWG URL Standard for browser URL parsing and serialization rules.",
        "searchAliases": [
          "WHATWG URL",
          "URL standard",
          "browser URL parsing"
        ],
        "searchKeywords": [
          "URL",
          "standard",
          "developer reference"
        ]
      },
      {
        "resourceId": "res_website_whatwg-url-standard",
        "locale": "zh-CN",
        "name": "WHATWG URL Standard",
        "summary": "现代浏览器 URL 解析与序列化行为所依据的持续更新标准。",
        "seoTitle": "WHATWG URL Standard 参考 | GoDeskHub",
        "seoDescription": "收藏 WHATWG URL Standard，用于核对浏览器 URL 解析与序列化规则。",
        "searchAliases": [
          "WHATWG URL",
          "URL 标准",
          "浏览器 URL 解析"
        ],
        "searchKeywords": [
          "URL",
          "标准",
          "开发参考"
        ]
      },
      {
        "resourceId": "res_website_whatwg-url-standard",
        "locale": "zh-TW",
        "name": "WHATWG URL Standard",
        "summary": "現代瀏覽器 URL 解析與序列化行為所依據的持續更新標準。",
        "seoTitle": "WHATWG URL Standard 參考 | GoDeskHub",
        "seoDescription": "收藏 WHATWG URL Standard，用於核對瀏覽器 URL 解析與序列化規則。",
        "searchAliases": [
          "WHATWG URL",
          "URL 標準",
          "瀏覽器 URL 解析"
        ],
        "searchKeywords": [
          "URL",
          "標準",
          "開發參考"
        ]
      }
    ],
    "relations": [],
    "resources": [
      {
        "schemaVersion": "0.1.0",
        "id": "res_ai-skill-browser-console-error-triage",
        "canonicalSlug": "browser-console-error-triage",
        "status": "published",
        "createdAt": "2026-08-13T00:00:00.000Z",
        "updatedAt": "2026-08-13T00:00:00.000Z",
        "type": "ai-skill",
        "useCases": [
          "Turn a browser console error and a short reproduction path into a focused debugging checklist.",
          "Separate network, rendering, hydration, and user-input validation problems before changing code."
        ],
        "inputRequirements": [
          "The exact visible error text or stack excerpt.",
          "The page path, browser, and steps that trigger the problem.",
          "Relevant source excerpts with private values removed."
        ],
        "outputResults": [
          "A short diagnosis tree with the most likely failure category first.",
          "Minimal reproduction checks and targeted test suggestions."
        ],
        "steps": [
          "Paste the error text and the smallest reproduction path.",
          "Ask the AI to group possible causes by evidence instead of guessing.",
          "Run the first targeted check locally before modifying code.",
          "Record any confirmed defect under the project task workflow."
        ],
        "riskNotes": [
          "Do not paste user content, browser cookies, private account data, or production-only values.",
          "Treat the AI output as a triage aid; verify the failing path with local tests or browser inspection."
        ]
      },
      {
        "schemaVersion": "0.1.0",
        "id": "res_ai-skill-code-review-checklist",
        "canonicalSlug": "code-review-checklist",
        "status": "published",
        "createdAt": "2026-08-13T00:00:00.000Z",
        "updatedAt": "2026-08-13T00:00:00.000Z",
        "type": "ai-skill",
        "useCases": [
          "Review a pull request for correctness, privacy, accessibility, and test coverage.",
          "Convert broad review concerns into actionable, file-specific comments."
        ],
        "inputRequirements": [
          "A concise summary of the change.",
          "Relevant diffs or file excerpts that do not contain secrets.",
          "The project rules or acceptance criteria that should guide the review."
        ],
        "outputResults": [
          "A prioritized review checklist grouped by correctness, privacy, accessibility, and maintainability.",
          "Specific review comments with severity and suggested fixes."
        ],
        "steps": [
          "Provide the change summary, acceptance criteria, and selected diff context.",
          "Ask the AI to identify blocking issues before style suggestions.",
          "Verify each comment against the actual code before posting it publicly.",
          "Keep private task details out of public review comments."
        ],
        "riskNotes": [
          "Do not paste secrets, private task briefs, real user data, passwords, or API tokens.",
          "AI review output is advisory; run the real test suite and inspect the diff yourself."
        ]
      },
      {
        "schemaVersion": "0.1.0",
        "id": "res_ai-skill-localization-copy-checker",
        "canonicalSlug": "localization-copy-checker",
        "status": "published",
        "createdAt": "2026-08-13T00:00:00.000Z",
        "updatedAt": "2026-08-13T00:00:00.000Z",
        "type": "ai-skill",
        "useCases": [
          "Check whether English, Simplified Chinese, and Traditional Chinese product copy describe the same behavior.",
          "Find missing labels, inconsistent terms, and locale-specific wording that could confuse users."
        ],
        "inputRequirements": [
          "The source English copy and the localized variants.",
          "A short description of the actual product behavior.",
          "Any naming terms that must remain stable across locales."
        ],
        "outputResults": [
          "A locale-by-locale consistency report.",
          "Suggested edits that preserve product meaning and avoid unsupported claims."
        ],
        "steps": [
          "Provide the copy in grouped language blocks.",
          "Ask the AI to compare meaning before style.",
          "Review terms that affect privacy, calculation limits, or user actions.",
          "Apply only edits that match the actual interface."
        ],
        "riskNotes": [
          "Do not paste private roadmap text, user messages, or unpublished acceptance documents.",
          "Do not let the AI add features, guarantees, or policy claims that the product does not implement."
        ]
      },
      {
        "schemaVersion": "0.1.0",
        "id": "res_ai-skill-privacy-safe-summarizer",
        "canonicalSlug": "privacy-safe-summarizer",
        "status": "published",
        "createdAt": "2026-08-13T00:00:00.000Z",
        "updatedAt": "2026-08-13T00:00:00.000Z",
        "type": "ai-skill",
        "useCases": [
          "Summarize notes, research, or product feedback after removing sensitive details.",
          "Create a public-safe summary from private working material."
        ],
        "inputRequirements": [
          "Redacted source notes or a sanitized excerpt.",
          "The intended audience and the level of detail required.",
          "A list of details that must stay private."
        ],
        "outputResults": [
          "A concise summary that preserves useful decisions while excluding sensitive material.",
          "A short list of removed or generalized private details for review."
        ],
        "steps": [
          "Redact names, access material, private URLs, customer data, and confidential numbers before prompting.",
          "Ask the AI to summarize only from provided evidence and mark unknowns clearly.",
          "Review the output for accidental leakage before publishing or sharing.",
          "Keep the original private notes in a local or approved private system."
        ],
        "riskNotes": [
          "Never paste raw private keys, personal data, sign-in data, private financial records, or confidential source text.",
          "A privacy-safe summary still needs human review before external publication."
        ]
      },
      {
        "schemaVersion": "0.1.0",
        "id": "res_ai-skill-prompt-brief-refiner",
        "canonicalSlug": "prompt-brief-refiner",
        "status": "published",
        "createdAt": "2026-08-13T00:00:00.000Z",
        "updatedAt": "2026-08-13T00:00:00.000Z",
        "type": "ai-skill",
        "useCases": [
          "Turn a rough request into an implementation-ready brief.",
          "Separate scope, non-goals, acceptance criteria, assumptions, and risks before implementation starts."
        ],
        "inputRequirements": [
          "A rough goal or feature request.",
          "Known constraints such as languages, platforms, privacy limits, or deadlines.",
          "Any examples of desired or undesired output."
        ],
        "outputResults": [
          "A structured brief with goal, scope, non-scope, acceptance criteria, risks, and open questions.",
          "A concise handoff prompt that can be reviewed before implementation."
        ],
        "steps": [
          "Paste the rough request into your AI assistant.",
          "Ask it to identify missing decisions and separate scope from non-scope.",
          "Review the generated brief and remove private details before sharing it.",
          "Use the reviewed brief as the approved task source or implementation input."
        ],
        "riskNotes": [
          "Do not paste private keys, private customer data, sign-in data, unpublished access material, or sensitive business plans.",
          "Review assumptions carefully; the AI may invent requirements if the original request is vague."
        ]
      },
      {
        "schemaVersion": "0.1.0",
        "id": "res_guide_ip-subnet-basics",
        "canonicalSlug": "ip-subnet-basics",
        "status": "published",
        "createdAt": "2026-08-13T00:00:00.000Z",
        "updatedAt": "2026-08-13T00:00:00.000Z",
        "type": "guide"
      },
      {
        "schemaVersion": "0.1.0",
        "id": "res_guide_local-data-tool-safety",
        "canonicalSlug": "local-data-tool-safety",
        "status": "published",
        "createdAt": "2026-08-13T00:00:00.000Z",
        "updatedAt": "2026-08-13T00:00:00.000Z",
        "type": "guide"
      },
      {
        "schemaVersion": "0.1.0",
        "id": "res_tool_area-converter",
        "canonicalSlug": "area-converter",
        "status": "published",
        "createdAt": "2026-08-11T00:00:00.000Z",
        "updatedAt": "2026-08-11T00:00:00.000Z",
        "type": "tool",
        "toolBindingId": "area-converter",
        "primaryCategoryId": "cat_units"
      },
      {
        "schemaVersion": "0.1.0",
        "id": "res_tool_base64-encoder-decoder",
        "canonicalSlug": "base64-encoder-decoder",
        "status": "published",
        "createdAt": "2026-08-11T00:00:00.000Z",
        "updatedAt": "2026-08-11T00:00:00.000Z",
        "type": "tool",
        "toolBindingId": "base64-encoder-decoder",
        "primaryCategoryId": "cat_developer"
      },
      {
        "schemaVersion": "0.1.0",
        "id": "res_tool_bmi-calculator",
        "canonicalSlug": "bmi-calculator",
        "status": "published",
        "createdAt": "2026-08-11T00:00:00.000Z",
        "updatedAt": "2026-08-11T00:00:00.000Z",
        "type": "tool",
        "toolBindingId": "bmi-calculator",
        "primaryCategoryId": "cat_calculators"
      },
      {
        "schemaVersion": "0.1.0",
        "id": "res_tool_cheque-amount-converter",
        "canonicalSlug": "cheque-amount-converter",
        "status": "published",
        "createdAt": "2026-08-11T00:00:00.000Z",
        "updatedAt": "2026-08-11T00:00:00.000Z",
        "type": "tool",
        "toolBindingId": "cheque-amount-converter",
        "primaryCategoryId": "cat_calculators"
      },
      {
        "schemaVersion": "0.1.0",
        "id": "res_tool_color-converter",
        "canonicalSlug": "color-converter",
        "status": "published",
        "createdAt": "2026-08-11T00:00:00.000Z",
        "updatedAt": "2026-08-11T00:00:00.000Z",
        "type": "tool",
        "toolBindingId": "color-converter",
        "primaryCategoryId": "cat_developer"
      },
      {
        "schemaVersion": "0.1.0",
        "id": "res_tool_compound-interest-calculator",
        "canonicalSlug": "compound-interest-calculator",
        "status": "published",
        "createdAt": "2026-08-11T00:00:00.000Z",
        "updatedAt": "2026-08-11T00:00:00.000Z",
        "type": "tool",
        "toolBindingId": "compound-interest-calculator",
        "primaryCategoryId": "cat_calculators"
      },
      {
        "schemaVersion": "0.1.0",
        "id": "res_tool_data-storage-converter",
        "canonicalSlug": "data-storage-converter",
        "status": "published",
        "createdAt": "2026-08-11T00:00:00.000Z",
        "updatedAt": "2026-08-11T00:00:00.000Z",
        "type": "tool",
        "toolBindingId": "data-storage-converter",
        "primaryCategoryId": "cat_units"
      },
      {
        "schemaVersion": "0.1.0",
        "id": "res_tool_date-interval-calculator",
        "canonicalSlug": "date-interval-calculator",
        "status": "published",
        "createdAt": "2026-08-11T00:00:00.000Z",
        "updatedAt": "2026-08-11T00:00:00.000Z",
        "type": "tool",
        "toolBindingId": "date-interval-calculator",
        "primaryCategoryId": "cat_calculators"
      },
      {
        "schemaVersion": "0.1.0",
        "id": "res_tool_discount-calculator",
        "canonicalSlug": "discount-calculator",
        "status": "published",
        "createdAt": "2026-08-11T00:00:00.000Z",
        "updatedAt": "2026-08-11T00:00:00.000Z",
        "type": "tool",
        "toolBindingId": "discount-calculator",
        "primaryCategoryId": "cat_calculators"
      },
      {
        "schemaVersion": "0.1.0",
        "id": "res_tool_ip-lookup",
        "canonicalSlug": "ip-lookup",
        "status": "hidden",
        "createdAt": "2026-08-11T00:00:00.000Z",
        "updatedAt": "2026-08-11T00:00:00.000Z",
        "type": "tool",
        "toolBindingId": "ip-info",
        "primaryCategoryId": "cat_network-ip"
      },
      {
        "schemaVersion": "0.1.0",
        "id": "res_tool_ip-whois-rdap",
        "canonicalSlug": "ip-whois-rdap",
        "status": "hidden",
        "createdAt": "2026-08-11T00:00:00.000Z",
        "updatedAt": "2026-08-11T00:00:00.000Z",
        "type": "tool",
        "toolBindingId": "ip-rdap",
        "primaryCategoryId": "cat_network-ip"
      },
      {
        "schemaVersion": "0.1.0",
        "id": "res_tool_ipv4-network-toolbox",
        "canonicalSlug": "ipv4-network-toolbox",
        "status": "published",
        "createdAt": "2026-08-11T00:00:00.000Z",
        "updatedAt": "2026-08-11T00:00:00.000Z",
        "type": "tool",
        "toolBindingId": "ipv4-network-toolbox",
        "primaryCategoryId": "cat_network-ip"
      },
      {
        "schemaVersion": "0.1.0",
        "id": "res_tool_ipv6-toolbox",
        "canonicalSlug": "ipv6-toolbox",
        "status": "published",
        "createdAt": "2026-08-11T00:00:00.000Z",
        "updatedAt": "2026-08-11T00:00:00.000Z",
        "type": "tool",
        "toolBindingId": "ipv6-toolbox",
        "primaryCategoryId": "cat_network-ip"
      },
      {
        "schemaVersion": "0.1.0",
        "id": "res_tool_irr-calculator",
        "canonicalSlug": "irr-calculator",
        "status": "published",
        "createdAt": "2026-08-11T00:00:00.000Z",
        "updatedAt": "2026-08-11T00:00:00.000Z",
        "type": "tool",
        "toolBindingId": "irr-calculator",
        "primaryCategoryId": "cat_calculators"
      },
      {
        "schemaVersion": "0.1.0",
        "id": "res_tool_json-tools",
        "canonicalSlug": "json-tools",
        "status": "published",
        "createdAt": "2026-08-11T00:00:00.000Z",
        "updatedAt": "2026-08-11T00:00:00.000Z",
        "type": "tool",
        "toolBindingId": "json-tools",
        "primaryCategoryId": "cat_developer"
      },
      {
        "schemaVersion": "0.1.0",
        "id": "res_tool_length-converter",
        "canonicalSlug": "length-converter",
        "status": "published",
        "createdAt": "2026-08-11T00:00:00.000Z",
        "updatedAt": "2026-08-11T00:00:00.000Z",
        "type": "tool",
        "toolBindingId": "length-converter",
        "primaryCategoryId": "cat_units"
      },
      {
        "schemaVersion": "0.1.0",
        "id": "res_tool_password-generator",
        "canonicalSlug": "password-generator",
        "status": "published",
        "createdAt": "2026-08-11T00:00:00.000Z",
        "updatedAt": "2026-08-11T00:00:00.000Z",
        "type": "tool",
        "toolBindingId": "password-generator",
        "primaryCategoryId": "cat_developer"
      },
      {
        "schemaVersion": "0.1.0",
        "id": "res_tool_percentage-calculator",
        "canonicalSlug": "percentage-calculator",
        "status": "published",
        "createdAt": "2026-08-11T00:00:00.000Z",
        "updatedAt": "2026-08-11T00:00:00.000Z",
        "type": "tool",
        "toolBindingId": "percentage-calculator",
        "primaryCategoryId": "cat_calculators"
      },
      {
        "schemaVersion": "0.1.0",
        "id": "res_tool_qr-code-generator",
        "canonicalSlug": "qr-code-generator",
        "status": "published",
        "createdAt": "2026-08-11T00:00:00.000Z",
        "updatedAt": "2026-08-11T00:00:00.000Z",
        "type": "tool",
        "toolBindingId": "qr-code-generator",
        "primaryCategoryId": "cat_qr"
      },
      {
        "schemaVersion": "0.1.0",
        "id": "res_tool_speed-converter",
        "canonicalSlug": "speed-converter",
        "status": "published",
        "createdAt": "2026-08-11T00:00:00.000Z",
        "updatedAt": "2026-08-11T00:00:00.000Z",
        "type": "tool",
        "toolBindingId": "speed-converter",
        "primaryCategoryId": "cat_units"
      },
      {
        "schemaVersion": "0.1.0",
        "id": "res_tool_temperature-converter",
        "canonicalSlug": "temperature-converter",
        "status": "published",
        "createdAt": "2026-08-11T00:00:00.000Z",
        "updatedAt": "2026-08-11T00:00:00.000Z",
        "type": "tool",
        "toolBindingId": "temperature-converter",
        "primaryCategoryId": "cat_units"
      },
      {
        "schemaVersion": "0.1.0",
        "id": "res_tool_text-case-converter",
        "canonicalSlug": "text-case-converter",
        "status": "published",
        "createdAt": "2026-08-11T00:00:00.000Z",
        "updatedAt": "2026-08-11T00:00:00.000Z",
        "type": "tool",
        "toolBindingId": "text-case-converter",
        "primaryCategoryId": "cat_developer"
      },
      {
        "schemaVersion": "0.1.0",
        "id": "res_tool_time-converter",
        "canonicalSlug": "time-converter",
        "status": "published",
        "createdAt": "2026-08-11T00:00:00.000Z",
        "updatedAt": "2026-08-11T00:00:00.000Z",
        "type": "tool",
        "toolBindingId": "time-converter",
        "primaryCategoryId": "cat_units"
      },
      {
        "schemaVersion": "0.1.0",
        "id": "res_tool_timestamp-converter",
        "canonicalSlug": "timestamp-converter",
        "status": "published",
        "createdAt": "2026-08-11T00:00:00.000Z",
        "updatedAt": "2026-08-11T00:00:00.000Z",
        "type": "tool",
        "toolBindingId": "timestamp-converter",
        "primaryCategoryId": "cat_developer"
      },
      {
        "schemaVersion": "0.1.0",
        "id": "res_tool_url-encoder-decoder",
        "canonicalSlug": "url-encoder-decoder",
        "status": "published",
        "createdAt": "2026-08-11T00:00:00.000Z",
        "updatedAt": "2026-08-11T00:00:00.000Z",
        "type": "tool",
        "toolBindingId": "url-encoder-decoder",
        "primaryCategoryId": "cat_developer"
      },
      {
        "schemaVersion": "0.1.0",
        "id": "res_tool_uuid-generator",
        "canonicalSlug": "uuid-generator",
        "status": "published",
        "createdAt": "2026-08-11T00:00:00.000Z",
        "updatedAt": "2026-08-11T00:00:00.000Z",
        "type": "tool",
        "toolBindingId": "uuid-generator",
        "primaryCategoryId": "cat_developer"
      },
      {
        "schemaVersion": "0.1.0",
        "id": "res_tool_volume-converter",
        "canonicalSlug": "volume-converter",
        "status": "published",
        "createdAt": "2026-08-11T00:00:00.000Z",
        "updatedAt": "2026-08-11T00:00:00.000Z",
        "type": "tool",
        "toolBindingId": "volume-converter",
        "primaryCategoryId": "cat_units"
      },
      {
        "schemaVersion": "0.1.0",
        "id": "res_tool_weight-converter",
        "canonicalSlug": "weight-converter",
        "status": "published",
        "createdAt": "2026-08-11T00:00:00.000Z",
        "updatedAt": "2026-08-11T00:00:00.000Z",
        "type": "tool",
        "toolBindingId": "weight-converter",
        "primaryCategoryId": "cat_units"
      },
      {
        "schemaVersion": "0.1.0",
        "id": "res_tool_word-counter",
        "canonicalSlug": "word-counter",
        "status": "published",
        "createdAt": "2026-08-11T00:00:00.000Z",
        "updatedAt": "2026-08-11T00:00:00.000Z",
        "type": "tool",
        "toolBindingId": "word-counter",
        "primaryCategoryId": "cat_developer"
      },
      {
        "schemaVersion": "0.1.0",
        "id": "res_website_rfc-editor",
        "canonicalSlug": "rfc-editor",
        "status": "published",
        "createdAt": "2026-08-13T00:00:00.000Z",
        "updatedAt": "2026-08-13T00:00:00.000Z",
        "type": "website",
        "destinationUrl": "https://www.rfc-editor.org/"
      },
      {
        "schemaVersion": "0.1.0",
        "id": "res_website_whatwg-url-standard",
        "canonicalSlug": "whatwg-url-standard",
        "status": "published",
        "createdAt": "2026-08-13T00:00:00.000Z",
        "updatedAt": "2026-08-13T00:00:00.000Z",
        "type": "website",
        "destinationUrl": "https://url.spec.whatwg.org/"
      }
    ],
    "tags": [
      {
        "schemaVersion": "0.1.0",
        "slug": "finance",
        "status": "published",
        "id": "tag_finance"
      },
      {
        "schemaVersion": "0.1.0",
        "slug": "hidden-capability",
        "status": "hidden",
        "id": "tag_hidden-capability"
      },
      {
        "schemaVersion": "0.1.0",
        "slug": "network",
        "status": "published",
        "id": "tag_network"
      },
      {
        "schemaVersion": "0.1.0",
        "slug": "private",
        "status": "published",
        "id": "tag_private"
      }
    ]
  },
  "checksum": "sha256-9f0cf35c54e3db07c406d810753dcb4462d80b6addd4587baf0cf9696e95f6f1"
}
;
