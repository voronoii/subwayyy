// 공통 JavaScript 함수들 최적화
function showNotification() {
    const notification = document.getElementById("notification");
    if (notification) {
        notification.classList.add("show");
        setTimeout(() => {
            notification.classList.remove("show");
        }, 1000);
    }
}

function addItem(selectId, listId) {
    const select = document.getElementById(selectId);
    const selectedItem = select.options[select.selectedIndex].value;
    if (!document.getElementById(selectedItem)) {
        const list = document.getElementById(listId);
        const listItem = document.createElement("li");
        listItem.id = selectedItem;
        listItem.innerHTML = selectedItem + ' <button onclick="removeItem(\'' + selectedItem + '\')">삭제</button>';
        list.appendChild(listItem);
        showNotification();
    }
}

function removeItem(itemId) {
    const listItem = document.getElementById(itemId);
    if (listItem && listItem.parentNode) {
        listItem.parentNode.removeChild(listItem);
    }
}

function getSelectedItems(listId) {
    const selectedItems = [];
    const list = document.getElementById(listId);
    if (list) {
        const children = list.children;
        for (let i = 0; i < children.length; i++) {
            selectedItems.push(children[i].id);
        }
    }
    return selectedItems;
}

// 영수증 기능
function openReceipt() {
    const receiptOverlay = document.getElementById("receiptOverlay");
    if (receiptOverlay) {
        receiptOverlay.style.display = "flex";
        document.body.style.overflow = "hidden";
        updateReceiptData();
    }
}

function closeReceipt() {
    const receiptOverlay = document.getElementById("receiptOverlay");
    if (receiptOverlay) {
        receiptOverlay.style.display = "none";
        document.body.style.overflow = "auto";
    }
}

function updateReceiptData() {
    // 영양 성분 업데이트
    const nutritionFields = ["weight", "calories", "protein", "saturated-fat", "sugars", "sodium"];
    nutritionFields.forEach(field => {
        const sourceElement = document.getElementById(field);
        const targetElement = document.getElementById(`receipt-${field}`);
        if (sourceElement && targetElement) {
            targetElement.innerText = sourceElement.innerText;
        }
    });

    // 선택한 항목 리스트 업데이트
    const receiptSelectedItems = document.getElementById("receipt-selected-items");
    if (receiptSelectedItems) {
        receiptSelectedItems.innerHTML = "";
        const selectedItemsCategories = ["selected-sandwiches", "selected-salads", "selected-breads", 
                                        "selected-cheeses", "selected-toppings", "selected-sauces", "selected-sides"];
        
        selectedItemsCategories.forEach(categoryId => {
            const selectedItems = getSelectedItems(categoryId);
            selectedItems.forEach(item => {
                const listItem = document.createElement("li");
                listItem.textContent = item;
                receiptSelectedItems.appendChild(listItem);
            });
        });
    }
}

// 이미지 저장 기능
function saveReceiptAsImage() {
    const receiptElement = document.querySelector('.receipt-box');
    if (receiptElement && window.html2canvas) {
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

                receiptElement.appendChild(newWindowLink);
                alert("이미지를 길게 눌러 카메라 롤에 저장할 수 있습니다.");
            } else {
                const downloadLink = document.createElement('a');
                downloadLink.href = imageData;
                downloadLink.download = 'nutrition_receipt.png';
                downloadLink.click();
            }
        });
    }
}