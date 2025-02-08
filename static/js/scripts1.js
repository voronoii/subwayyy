function saveReceiptAsImage() {
    const receiptElement = document.querySelector('.receipt-box'); 
    
    html2canvas(receiptElement).then(canvas => {
        const imageData = canvas.toDataURL('image/png');
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        
        if (isIOS) {
            const newWindowLink = document.createElement('a');
            newWindowLink.href = imageData;
            newWindowLink.innerText = "여기를 클릭하여 이미지를 저장하세요";
            newWindowLink.style.display = 'block';
            newWindowLink.style.marginTop = '20px';
            newWindowLink.style.color = '#007bff';
            newWindowLink.style.textDecoration = 'underline';
            newWindowLink.target = "_blank";

            document.querySelector('.receipt-box').appendChild(newWindowLink);
            alert("이미지를 길게 눌러 카메라 롤에 저장할 수 있습니다.");
        } else {
            const downloadLink = document.createElement('a');
            downloadLink.href = imageData;
            downloadLink.download = 'nutrition_receipt.png';
            downloadLink.click();
        }
    });
}

function openReceipt() {
    document.getElementById("receiptOverlay").style.display = "flex";
    document.body.style.overflow = "hidden";

    document.getElementById("receipt-weight").innerText = document.getElementById("weight").innerText;
    document.getElementById("receipt-calories").innerText = document.getElementById("calories").innerText;
    document.getElementById("receipt-protein").innerText = document.getElementById("protein").innerText;
    document.getElementById("receipt-saturated-fat").innerText = document.getElementById("saturated-fat").innerText;
    document.getElementById("receipt-sugars").innerText = document.getElementById("sugars").innerText;
    document.getElementById("receipt-sodium").innerText = document.getElementById("sodium").innerText;

    const receiptSelectedItems = document.getElementById("receipt-selected-items");
    receiptSelectedItems.innerHTML = "";
    const selectedItemsCategories = ["selected-sandwiches", "selected-salads", "selected-breads", "selected-cheeses", 
    "selected-toppings", "selected-sauces", "selected-sides"];
    

    selectedItemsCategories.forEach(categoryId => {
        const selectedItems = getSelectedItems(categoryId);
        selectedItems.forEach(item => {
            const listItem = document.createElement("li");
            listItem.textContent = item;
            receiptSelectedItems.appendChild(listItem);
        });
    });
}

function closeReceipt() {
    document.getElementById("receiptOverlay").style.display = "none";
    document.body.style.overflow = "auto";
}

function showNotification() {
    var notification = document.getElementById("notification");
    notification.classList.add("show");
    setTimeout(function() {
        notification.classList.remove("show");
    }, 1000);
}

function addItem(selectId, listId) {
    var select = document.getElementById(selectId);
    var selectedItem = select.options[select.selectedIndex].value;
    if (!document.getElementById(selectedItem)) {
        var list = document.getElementById(listId);
        var listItem = document.createElement("li");
        
        listItem.id = selectedItem;
        listItem.innerHTML = selectedItem + ' <button onclick="removeItem(\'' + selectedItem + '\')"> 삭제 </button>';
        list.appendChild(listItem);
        showNotification(); 
    }
}

function removeItem(itemId) {
    var listItem = document.getElementById(itemId);
    listItem.parentNode.removeChild(listItem);
}

function calculateNutrition() {
    var selectedSandwiches = getSelectedItems("selected-sandwiches");
    var selectedSalads = getSelectedItems("selected-salads");
    var selectedBreads = getSelectedItems("selected-breads");
    var selectedCheeses = getSelectedItems("selected-cheeses");
    var selectedToppings = getSelectedItems("selected-toppings");
    var selectedSauces = getSelectedItems("selected-sauces");
    var selectedSides = getSelectedItems("selected-sides");

    fetch('/calculate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            selected_sandwiches: selectedSandwiches,
            selected_salads: selectedSalads,
            selected_breads: selectedBreads,
            selected_cheeses: selectedCheeses,
            selected_toppings: selectedToppings,
            selected_sauces: selectedSauces,
            selected_sides: selectedSides
        })
    }).then(response => response.json())
      .then(data => {
          document.getElementById("weight").innerText = parseFloat(data["중량 (g)"]).toFixed(1) + "g";
          document.getElementById("calories").innerText = parseFloat(data["열량 (kcal)"]).toFixed(1) + "kcal";
          document.getElementById("protein").innerText = parseFloat(data["단백질 (g)"]).toFixed(1) + "g";
          document.getElementById("saturated-fat").innerText = parseFloat(data["포화지방 (g)"]).toFixed(1) + "g";
          document.getElementById("sugars").innerText = parseFloat(data["당류 (g)"]).toFixed(1) + "g";
          document.getElementById("sodium").innerText = parseFloat(data["나트륨 (mg)"]).toFixed(1) + "mg";
      });   
}

function getSelectedItems(listId) {
    var selectedItems = [];
    var list = document.getElementById(listId).children;
    for (var i = 0; i < list.length; i++) {
        selectedItems.push(list[i].id);
    }
    return selectedItems;
}

(function() {
    var analytics = document.createElement('script');
    analytics.src = 'https://cdn.vercel-insights.com/v1/script.tag';
    analytics.async = true;
    analytics.defer = true;
    document.head.appendChild(analytics);
})();

