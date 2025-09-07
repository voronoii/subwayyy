from flask import Flask, request, render_template, jsonify, send_from_directory, session, redirect, url_for
from api.nutrition_data import sandwich_nutrition, bread_nutrition, cheese_nutrition, sub_sauce_nutrition, sub_salad_nutrition
from api.nutrition_data import sides_nutrition, sub_topping_nutrition
from api.nutrition_salady import salads_nutrition, warmbowls_nutrition, protein_boxes_nutrition, sand_wraps_nutrition, beverages_nutrition,  dressings_nutrition, toppings_nutrition, sides_soups_nutrition
from api.nutrition_poke import poke_nutrition, additional_topping_nutrition, sauce_nutrition, base_nutrition
from datetime import date, datetime, timezone, timedelta
import requests
from apscheduler.schedulers.background import BackgroundScheduler
from dotenv import load_dotenv
import os
from datetime import date
# load_dotenv() 


app = Flask(__name__)

if os.getenv("VERCEL") is None:  # Vercel이 아닌 경우만 .env 사용
    from dotenv import load_dotenv
    load_dotenv()

app.secret_key = os.getenv("SECRET_KEY", "default_secret_key")




def round_nutrition(nutrition):
    return {key: round(value, 2) for key, value in nutrition.items()}



# 기존 URL에서 새 URL로 리디렉션
@app.route('/', methods=['GET', 'POST'])
def index():
    return redirect(url_for('calculator_subway'), code=301)

@app.route('/salady')
def salady():
    return redirect(url_for('calculator_salady'), code=301)
    
@app.route('/poke')
def poke():
    return redirect(url_for('calculator_poke'), code=301)
    
@app.route('/update', methods=['GET', 'POST'])
def test():
    return render_template('update.html')

# 새로운 개선된 URL 구조
@app.route('/calculator/subway')
def calculator_subway():
    return render_template('index.html', sandwiches=sandwich_nutrition, salads=sub_salad_nutrition, breads=bread_nutrition, 
                           cheeses=cheese_nutrition, sauces=sub_sauce_nutrition, sides=sides_nutrition, toppings=sub_topping_nutrition)

@app.route('/calculator/salady')
def calculator_salady():
    return render_template('salady.html', salads=salads_nutrition, warmbowls=warmbowls_nutrition, protein_boxes=protein_boxes_nutrition, 
                           sand_wraps=sand_wraps_nutrition, beverages=beverages_nutrition, dressings=dressings_nutrition, toppings=toppings_nutrition,
                           sides_soups=sides_soups_nutrition)

@app.route('/calculator/poke')
def calculator_poke():
    return render_template('poke.html', pokes=poke_nutrition, bases=base_nutrition, toppings=additional_topping_nutrition, sauces=sauce_nutrition)

@app.route('/calculate_salady', methods=['POST'])
def calculate_salady():
    # 요청된 모든 선택된 항목들을 받아옴
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

    # 각 항목에 대해 영양 성분을 누적합산
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

# 새로운 API 엔드포인트 구조
@app.route('/api/calculate/subway', methods=['POST'])
def api_calculate_subway():
    selected_sandwiches = request.json.get('selected_sandwiches', [])
    selected_salads = request.json.get('selected_salads', [])
    selected_breads = request.json.get('selected_breads', [])
    selected_cheeses = request.json.get('selected_cheeses', [])
    selected_toppings = request.json.get('selected_toppings', [])
    selected_sauces = request.json.get('selected_sauces', [])
    selected_sides = request.json.get('selected_sides', [])   

    total_nutrition = {'중량 (g)': 0, '열량 (kcal)': 0, '단백질 (g)': 0, '포화지방 (g)': 0, '당류 (g)': 0, '나트륨 (mg)': 0}

    for sandwich in selected_sandwiches:
        nutrition = sandwich_nutrition[sandwich]
        for key in total_nutrition:
            total_nutrition[key] -= bread_nutrition["위트"][key]
        for key in total_nutrition:
            total_nutrition[key] += nutrition[key] 
            
    for salad in selected_salads:
        nutrition = sub_salad_nutrition[salad]
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
            
    for topping in selected_toppings:
        nutrition = sub_topping_nutrition[topping]
        for key in total_nutrition:
            total_nutrition[key] += nutrition[key]  

    for sauce in selected_sauces:
        nutrition = sub_sauce_nutrition[sauce]
        for key in total_nutrition:
            total_nutrition[key] += nutrition[key]
            
    for side in selected_sides:
        nutrition = sides_nutrition[side]
        for key in total_nutrition:
            total_nutrition[key] += nutrition[key]

    total_nutrition = round_nutrition(total_nutrition)
    return jsonify(total_nutrition)

@app.route('/api/calculate/salady', methods=['POST'])
def api_calculate_salady():
    # 요청된 모든 선택된 항목들을 받아옴
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

    # 각 항목에 대해 영양 성분을 누적합산
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

