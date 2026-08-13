import { AppHeader } from "@/components/AppHeader";
import { DeployInfo } from "@/components/DeployInfo";
import { ProjectInfo } from "@/components/ProjectInfo";
import { WorkList, type Work } from "@/components/WorkList";
import { env } from "@/lib/env";
import { project } from "@/lib/project";

// 새로고침할 때마다 서버가 화면을 다시 만들게 합니다.
// 이렇게 해야 아래 "서버 시각" 이 매번 갱신되어 배포 상태를 눈으로 확인할 수 있습니다.
export const dynamic = "force-dynamic";

const introduction =
  "사내 업무 도구를 만들며 배운 것을 기록하고 있습니다. 필요한 만큼만 만들고, 만든 것은 끝까지 굴려 보는 편입니다.";

const works: Work[] = [
  {
    title: "오늘 점심 뭐 먹지?",
    period: "2026",
    description: "버튼 한 번으로 점심 메뉴를 골라 주는 사내 도구입니다.",
    tags: ["Next.js", "TypeScript"],
  },
  {
    title: "부서 공지 게시판",
    period: "2026",
    description: "부서별 공지를 한곳에 모아 보여 주는 사내 게시판입니다.",
    tags: ["Next.js", "PostgreSQL"],
  },
  {
    title: "AI 교육 실습 템플릿",
    period: "2026",
    description: "비개발자도 같은 구조로 웹 도구를 만들 수 있게 정리한 템플릿입니다.",
    tags: ["Docker", "GitHub Actions"],
  },
];

const links: { label: string; href: string }[] = [
  { label: "GitHub", href: "https://github.com/yunsungung" },
  { label: "이메일", href: "mailto:me@yuns-portfolio.com" },
];

export default function Home() {
  const serverTime = new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "long",
    timeStyle: "medium",
    timeZone: "Asia/Seoul",
  }).format(new Date());

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

      <WorkList works={works} />

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
