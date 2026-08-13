export type Work = {
  title: string;
  period: string;
  description: string;
  tags: string[];
};

type WorkListProps = {
  works: Work[];
};

export function WorkList({ works }: WorkListProps) {
  return (
    <section className="card">
      <h2 className="card-title">작업물 {works.length}개</h2>
      <p className="card-hint">
        목록을 바꾸려면 <code>app/page.tsx</code> 의 <code>works</code> 를 고치세요.
      </p>
      <ul className="work-list">
        {works.map((work) => (
          <li className="work-item" key={work.title}>
            <div className="work-head">
              <h3 className="work-title">{work.title}</h3>
              <span className="work-period">{work.period}</span>
            </div>
            <p className="work-description">{work.description}</p>
            <ul className="tag-list">
              {work.tags.map((tag) => (
                <li className="tag" key={tag}>
                  {tag}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </section>
  );
}
