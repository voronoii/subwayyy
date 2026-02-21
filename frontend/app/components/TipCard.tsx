interface TipCardProps {
  text: string;
}

export default function TipCard({ text }: TipCardProps) {
  return (
    <div className="tip-card">
      <div className="tip-t">💡 알고 계셨나요?</div>
      <div className="tip-b">{text}</div>
    </div>
  );
}