@app.route('/api/calculate/poke', methods=['POST'])
def api_calculate_poke():
    selected_pokes = request.json.get('selected_pokes', [])
    selected_add_toppings = request.json.get('selected_add_toppings', [])
    selected_sauces = request.json.get('selected_sauces', [])
    selected_bases = request.json.get('selected_bases', [])

    total_nutrition = {'원재료 용량(g)': 0,
        '열량(kcal)': 0, '탄수화물(g)': 0, '당류(g)': 0, '단백질(g)': 0,
        '지방(g)': 0, '포화지방(g)': 0, '나트륨(mg)': 0
    }

    for category, selected_items, nutrition_data in [
        ('poke', selected_pokes, poke_nutrition),
        ('base', selected_bases, base_nutrition),
        ('topping', selected_add_toppings, additional_topping_nutrition),
        ('sauce', selected_sauces, sauce_nutrition),
    ]:
        for item in selected_items:
            nutrition = nutrition_data.get(item.strip(), {})
            for key in total_nutrition.keys():
                total_nutrition[key] += float(nutrition.get(key.strip(), 0))  
    total_nutrition = round_nutrition(total_nutrition)
    return jsonify(total_nutrition)

@app.route('/calculate_poke', methods=['POST'])
def calculate_poke():
    selected_pokes = request.json.get('selected_pokes', [])
    selected_add_toppings = request.json.get('selected_add_toppings', [])
    selected_sauces = request.json.get('selected_sauces', [])
    selected_bases = request.json.get('selected_bases', [])

    total_nutrition = {'원재료 용량(g)': 0,
        '열량(kcal)': 0, '탄수화물(g)': 0, '당류(g)': 0, '단백질(g)': 0,
        '지방(g)': 0, '포화지방(g)': 0, '나트륨(mg)': 0
    }

    
    for category, selected_items, nutrition_data in [
        ('poke', selected_pokes, poke_nutrition),
        ('base', selected_bases, base_nutrition),
        ('topping', selected_add_toppings, additional_topping_nutrition),
        ('sauce', selected_sauces, sauce_nutrition),
    ]:
        for item in selected_items:
            nutrition = nutrition_data.get(item.strip(), {})
            for key in total_nutrition.keys():
                total_nutrition[key] += float(nutrition.get(key.strip(), 0))  
    total_nutrition = round_nutrition(total_nutrition)
    return jsonify(total_nutrition)



@app.route('/calculate', methods=['POST'])
def calculate():
    selected_sandwiches = request.json.get('selected_sandwiches', [])
    selected_salads = request.json.get('selected_salads', [])
    selected_breads = request.json.get('selected_breads', [])
    selected_cheeses = request.json.get('selected_cheeses', [])
    selected_toppings = request.json.get('selected_toppings', [])

    selected_sauces = request.json.get('selected_sauces', [])
    selected_sides = request.json.get('selected_sides', [])   
    

    total_nutrition = {'중량 (g)': 0, '열량 (kcal)': 0, '단백질 (g)': 0, '포화지방 (g)': 0, '당류 (g)': 0, '나트륨 (mg)': 0}

    for sandwich in selected_sandwiches:
        nutrition = sandwich_nutrition[sandwich]

        for key in total_nutrition:
            total_nutrition[key] -= bread_nutrition["위트"][key]
        
        for key in total_nutrition:
            total_nutrition[key] += nutrition[key] 
            
    for salad in selected_salads:
        nutrition = sub_salad_nutrition[salad]
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
            
    for topping in selected_toppings:
        nutrition = sub_topping_nutrition[topping]
        for key in total_nutrition:
            total_nutrition[key] += nutrition[key]  

    for sauce in selected_sauces:
        nutrition = sub_sauce_nutrition[sauce]
        for key in total_nutrition:
            total_nutrition[key] += nutrition[key]
            
    for side in selected_sides:
        nutrition = sides_nutrition[side]
        for key in total_nutrition:
            total_nutrition[key] += nutrition[key]

    total_nutrition = round_nutrition(total_nutrition)
    return jsonify(total_nutrition)



url = 'https://helloo-world.tistory.com/rss'
import feedparser

posts_ = feedparser.parse(url)['entries']
posts = []
for p in posts_:
    if 'tags' in p.keys():
        if '내돈내산'==p['tags'][0]['term'] or '맛집탐방' == p['tags'][0]['term']:
            posts.append(p)

@app.route('/board')
def board():
    return render_template('board.html', posts=posts)

# 개별 게시물 페이지
from html import unescape
from flask import render_template, abort

@app.route('/board/post/<int:post_id>')
def post(post_id):
    if 0 <= post_id < len(posts):
        post = posts[post_id]
        
        if 'description' in post:
            post['description'] = unescape(post['description'])

        return render_template('post.html', post=post)
    else:
      
        abort(404) 



from flask import redirect, url_for

messages = ['테스트입니다.', '두번째테스트.']
@app.route("/guestbook", methods=["GET", "POST"])
def guestbook():
    global messages
    if request.method == "POST":
        message = request.form.get("message")
        if message and len(message) <= 100:  # 100자 제한
            messages.insert(0, message)  # 최신 메시지가 맨 위로
        return redirect("/guestbook")
    return render_template("guestbook.html", messages=messages)


   
if __name__ == '__main__':
    app.run(debug=True)
