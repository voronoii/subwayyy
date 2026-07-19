const FEEDBACK_URL =
  "https://helloo-world.tistory.com/entry/%EC%9C%A4%EB%8B%AC%EB%B2%A0%EC%9D%B4%EC%BB%A4%EB%A6%AC-%EC%98%81%EC%96%91%EC%84%B1%EB%B6%84-%EC%B6%94%EA%B0%80";

export default function FeedbackButton() {
  return (
    <a
      className="fb-btn"
      href={FEEDBACK_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="의견 제안하기"
    >
      <span aria-hidden="true">💬</span>
      <span className="fb-tip" role="tooltip">
        의견이나 하실 말씀이 있다면
      </span>
    </a>
  );
}
