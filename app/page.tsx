import { AppHeader } from "@/components/AppHeader";
import { DeployInfo } from "@/components/DeployInfo";
import { ProjectInfo } from "@/components/ProjectInfo";
import { WorkForm } from "@/components/WorkForm";
import { WorkList } from "@/components/WorkList";
import { env } from "@/lib/env";
import { project } from "@/lib/project";
import type { Work } from "@/lib/works";
import { listWorks } from "@/lib/works-db";

// 새로고침할 때마다 서버가 화면을 다시 만들게 합니다.
// 이렇게 해야 아래 "서버 시각" 이 매번 갱신되고, 작업물 목록도 최신 상태로 읽힙니다.
export const dynamic = "force-dynamic";

const introduction =
  "사내 업무 도구를 만들며 배운 것을 기록하고 있습니다. 필요한 만큼만 만들고, 만든 것은 끝까지 굴려 보는 편입니다.";

const links: { label: string; href: string }[] = [
  { label: "GitHub", href: "https://github.com/yunsungung" },
  { label: "이메일", href: "mailto:me@yuns-portfolio.com" },
];

export default async function Home() {
  const serverTime = new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "long",
    timeStyle: "medium",
    timeZone: "Asia/Seoul",
  }).format(new Date());

  // DB 가 아직 안 떠 있으면 화면 전체가 오류로 바뀝니다.
  // 무엇을 하면 되는지 안내하려고 여기서 받아 둡니다.
  let works: Work[] | null = null;
  try {
    works = await listWorks();
  } catch {
    works = null;
  }

  return (
    <main className="page">
      <AppHeader
        name={project.name}
        description={project.description}
        status={`실행 중 · ${env.nodeEnv}`}
      />

      <section className="card">
        <h2 className="card-title">소개</h2>
        <p className="intro">{introduction}</p>
      </section>

      {works === null ? (
        <section className="card">
          <h2 className="card-title">데이터베이스에 연결하지 못했습니다</h2>
          <p className="card-hint">
            아래 명령으로 데이터베이스를 켠 뒤 새로고침하세요.
          </p>
          <pre className="code-block">
            docker compose up -d db{"\n"}
            npm run dev
          </pre>
        </section>
      ) : (
        <>
          <WorkList works={works} />
          <WorkForm />
        </>
      )}

      <section className="card">
        <h2 className="card-title">연락처</h2>
        <p className="card-hint">아래 주소로 연락하면 됩니다.</p>
        <ul className="tag-list">
          {links.map((link) => (
            <li key={link.label}>
              <a className="link" href={link.href}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </section>

      <DeployInfo serverTime={serverTime} nodeEnv={env.nodeEnv} />

      <ProjectInfo project={project} />

      <footer className="footer">
        <p>
          동작 확인용 주소:{" "}
          <a className="link" href="/api/health">
            /api/health
          </a>
        </p>
        <p>
          작업을 끝내기 전에 터미널에서 <code>npm run check</code> 를 실행하세요.
        </p>
      </footer>
    </main>
  );
}
