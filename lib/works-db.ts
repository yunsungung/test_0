/**
 * 작업물의 SQL 은 전부 여기에 있습니다.
 *
 * 값은 반드시 $1, $2 자리표시자로 넘깁니다. 문자열로 이어 붙이면 SQL 주입에 뚫립니다.
 * 이 파일은 서버에서만 씁니다. 브라우저 쪽 코드에서 가져오지 마세요.
 */
import { query } from "@/lib/db";
import type { NewWork, Work } from "@/lib/works";

/**
 * 테이블을 만듭니다. 마이그레이션 도구가 없으므로 첫 사용 때 한 번 실행합니다.
 * 프로미스를 재사용해 여러 요청이 동시에 들어와도 한 번만 돌게 합니다.
 */
const globalForSchema = globalThis as unknown as { __workSchema?: Promise<void> };

function ensureSchema(): Promise<void> {
  if (!globalForSchema.__workSchema) {
    globalForSchema.__workSchema = query(`
      CREATE TABLE IF NOT EXISTS work (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        period TEXT NOT NULL,
        description TEXT NOT NULL,
        tags TEXT[] NOT NULL DEFAULT '{}',
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `).then(() => undefined);
  }
  return globalForSchema.__workSchema;
}

/** 최근에 넣은 것부터 돌려줍니다. */
export async function listWorks(): Promise<Work[]> {
  await ensureSchema();
  return query<Work>(
    "SELECT id, title, period, description, tags FROM work ORDER BY created_at DESC, id DESC",
  );
}

export async function addWork(work: NewWork): Promise<Work> {
  await ensureSchema();
  const rows = await query<Work>(
    `INSERT INTO work (title, period, description, tags)
     VALUES ($1, $2, $3, $4)
     RETURNING id, title, period, description, tags`,
    [work.title, work.period, work.description, work.tags],
  );
  return rows[0];
}
