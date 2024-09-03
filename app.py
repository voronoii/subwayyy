from flask import Flask, request, render_template, jsonify, send_from_directory
from api.nutrition_data import sandwich_nutrition, bread_nutrition, cheese_nutrition, sauce_nutrition
from api.nutrition_data import sides_nutrition
from datetime import date, datetime, timezone, timedelta

app = Flask(__name__)
visit_log = []

@app.route('/robots.txt')
def robots_txt():
    return send_from_directory(app.static_folder, 'robots.txt')

@app.route('/sitemap.xml')
def sitemap_xml():
    return send_from_directory(app.static_folder, 'sitemap.xml')

def round_nutrition(nutrition):
    return {key: round(value, 2) for key, value in nutrition.items()}

@app.route('/', methods=['GET', 'POST'])
def index():
    return render_template('index.html', sandwiches=sandwich_nutrition, breads=bread_nutrition, 
                           cheeses=cheese_nutrition, sauces=sauce_nutrition, sides=sides_nutrition)

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
