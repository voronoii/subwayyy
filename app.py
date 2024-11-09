from flask import Flask, request, render_template, jsonify, send_from_directory
from api.nutrition_data import sandwich_nutrition, bread_nutrition, cheese_nutrition, sauce_nutrition
from api.nutrition_data import sides_nutrition
from api.nutrition_salady import salads_nutrition, warmbowls_nutrition, protein_boxes_nutrition, sand_wraps_nutrition, beverages_nutrition,  dressings_nutrition, toppings_nutrition, sides_soups_nutrition
from datetime import date, datetime, timezone, timedelta
import requests

app = Flask(__name__)
SLACK_WEBHOOK_URL = 'https://hooks.slack.com/services/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'

visit_log = []

@app.route('/robots.txt')
def robots_txt():
    return send_from_directory(app.static_folder, 'robots.txt')

@app.route('/sitemap.xml')
def sitemap_xml():
    return send_from_directory(app.static_folder, 'sitemap.xml')

@app.route('/ads.txt')
def ads_txt():
    return send_from_directory(app.static_folder, 'ads.txt')

def round_nutrition(nutrition):
    return {key: round(value, 2) for key, value in nutrition.items()}

@app.route('/', methods=['GET', 'POST'])
def index():
    return render_template('index.html', sandwiches=sandwich_nutrition, breads=bread_nutrition, 
                           cheeses=cheese_nutrition, sauces=sauce_nutrition, sides=sides_nutrition)

@app.route('/salady')
def salady():
    return render_template('salady.html', salads=salads_nutrition, warmbowls=warmbowls_nutrition, protein_boxes=protein_boxes_nutrition, 
                           sand_wraps=sand_wraps_nutrition, beverages=beverages_nutrition, dressings=dressings_nutrition, toppings=toppings_nutrition,
                           sides_soups=sides_soups_nutrition)
    
@app.route('/test', methods=['GET', 'POST'])
def test():
    return render_template('test.html')

@app.route('/calculate_salady', methods=['POST'])
def calculate_salady():
    # 요청된 모든 선택된 항목들을 받아옵니다.
    selected_salads = request.json.get('selected_salads', [])
    selected_warmbowls = request.json.get('selected_warmbowls', [])
    selected_protein_boxes = request.json.get('selected_protein_boxes', [])
    selected_sand_wraps = request.json.get('selected_sand_wraps', [])
    selected_beverages = request.json.get('selected_beverages', [])
    selected_dressings = request.json.get('selected_dressings', [])
    selected_toppings = request.json.get('selected_toppings', [])
    selected_sides_soups = request.json.get('selected_sides_soups', [])

    # 초기화된 총 영양 성분 딕셔너리
    total_nutrition = {
        '열량(kcal)': 0, '탄수화물(g)': 0, '당류(g)': 0, '단백질(g)': 0,
        '지방(g)': 0, '포화지방(g)': 0, '나트륨(mg)': 0
    }

    # 각 항목에 대해 영양 성분을 누적합산합니다.
    for category, selected_items, nutrition_data in [
        ('salad', selected_salads, salads_nutrition),
        ('warmbowl', selected_warmbowls, warmbowls_nutrition),
        ('protein_box', selected_protein_boxes, protein_boxes_nutrition),
        ('sand_wrap', selected_sand_wraps, sand_wraps_nutrition),
        ('beverage', selected_beverages, beverages_nutrition),
        ('dressing', selected_dressings, dressings_nutrition),
        ('topping', selected_toppings, toppings_nutrition),
        ('side_soup', selected_sides_soups, sides_soups_nutrition)
    ]:
        for item in selected_items:
            nutrition = nutrition_data.get(item, {})
            for key in total_nutrition.keys():
                total_nutrition[key] += float(nutrition.get(key, 0))  # 영양성분을 float로 변환하여 합산

    # 소수점 두 자리로 반올림
    total_nutrition = round_nutrition(total_nutrition)
    return jsonify(total_nutrition)




@app.route('/calculate', methods=['POST'])
def calculate():
    selected_sandwiches = request.json.get('selected_sandwiches', [])
    selected_breads = request.json.get('selected_breads', [])
    selected_cheeses = request.json.get('selected_cheeses', [])
    selected_sauces = request.json.get('selected_sauces', [])
    selected_sides = request.json.get('selected_sides', [])

    total_nutrition = {"weight(g)": 0, "calories(kcal)": 0, "protein(g)": 0, "saturated fat(g)": 0, "sugars(g)": 0, "sodium(mg)": 0}

    for sandwich in selected_sandwiches:
        nutrition = sandwich_nutrition[sandwich]
        
        for key in total_nutrition:
            total_nutrition[key] += nutrition[key]

    for bread in selected_breads:
        nutrition = bread_nutrition[bread]
        for key in total_nutrition:
            total_nutrition[key] += nutrition[key]

    for cheese in selected_cheeses:
        nutrition = cheese_nutrition[cheese]
        for key in total_nutrition:
            total_nutrition[key] += nutrition[key]

    for sauce in selected_sauces:
        nutrition = sauce_nutrition[sauce]
        for key in total_nutrition:
            total_nutrition[key] += nutrition[key]
            
    for side in selected_sides:
        nutrition = sides_nutrition[side]
        for key in total_nutrition:
            total_nutrition[key] += nutrition[key]

    total_nutrition = round_nutrition(total_nutrition)
    print(f"result : ", total_nutrition)
    return jsonify(total_nutrition)


@app.before_request
def log_visitor():
    # 방문자 정보 기록
    visitor_ip = request.remote_addr
    KST = timezone(timedelta(hours=9))
    visit_time = datetime.now(KST)
    
    today = str(date.today())
    time = str(visit_time.time())[:8]
    visit_log.append({'ip': visitor_ip, 'time': f'{today}-{time}'})
    print(f"Visitor IP: {visitor_ip}, Time: {visit_time}")
    
@app.route('/visit_log')
def show_visit_log():
    log_str = '<br>'.join([f"{entry['time']} - {entry['ip']}" for entry in visit_log])
    return f"Visit Log:<br>{log_str}"

   
if __name__ == '__main__':
    app.run(debug=True)
