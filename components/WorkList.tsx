import type { Work } from "@/lib/works";

type WorkListProps = {
  works: Work[];
};

export function WorkList({ works }: WorkListProps) {
  return (
    <section className="card">
      <h2 className="card-title">작업물 {works.length}개</h2>
      <p className="card-hint">데이터베이스에서 읽어온 목록입니다.</p>

      {works.length === 0 ? (
        <p className="empty">아직 등록된 작업물이 없습니다. 아래에서 추가하세요.</p>
      ) : (
        <ul className="work-list">
          {works.map((work) => (
            <li className="work-item" key={work.id}>
              <div className="work-head">
                <h3 className="work-title">{work.title}</h3>
                <span className="work-period">{work.period}</span>
              </div>
              <p className="work-description">{work.description}</p>
              {work.tags.length > 0 && (
                <ul className="tag-list">
                  {work.tags.map((tag) => (
                    <li className="tag" key={tag}>
                      {tag}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
