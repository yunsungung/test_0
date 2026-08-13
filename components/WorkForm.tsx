"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { DESCRIPTION_MAX, PERIOD_MAX, TITLE_MAX } from "@/lib/works";

/**
 * 작업물을 추가하는 폼입니다.
 *
 * 여기서 보내는 값은 서버(app/api/works/route.ts)에서 한 번 더 검사합니다.
 * 브라우저 쪽 검사는 사용자가 건너뛸 수 있기 때문입니다.
 */
export function WorkForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [period, setPeriod] = useState("");
  const [description, setDescription] = useState("");
  const [tagText, setTagText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSubmit() {
    setSaving(true);
    setError(null);

    try {
      const response = await fetch("/api/works", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          period,
          description,
          tags: tagText.split(",").map((tag) => tag.trim()),
        }),
      });

      if (!response.ok) {
        const data: unknown = await response.json().catch(() => null);
        const message =
          typeof data === "object" && data !== null && typeof (data as { error?: unknown }).error === "string"
            ? (data as { error: string }).error
            : "저장하지 못했습니다.";
        setError(message);
        return;
      }

      setTitle("");
      setPeriod("");
      setDescription("");
      setTagText("");
      // 서버에서 목록을 다시 읽어 화면을 갱신합니다.
      router.refresh();
    } catch {
      setError("서버에 연결하지 못했습니다.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="card">
      <h2 className="card-title">작업물 추가</h2>
      <p className="card-hint">추가한 내용은 데이터베이스에 저장됩니다.</p>

      <form
        className="form"
        onSubmit={(event) => {
          event.preventDefault();
          void handleSubmit();
        }}
      >
        <label className="field">
          <span className="field-label">제목</span>
          <input
            className="field-input"
            maxLength={TITLE_MAX}
            onChange={(event) => setTitle(event.target.value)}
            required
            value={title}
          />
        </label>

        <label className="field">
          <span className="field-label">기간</span>
          <input
            className="field-input"
            maxLength={PERIOD_MAX}
            onChange={(event) => setPeriod(event.target.value)}
            placeholder="2026"
            required
            value={period}
          />
        </label>

        <label className="field">
          <span className="field-label">설명</span>
          <textarea
            className="field-input"
            maxLength={DESCRIPTION_MAX}
            onChange={(event) => setDescription(event.target.value)}
            required
            rows={2}
            value={description}
          />
        </label>

        <label className="field">
          <span className="field-label">태그</span>
          <input
            className="field-input"
            onChange={(event) => setTagText(event.target.value)}
            placeholder="쉼표로 구분 (예: Next.js, PostgreSQL)"
            value={tagText}
          />
        </label>

        {error !== null && (
          <p className="field-error" role="alert">
            {error}
          </p>
        )}

        <button className="form-button" disabled={saving} type="submit">
          {saving ? "저장 중..." : "추가하기"}
        </button>
      </form>
    </section>
  );
}
