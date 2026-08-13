/**
 * 작업물의 형태와 입력값 검사입니다.
 *
 * 이 파일은 데이터베이스를 건드리지 않습니다. 그래서 브라우저 쪽 코드(WorkForm)에서도
 * 가져다 쓸 수 있습니다. SQL 은 lib/works-db.ts 에 있습니다.
 */
export type Work = {
  id: number;
  title: string;
  period: string;
  description: string;
  tags: string[];
};

/** 새로 넣을 작업물입니다. id 는 DB 가 정합니다. */
export type NewWork = Omit<Work, "id">;

export const TITLE_MAX = 60;
export const PERIOD_MAX = 20;
export const DESCRIPTION_MAX = 200;
export const TAG_MAX = 20;
export const TAG_COUNT_MAX = 5;

/**
 * 화면이나 API 로 들어온 값이 쓸 수 있는 형태인지 확인합니다.
 * 브라우저 쪽 검사는 사용자가 얼마든지 건너뛸 수 있으므로 서버에서 다시 봅니다.
 */
export function parseNewWork(input: unknown): { work: NewWork } | { error: string } {
  if (typeof input !== "object" || input === null) {
    return { error: "요청 내용을 읽을 수 없습니다." };
  }

  const raw = input as Record<string, unknown>;

  const title = readText(raw.title, "제목", TITLE_MAX);
  if ("error" in title) return title;

  const period = readText(raw.period, "기간", PERIOD_MAX);
  if ("error" in period) return period;

  const description = readText(raw.description, "설명", DESCRIPTION_MAX);
  if ("error" in description) return description;

  const tags = readTags(raw.tags);
  if ("error" in tags) return tags;

  return {
    work: {
      title: title.value,
      period: period.value,
      description: description.value,
      tags: tags.value,
    },
  };
}

function readText(
  value: unknown,
  label: string,
  max: number,
): { value: string } | { error: string } {
  if (typeof value !== "string") {
    return { error: `${label}을(를) 입력하세요.` };
  }

  const trimmed = value.trim();

  if (trimmed === "") {
    return { error: `${label}을(를) 입력하세요.` };
  }
  if (trimmed.length > max) {
    return { error: `${label}은(는) ${max}자를 넘을 수 없습니다.` };
  }
  return { value: trimmed };
}

function readTags(value: unknown): { value: string[] } | { error: string } {
  if (value === undefined || value === null) {
    return { value: [] };
  }
  if (!Array.isArray(value)) {
    return { error: "태그 형식이 올바르지 않습니다." };
  }

  const tags: string[] = [];

  for (const item of value) {
    if (typeof item !== "string") {
      return { error: "태그 형식이 올바르지 않습니다." };
    }
    const trimmed = item.trim();
    if (trimmed === "") {
      continue;
    }
    if (trimmed.length > TAG_MAX) {
      return { error: `태그는 ${TAG_MAX}자를 넘을 수 없습니다.` };
    }
    if (!tags.includes(trimmed)) {
      tags.push(trimmed);
    }
  }

  if (tags.length > TAG_COUNT_MAX) {
    return { error: `태그는 ${TAG_COUNT_MAX}개까지 넣을 수 있습니다.` };
  }
  return { value: tags };
}
