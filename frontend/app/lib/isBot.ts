// 방문자 카운팅에서 봇/크롤러를 제외하기 위한 서버측 User-Agent 판별.
// JS를 실행하지 않는 대부분의 봇은 애초에 카운팅 엔드포인트에 도달하지 않지만,
// 헤드리스 브라우저·프리렌더·SEO/AI 크롤러 등 JS를 실행하는 봇을 걸러낸다.
const BOT_UA =
  /bot\b|bot\/|crawl|spider|slurp|mediapartners|facebookexternalhit|embedly|quora link preview|outbrain|pinterest|slackbot|vkshare|w3c_validator|redditbot|applebot|whatsapp|telegram|flipboard|tumblr|bitlybot|skypeuripreview|nuzzel|discord|qwantify|chrome-lighthouse|lighthouse|google page speed|google-inspectiontool|googleother|headless|phantomjs|playwright|puppeteer|selenium|ahrefs|semrush|mj12|dotbot|petalbot|bytespider|dataforseo|serpstat|gptbot|oai-searchbot|chatgpt|ccbot|claudebot|claude-web|anthropic|amazonbot|perplexity|python-requests|axios|node-fetch|curl|wget|okhttp|go-http-client|java\/|libwww|scrapy/i;

/**
 * 방문자 카운트에서 제외할 요청인지 판별한다.
 * User-Agent가 비어 있으면(정상 브라우저는 항상 UA를 보냄) 스크립트/봇으로 간주해 제외한다.
 */
export function isBot(userAgent: string | null | undefined): boolean {
  if (!userAgent) return true;
  return BOT_UA.test(userAgent);
}
