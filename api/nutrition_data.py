# nutrition_data.py

sandwich_nutrition = {
    
    '쉬림프 아보카도' : {'weight(g)': 161,
 'calories(kcal)': 105,
 'protein(g)': 8.499999999999998,
 'saturated fat(g)': 0.8999999999999999,
 'sugars(g)': 3.0999999999999996,
 'sodium(mg)': 247},
    '로스트 치킨 아보카도' : {'weight(g)': 189,
 'calories(kcal)': 164,
 'protein(g)': 18.200000000000003,
 'saturated fat(g)': 1.6,
 'sugars(g)': 4,
 'sodium(mg)': 437},
    '에그 슬라이스 아보카도' : {'weight(g)': 166,
 'calories(kcal)': 143,
 'protein(g)': 7.299999999999999,
 'saturated fat(g)': 2.6,
 'sugars(g)': 2.9000000000000004,
 'sodium(mg)': 279},
    
    '에그 슬라이스': {'weight(g)': 136, 'calories(kcal)': 87, 'protein(g)': 6.8, 'saturated fat(g)': 1.8, 'sugars(g)': 2.6, 'sodium(mg)': 190},
    '이탈리안 비엠티 썹픽': {'weight(g)': 200, 'calories(kcal)': 356, 'protein(g)': 13.6, 'saturated fat(g)': 8.8, 'sugars(g)': 5.4, 'sodium(mg)': 1343},
    '스테이크&치즈 썹픽': {'weight(g)': 199, 'calories(kcal)': 315, 'protein(g)': 17.8, 'saturated fat(g)': 5.9, 'sugars(g)': 2.1, 'sodium(mg)': 837},
    '로티세리 바비큐 치킨 썹픽': {'weight(g)': 195, 'calories(kcal)': 271, 'protein(g)': 20.5, 'saturated fat(g)': 5.1, 'sugars(g)': 4.6, 'sodium(mg)': 704},
    '스테이크 & 치즈': {'weight(g)': 167, 'calories(kcal)': 163, 'protein(g)': 19.7, 'saturated fat(g)': 3.7, 'sugars(g)': 3.8, 'sodium(mg)': 523},
    '치킨 베이컨 아보카도': {'weight(g)': 168, 'calories(kcal)': 163, 'protein(g)': 11.8, 'saturated fat(g)': 2.7, 'sugars(g)': 4.0, 'sodium(mg)': 683},
    '스파이시 쉬림프': {'weight(g)': 135, 'calories(kcal)': 53, 'protein(g)': 8.1, 'saturated fat(g)': 0.4, 'sugars(g)': 4.1, 'sodium(mg)': 313},
    '쉬림프': {'weight(g)': 131, 'calories(kcal)': 49, 'protein(g)': 7.9, 'saturated fat(g)': 0.1, 'sugars(g)': 2.9, 'sodium(mg)': 158},
    '로스트 치킨': {'weight(g)': 159, 'calories(kcal)': 108, 'protein(g)': 17.6, 'saturated fat(g)': 0.8, 'sugars(g)': 3.7, 'sodium(mg)': 348},
    '로티세리 바비큐 치킨': {'weight(g)': 171, 'calories(kcal)': 135, 'protein(g)': 20.7, 'saturated fat(g)': 2.0, 'sugars(g)': 2.8, 'sodium(mg)': 285},
    'K-바비큐': {'weight(g)': 178, 'calories(kcal)': 180, 'protein(g)': 17.2, 'saturated fat(g)': 1.6, 'sugars(g)': 9.7, 'sodium(mg)': 642},
    '풀드 포크 바비큐': {'weight(g)': 157, 'calories(kcal)': 135, 'protein(g)': 16.4, 'saturated fat(g)': 1.6, 'sugars(g)': 2.8, 'sodium(mg)': 432},
    '써브웨이 클럽': {'weight(g)': 138, 'calories(kcal)': 107, 'protein(g)': 11.4, 'saturated fat(g)': 1.9, 'sugars(g)': 3.53, 'sodium(mg)': 596},
    '치킨 데리야끼': {'weight(g)': 177, 'calories(kcal)': 122, 'protein(g)': 18.1, 'saturated fat(g)': 0.7, 'sugars(g)': 5.1, 'sodium(mg)': 441},
    '스파이시 이탈리안': {'weight(g)': 146, 'calories(kcal)': 272, 'protein(g)': 12.3, 'saturated fat(g)': 8.6, 'sugars(g)': 3.7, 'sodium(mg)': 993},
    '이탈리안 비엠티': {'weight(g)': 150, 'calories(kcal)': 196, 'protein(g)': 12.6, 'saturated fat(g)': 5.4, 'sugars(g)': 3.6, 'sodium(mg)': 807},
    '비엘티': {'weight(g)': 104, 'calories(kcal)': 108, 'protein(g)': 7.5, 'saturated fat(g)': 3.2, 'sugars(g)': 2.9, 'sodium(mg)': 409},
    '치킨 슬라이스': {'weight(g)': 143, 'calories(kcal)': 73, 'protein(g)': 10.2, 'saturated fat(g)': 0.4, 'sugars(g)': 3.7, 'sodium(mg)': 494},
    '참치': {'weight(g)': 160, 'calories(kcal)': 124, 'protein(g)': 18.5, 'saturated fat(g)': 0.9, 'sugars(g)': 2.6, 'sodium(mg)': 278},
    '햄': {'weight(g)': 142, 'calories(kcal)': 70, 'protein(g)': 10.6, 'saturated fat(g)': 0.5, 'sugars(g)': 3.4, 'sodium(mg)': 423},
    '에그마요': {'weight(g)': 160, 'calories(kcal)': 224, 'protein(g)': 8.0, 'saturated fat(g)': 4.3, 'sugars(g)': 2.7, 'sodium(mg)': 297},
    '베지': {'weight(g)': 86, 'calories(kcal)': 17, 'protein(g)': 0.8, 'saturated fat(g)': 0.1, 'sugars(g)': 2.6, 'sodium(mg)': 5}
}



