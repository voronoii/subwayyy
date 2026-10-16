import { savingsStructuredData, type SavingsPage } from "../lib/seo";

export default function SavingsPageSchema({ page }: { page: SavingsPage }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(savingsStructuredData(page)).replace(/</g, "\\u003c"),
      }}
    />
  );
}
