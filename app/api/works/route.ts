import { parseNewWork } from "@/lib/works";
import { addWork, listWorks } from "@/lib/works-db";

export async function GET() {
  const works = await listWorks();
  return Response.json({ works });
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "요청 내용을 읽을 수 없습니다." }, { status: 400 });
  }

  const parsed = parseNewWork(body);

  if ("error" in parsed) {
    return Response.json({ error: parsed.error }, { status: 400 });
  }

  const work = await addWork(parsed.work);
  return Response.json({ work }, { status: 201 });
}