bread_nutrition = {
    "화이트": {'weight(g)': 71, 'calories(kcal)': 202, 'protein(g)': 6.1, 'saturated fat(g)': 0.3, 'sugars(g)': 2.8, 'sodium(mg)': 343},
    "위트": {'weight(g)': 78, 'calories(kcal)': 192, 'protein(g)': 8.4, 'saturated fat(g)': 0.5, 'sugars(g)': 5, 'sodium(mg)': 257},
    "하티": {'weight(g)': 75, 'calories(kcal)': 210, 'protein(g)': 7, 'saturated fat(g)': 1, 'sugars(g)': 3, 'sodium(mg)': 340},
    "파마산 오레가노": {'weight(g)': 74.5, 'calories(kcal)': 213, 'protein(g)': 6.3, 'saturated fat(g)': 0.4, 'sugars(g)': 3.2, 'sodium(mg)': 489},
    "허니오트": {'weight(g)': 88.6, 'calories(kcal)': 235, 'protein(g)': 8.8, 'saturated fat(g)': 0.6, 'sugars(g)': 9.3, 'sodium(mg)': 306},
    "플랫브레드": {'weight(g)': 172, 'calories(kcal)': 467, 'protein(g)': 16.2, 'saturated fat(g)': 1.7, 'sugars(g)': 3.9, 'sodium(mg)': 936}
}

cheese_nutrition = {
    "아메리칸치즈": {'weight(g)': 10, 'calories(kcal)': 35, 'protein(g)': 1.8, 'saturated fat(g)': 1.9, 'sugars(g)': 0.4, 'sodium(mg)': 193},
    "모차렐라치즈": {'weight(g)': 14, 'calories(kcal)': 44, 'protein(g)': 2.8, 'saturated fat(g)': 2.1, 'sugars(g)': 0.2, 'sodium(mg)': 82.3},
    "슈레드치즈": {'weight(g)': 14, 'calories(kcal)': 54, 'protein(g)': 3.2, 'saturated fat(g)': 2.4, 'sugars(g)': 0, 'sodium(mg)': 84.7}
}

