/**
 * LLM が返すテキストから JSON オブジェクトを抽出する。
 * コードフェンスや JSON 末尾の説明文、文字列値内の未エスケープ `"` などを許容する。
 */
export function extractJsonFromLlmText(text: string): unknown {
  const trimmed = text.trim();
  const fenceMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenceMatch ? fenceMatch[1].trim() : trimmed;

  return parseJsonCandidate(candidate);
}

function parseJsonCandidate(candidate: string): unknown {
  try {
    return JSON.parse(candidate);
  } catch {
    const objectText = extractFirstJsonObject(candidate);
    try {
      return JSON.parse(objectText);
    } catch {
      return JSON.parse(
        stripTrailingCommas(repairUnescapedQuotesInJsonStrings(objectText)),
      );
    }
  }
}

/**
 * 文字列「値」内の未エスケープ引用符（例: "Hi!"）を修復する。キー名は変更しない。
 */
export function repairUnescapedQuotesInJsonStrings(text: string): string {
  let result = "";
  let inString = false;
  let stringIsValue = false;
  let escaped = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    if (!inString) {
      if (char === '"') {
        const before = result.trimEnd();
        stringIsValue = before.endsWith(":");
        inString = true;
      }
      result += char;
      continue;
    }

    if (escaped) {
      result += char;
      escaped = false;
      continue;
    }

    if (char === "\\") {
      result += char;
      escaped = true;
      continue;
    }

    if (char === '"') {
      if (!stringIsValue) {
        result += char;
        inString = false;
        continue;
      }

      const rest = text.slice(i + 1).trimStart();
      if (
        rest.startsWith(",") ||
        rest.startsWith("}") ||
        rest.startsWith("]") ||
        rest.startsWith("\n") ||
        rest.startsWith("\r")
      ) {
        result += char;
        inString = false;
        stringIsValue = false;
      } else {
        result += '\\"';
      }
      continue;
    }

    if (stringIsValue && (char === "\n" || char === "\r")) {
      result += "\\n";
      continue;
    }

    result += char;
  }

  return result;
}

function stripTrailingCommas(text: string): string {
  return text.replace(/,\s*([}\]])/g, "$1");
}

function extractFirstJsonObject(text: string): string {
  const start = text.indexOf("{");
  if (start === -1) {
    throw new SyntaxError("No JSON object found in LLM response");
  }

  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let i = start; i < text.length; i++) {
    const char = text[i];

    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (char === "\\") {
        escaped = true;
      } else if (char === '"') {
        inString = false;
      }
      continue;
    }

    if (char === '"') {
      inString = true;
      continue;
    }

    if (char === "{") depth++;
    if (char === "}") {
      depth--;
      if (depth === 0) {
        return text.slice(start, i + 1);
      }
    }
  }

  throw new SyntaxError("Incomplete JSON object in LLM response");
}
