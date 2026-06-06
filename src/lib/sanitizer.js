const SANITIZE_CONFIGS = {
  text: {
    allowedTags: [],
    stripAll: true,
  },

  rich: {
    allowedTags: ["p", "strong", "br", "em", "ul", "li", "ol", "i"],
    stripAll: false,
  },
};

export function sanitizeHTML(html, type = "text") {
  if (!html || typeof html !== "string") return "";

  const config = SANITIZE_CONFIGS[type] || SANITIZE_CONFIGS.text;

  if (config.stripAll) {
    return stripAllHTML(html);
  }

  return stripUnsafeHTML(html, config.allowedTags);
}

function stripAllHTML(html) {
  let cleaned = Html.replace(
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    "",
  )
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "");

  cleaned = cleaned
    .replace(/<[^>]*>/g, "")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .trim();

  return cleaned;
}

function stripUnsafeHTML(html, allowedTags) {
  let cleaned = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, "")
    .replace(/<embed[^>]*>/gi, "")
    .replace(/<link[^>]*>/gi, "")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
    .replace(/<meta[^>]*>/gi, "")
    .replace(/<base[^>]*>/gi, "");

  cleaned = cleaned.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, "");
  cleaned = cleaned.replace(/\s*on\w+\s*=\s*[^\s>]*/gi, "");

  cleaned = cleaned.replace(/javascript:/gi, "");

  cleaned = cleaned.replace(/\s*data\s*:\s*text\/html[^"']*/gi, "");

  if (!allowedTags || allowedTags.length === 0) {
    return stripAllHTML(cleaned);
  }

  const allowedPattern = allowedTags.join("|");

  const tagRegex = new RegExp(
    `<\\/?(?!(?:${allowedPattern})(?:\\s|>|\\/|$))[^>]*>`,
    "gi",
  );

  cleaned = cleaned.replace(tagRegex, "");

  cleaned = cleaned.replace(/<(\w+)[^>]*>/gi, "<$1>");

  cleaned = cleaned.replace(/\s+/g, " ").trim();

  return cleaned;
}