sauce_nutrition = {
    "머스타드": {'weight(g)': 21, 'calories(kcal)': 15.3, 'protein(g)': 1.1, 'saturated fat(g)': 0.1, 'sugars(g)': 0.2, 'sodium(mg)': 193},
    "레드 와인 식초": {'weight(g)': 3.5, 'calories(kcal)': 0.7, 'protein(g)': 0, 'saturated fat(g)': 0, 'sugars(g)': 0, 'sodium(mg)': 0},
    "스모크 바베큐": {'weight(g)': 21, 'calories(kcal)': 32.8, 'protein(g)': 0.2, 'saturated fat(g)': 0.1, 'sugars(g)': 7, 'sodium(mg)': 132},
    "허니 머스타드": {'weight(g)': 21, 'calories(kcal)': 38.4, 'protein(g)': 0.4, 'saturated fat(g)': 0.4, 'sugars(g)': 6.3, 'sodium(mg)': 145},
    "스위트 칠리": {'weight(g)': 21, 'calories(kcal)': 40, 'protein(g)': 0.1, 'saturated fat(g)': 0, 'sugars(g)': 9.2, 'sodium(mg)': 163},
    "스위트 어니언": {'weight(g)': 21, 'calories(kcal)': 40.1, 'protein(g)': 0.1, 'saturated fat(g)': 0, 'sugars(g)': 8.2, 'sodium(mg)': 81.7},
    "핫 칠리": {'weight(g)': 21, 'calories(kcal)': 41.8, 'protein(g)': 0.2, 'saturated fat(g)': 0.1, 'sugars(g)': 5.3, 'sodium(mg)': 180},
    "사우스웨스트 치폴레": {'weight(g)': 21, 'calories(kcal)': 96.5, 'protein(g)': 0.4, 'saturated fat(g)': 1.6, 'sugars(g)': 1, 'sodium(mg)': 160},
    "홀스래디쉬": {'weight(g)': 21, 'calories(kcal)': 106, 'protein(g)': 0.3, 'saturated fat(g)': 1.6, 'sugars(g)': 2.6, 'sodium(mg)': 152},
    "랜치": {'weight(g)': 21, 'calories(kcal)': 116, 'protein(g)': 0.3, 'saturated fat(g)': 2.1, 'sugars(g)': 0.6, 'sodium(mg)': 128},
    "올리브 오일": {'weight(g)': 3.5, 'calories(kcal)': 124, 'protein(g)': 0, 'saturated fat(g)': 2.1, 'sugars(g)': 0, 'sodium(mg)': 0},
    "마요네즈": {'weight(g)': 21, 'calories(kcal)': 158, 'protein(g)': 0.3, 'saturated fat(g)': 2.8, 'sugars(g)': 0.1, 'sodium(mg)': 98.1}
}


sides_nutrition = {"콘수프 하프": {'weight(g)': 118, 'calories(kcal)': 81, 'protein(g)': 2.5, 'saturated fat(g)': 1.4, 'sugars(g)': 5.3, 'sodium(mg)': 283},
    "콘수프 레귤러": {'weight(g)': 237, 'calories(kcal)': 163, 'protein(g)': 5.2, 'saturated fat(g)': 2.8, 'sugars(g)': 10.7, 'sodium(mg)': 569},
    "머쉬룸수프 하프": {'weight(g)': 118, 'calories(kcal)': 64, 'protein(g)': 1.5, 'saturated fat(g)': 2.3, 'sugars(g)': 2.2, 'sodium(mg)': 336},
    "머쉬룸수프 레귤러": {'weight(g)': 237, 'calories(kcal)': 129, 'protein(g)': 3.1, 'saturated fat(g)': 4.6, 'sugars(g)': 4.5, 'sodium(mg)': 675},
    "초코칩쿠키": {'weight(g)': 45, 'calories(kcal)': 228, 'protein(g)': 2.1, 'saturated fat(g)': 5.6, 'sugars(g)': 19.3, 'sodium(mg)': 165},
 "오트밀레이즌": {'weight(g)': 45, 'calories(kcal)': 200, 'protein(g)': 2.4, 'saturated fat(g)': 3.8, 'sugars(g)': 15.8, 'sodium(mg)': 130},
    "더블초코칩": {'weight(g)': 45, 'calories(kcal)': 212, 'protein(g)': 2.0, 'saturated fat(g)': 5.4, 'sugars(g)': 19.9, 'sodium(mg)': 165}

}
