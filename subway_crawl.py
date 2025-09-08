import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
import os
import time
from collections import deque
import hashlib

class WebsiteCrawler:
    def __init__(self, base_url, output_dir="saved_pages", delay=1):
        """
        웹사이트 크롤러 초기화
        
        Args:
            base_url: 크롤링할 웹사이트의 기본 URL
            output_dir: 페이지를 저장할 디렉토리
            delay: 요청 간 대기 시간 (초)
        """
        self.base_url = base_url
        self.domain = urlparse(base_url).netloc
        self.output_dir = output_dir
        self.delay = delay
        self.visited_urls = set()
        self.to_visit = deque([base_url])
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })
        
        # 출력 디렉토리 생성
        if not os.path.exists(output_dir):
            os.makedirs(output_dir)
    
    def is_valid_url(self, url):
        """URL이 같은 도메인이고 menuView 또는 menuList 경로인지 확인"""
        parsed = urlparse(url)
        if parsed.netloc != self.domain:
            return False
        
        path = parsed.path
        return (path.startswith('/menuView/') or 
                path.startswith('/menuList/') or
                path == '/menuView' or 
                path == '/menuList')
    
    def get_file_path(self, url):
        """URL을 파일 경로로 변환"""
        parsed = urlparse(url)
        path = parsed.path.strip('/')
        
        if not path:
            path = "index"
        
        # 파일 확장자가 없으면 .html 추가
        if '.' not in os.path.basename(path):
            path += '.html'
        
        # URL 파라미터가 있으면 해시로 처리
        if parsed.query:
            hash_obj = hashlib.md5(parsed.query.encode())
            path += '_' + hash_obj.hexdigest()[:8]
        
        return os.path.join(self.output_dir, path.replace('/', os.sep))
    
    def save_page(self, url, content):
        """페이지 내용을 파일로 저장"""
        file_path = self.get_file_path(url)
        
        # 디렉토리 생성
        dir_path = os.path.dirname(file_path)
        if not os.path.exists(dir_path):
            os.makedirs(dir_path)
        
        # HTML 파일 저장
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"저장됨: {file_path}")
    
    def extract_links(self, soup, current_url):
        """페이지에서 모든 링크 추출"""
        links = set()
        
        for tag in soup.find_all(['a', 'link']):
            href = tag.get('href')
            if href:
                # 상대 URL을 절대 URL로 변환
                absolute_url = urljoin(current_url, href)
                
                # 앵커(#) 제거
                absolute_url = absolute_url.split('#')[0]
                
                # 같은 도메인의 URL만 추가
                if self.is_valid_url(absolute_url):
                    links.add(absolute_url)
        
        # menuList 페이지에서 개별 메뉴 아이템의 menuView URL 추출
        if '/menuList/' in current_url:
            menu_items = soup.find_all('a', {'data-category': True, 'data-menuitemidx': True})
            for item in menu_items:
                category = item.get('data-category')
                menu_idx = item.get('data-menuitemidx')
                if category and menu_idx:
                    menu_view_url = f"https://www.subway.co.kr/menuView/{category}?menuItemIdx={menu_idx}"
                    if self.is_valid_url(menu_view_url):
                        links.add(menu_view_url)
        
        return links
    
    def crawl_page(self, url):
        """단일 페이지 크롤링"""
        try:
            print(f"크롤링 중: {url}")
            response = self.session.get(url, timeout=10)
            response.raise_for_status()
            
            # HTML 내용만 처리
            if 'text/html' in response.headers.get('Content-Type', ''):
                content = response.text
                soup = BeautifulSoup(content, 'html.parser')
                
                # 페이지 저장
                self.save_page(url, content)
                
                # 링크 추출
                links = self.extract_links(soup, url)
                
                # 방문하지 않은 링크를 큐에 추가
                for link in links:
                    if link not in self.visited_urls and link not in self.to_visit:
                        self.to_visit.append(link)
                
                return True
            
        except requests.RequestException as e:
            print(f"오류 발생 ({url}): {e}")
            return False
        
        return False
    
    def crawl(self, max_pages=None):
        """웹사이트 전체 크롤링"""
        pages_crawled = 0
        
        print(f"크롤링 시작: {self.base_url}")
        print(f"저장 위치: {self.output_dir}")
        print("-" * 50)
        
        while self.to_visit:
            if max_pages and pages_crawled >= max_pages:
                print(f"\n최대 페이지 수({max_pages})에 도달했습니다.")
                break
            
            url = self.to_visit.popleft()
            
            if url not in self.visited_urls:
                self.visited_urls.add(url)
                
                if self.crawl_page(url):
                    pages_crawled += 1
                    print(f"진행 상황: {pages_crawled}개 페이지 크롤링 완료")
                
                # 서버 부하를 줄이기 위한 대기
                time.sleep(self.delay)
        
        print("\n" + "=" * 50)
        print(f"크롤링 완료!")
        print(f"총 {len(self.visited_urls)}개의 URL 방문")
        print(f"총 {pages_crawled}개의 페이지 저장")
    
    def save_sitemap(self):
        """방문한 URL 목록을 사이트맵으로 저장"""
        sitemap_path = os.path.join(self.output_dir, 'sitemap.txt')
        with open(sitemap_path, 'w', encoding='utf-8') as f:
            for url in sorted(self.visited_urls):
                f.write(url + '\n')
        print(f"사이트맵 저장됨: {sitemap_path}")


# 사용 예제
if __name__ == "__main__":
    # 크롤링할 웹사이트 URL 설정 - 메뉴 목록 페이지부터 시작
    website_url = "https://www.subway.co.kr"
    
    # 크롤러 생성
    crawler = WebsiteCrawler(
        base_url=website_url,
        output_dir="saved_pages",  # 저장할 폴더명
        delay=1  # 요청 간 대기 시간 (초)1
    )
    
    # 알려진 메뉴 카테고리 페이지들을 시작점에 추가
    menu_categories = [
        "https://www.subway.co.kr/menuList/sandwich",
        # "https://www.subway.co.kr/menuList/unit", 
        "https://www.subway.co.kr/menuList/salad"
        "https://www.subway.co.kr/menuList/morning",
        "https://www.subway.co.kr/menuList/sidedrink"
    ]
    
    for menu_url in menu_categories:
        if menu_url not in crawler.to_visit:
            crawler.to_visit.append(menu_url)
    
    # 크롤링 시작 (최대 100페이지까지만 크롤링하려면 max_pages=100 설정)
    crawler.crawl(max_pages=None)  # None으로 설정하면 모든 페이지 크롤링
    
    # 사이트맵 저장
    crawler.save_sitemap()