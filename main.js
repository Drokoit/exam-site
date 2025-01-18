const apiUrl = "https://edu.std-900.ist.mospolytech.ru/exam-2024-1/api/goods";
const apiKey = "43fc4171-9feb-433b-a328-477a7efd24c3";
const productGrid = document.getElementById("productGrid");
let products = [];  // Массив для хранения всех полученных товаров

// Функция для загрузки всех товаров при загрузке страницы
function loadAllProducts() {
    fetch(apiUrl + "?api_key=" + apiKey)
        .then(response => response.json())
        .then(data => {
            products = data;
            displayAllProducts();
        })
        .catch(error => console.error('Ошибка:', error));
}

// Функция для отображения всех товаров
function displayAllProducts() {
    const productGrid = document.getElementById("productGrid");
    productGrid.innerHTML = '';
    products.forEach(product => {
        const card = createProductCard(product);
        productGrid.appendChild(card);
    });
}

// Функция для обработки ввода пользователя
function handleUserInput(event) {
    const autocompleteList = document.getElementById('autocompleteList');

    // Очищаем список автодополнения
    autocompleteList.innerHTML = '';

    // Формируем запрос к серверу
    const searchTerm = event.target.value;
    const apiUrlWithQuery = `${apiUrl}?api_key=${apiKey}&query=${encodeURIComponent(searchTerm)}`;

    // Отправляем запрос на сервер
    fetch(apiUrlWithQuery)
        .then(response => response.json())
        .then(data => {
            // Формируем список автодополнения
            data.forEach(item => {
                const li = document.createElement('li');
                li.textContent = item.name;
                li.setAttribute('data-id', item.id);
                li.setAttribute('data-name', item.name);
                li.addEventListener('click', () => selectSuggestion(li));
                autocompleteList.appendChild(li);
            });
        })
        .catch(error => console.error('Ошибка:', error));
}

// Функция для выбора варианта из списка автодополнения
function selectSuggestion(element) {
    const searchInput = document.getElementById('searchInput');
    const select = document.getElementById('searchSelect');
    const autocompleteList = document.getElementById('autocompleteList');

    // Заполняем выпадающий список
    select.value = element.getAttribute('data-name');
    autocompleteList.style.display = 'none';

    // Вводим название товара в поле поиска
    searchInput.value = element.getAttribute('data-name');
    searchInput.dispatchEvent(new Event('input')); // Триггерим событие input для обновления списка автодополнения
}

// Обработчик ввода пользователя
document.getElementById('searchInput').addEventListener('input', handleUserInput);

// Обработчик клика по кнопке "Найти"
document.querySelector('.search-btn').addEventListener('click', async () => {
    const searchInput = document.getElementById('searchInput');
    const searchTerm = searchInput.value.trim();

    if (searchTerm) {
        // Очищаем контейнер для товаров
        productGrid.innerHTML = '';

        // Формируем URL запроса
        const searchUrl = `${apiUrl}?api_key=${apiKey}&query=${encodeURIComponent(searchTerm)}`;

        try {
            // Отправляем запрос на сервер
            const response = await fetch(searchUrl);
            const data = await response.json();

            // Создаем карточки товаров
            data.forEach(product => {
                const card = createProductCard(product);
                productGrid.appendChild(card);
            });

            // Обновляем массив продуктов
            products = data;
        } catch (error) {
            console.error('Ошибка при поиске товаров:', error);
            displayErrorMessage('Произошла ошибка при поиске товаров. Попробуйте еще раз.');
        }
    } else {
        displayErrorMessage('Пожалуйста, введите поисковой запрос.');
    }
});

// Функция для создания карточки товара
function createProductCard(product) {
    const card = document.createElement("div");
    card.classList.add("product-card");

    // Сокращение длинных строк (название и описание товара)
    const truncatedName = product.name.length > 50 ? product.name.substring(0, 20) + "..." : product.name;
    
    // Создаем карточку товара с данными
    let priceHtml = '';
    if (product.actual_price === product.discount_price) {
        priceHtml = `<p class="price">Актуальная цена: ${product.actual_price}₽</p>`;
    } else {
        const discountPercentage = Math.round((100 - (product.discount_price/product.actual_price * 100)));
        priceHtml = `
            <p class="original-price">Цена до скидки: ${product.actual_price}₽</p>
            <p class="price">Актуальная цена: ${product.discount_price}₽</p>
            <p class="discount-percentage">Скидка: ${discountPercentage}%</p>
        `;
    }

    card.innerHTML = `
        <img src="${product.image_url}" alt="${product.name}">
        <h3>${truncatedName}</h3>
        <p class="rating">Рейтинг: ${product.rating} / 5</p>
        ${priceHtml}
        <button class="add-to-cart-btn" data-id="${product.id}">Добавить в корзину</button>
    `;

    return card;
}

// Функция для отображения сообщения об ошибке
function displayErrorMessage(message) {
    const errorMessageDiv = document.createElement('div');
    errorMessageDiv.className = 'error-message';
    errorMessageDiv.textContent = message;
    document.body.appendChild(errorMessageDiv);

    setTimeout(() => {
        errorMessageDiv.remove();
    }, 5000); // Удаление сообщения через 5 секунд
}


// Функция для создания карточек товаров
function createProductCards(products) {
    // Очищаем контейнер для товаров перед перерисовкой
    productGrid.innerHTML = '';

    // Создаем карточку для каждого товара
    products.forEach(product => {
        const card = document.createElement("div");
        card.classList.add("product-card");

        // Сокращение длинных строк (название и описание товара)
        const truncatedName = product.name.length > 50 ? product.name.substring(0, 20) + "..." : product.name;
        
        // Создаем карточку товара с данными
        let priceHtml = '';
        if (product.actual_price === product.discount_price) {
            // Если цены совпадают, отображаем только актуальную цену
            priceHtml = `<p class="price">Актуальная цена: ${product.actual_price}₽</p>`;
        } else {
            // Если цены отличаются, отображаем обе цены и процент скидки
            const discountPercentage = Math.round((100 - (product.discount_price/product.actual_price * 100)));
            priceHtml = `
                <p class="original-price">Цена до скидки: ${product.actual_price}₽</p>
                <p class="price">Актуальная цена: ${product.discount_price}₽</p>
                <p class="discount-percentage">Скидка: ${discountPercentage}%</p>
            `;
        }

        card.innerHTML = `
            <img src="${product.image_url}" alt="${product.name}">
            <h3>${truncatedName}</h3>
            <p class="rating">Рейтинг: ${product.rating} / 5</p>
            ${priceHtml}
            <button class="add-to-cart-btn" data-id="${product.id}">Добавить в корзину</button>
        `;

        productGrid.appendChild(card);
    });
}

// Функция для сортировки товаров
function sortProducts(criteria) {
    const productCards = Array.from(document.querySelectorAll(".product-card")); // Получаем все карточки

    productCards.sort((a, b) => {
        const priceA = parseFloat(a.querySelector(".price").textContent.replace("Актуальная цена: ", "").replace("₽", "").trim());
        const priceB = parseFloat(b.querySelector(".price").textContent.replace("Актуальная цена: ", "").replace("₽", "").trim());
        const ratingA = parseFloat(a.querySelector(".rating").textContent.replace("Рейтинг: ", "").replace("/ 5", "").trim()) || 0;
        const ratingB = parseFloat(b.querySelector(".rating").textContent.replace("Рейтинг: ", "").replace("/ 5", "").trim()) || 0;

        if (criteria === "priceLow") return priceA - priceB; // Сортировка по возрастанию цены
        if (criteria === "priceHigh") return priceB - priceA; // Сортировка по убыванию цены
        if (criteria === "ratingHigh") return ratingB - ratingA; // Сортировка по убыванию рейтинга
        if (criteria === "ratingLow") return ratingA - ratingB; // Сортировка по возрастанию рейтинга
    });

    // Обновляем порядок карточек на странице
    productGrid.innerHTML = ""; // Очищаем контейнер
    productCards.forEach(card => productGrid.appendChild(card)); // Добавляем отсортированные карточки
}

// Обработчик изменения выбора сортировки
document.getElementById("sortSelect").addEventListener("change", (event) => {
    const selectedValue = event.target.value;
    sortProducts(selectedValue); // Вызываем сортировку по выбранному критерию
});



// Обработчик кнопки "Добавить в корзину"
productGrid.addEventListener("click", (event) => {
    if (event.target.classList.contains("add-to-cart-btn")) {
        const productId = event.target.dataset.id;
        const productName = event.target.closest('.product-card').querySelector('h3').innerText;
        const productPriceText = event.target.closest('.product-card').querySelector('.price').innerText;
        const productImage = event.target.closest('.product-card').querySelector('img').src;
        const productRating = event.target.closest('.product-card').querySelector('.rating') 
            ? event.target.closest('.product-card').querySelector('.rating').innerText.replace('Рейтинг: ', '').trim() 
            : 0; // Получаем рейтинг из карточки товара

        // Преобразуем цену из текста в число
        const productPrice = parseFloat(productPriceText.replace('Актуальная цена: ', '').replace('₽', '').trim());

        const product = {
            id: productId,
            name: productName,
            price: productPrice,
            image: productImage,
            rating: productRating // Добавляем рейтинг
        };

        addToCart(product);
    }
});

// Функция добавления товара в корзину
function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    const existingProduct = cart.find(item => item.id === product.id);
    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        product.quantity = 1;
        cart.push(product);
    }

    // Сохраняем корзину в localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Обновляем итоговую стоимость
    updateTotalPrice();

    // Показ уведомления о добавлении товара в корзину
    showAddToCartNotification(product.name);
}

// Функция для отображения уведомления
function showAddToCartNotification(productName) {
    // Создаем элемент уведомления
    const notification = document.createElement("div");
    notification.classList.add("notification");
    notification.textContent = `${productName} добавлен в корзину!`;

    // Добавляем уведомление на страницу
    document.body.appendChild(notification);

    // Убираем уведомление через 3 секунды
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Функция для обновления итоговой стоимости корзины
function updateTotalPrice() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    let totalPrice = 0;

    cart.forEach(item => {
        totalPrice += item.price * item.quantity; // Умножаем цену на количество
    });

    const totalPriceElement = document.getElementById('total-price');
    if (totalPriceElement) {
        totalPriceElement.textContent = `${totalPrice}₽`;
    }
}

// Инициализация корзины при загрузке страницы корзины
document.addEventListener('DOMContentLoaded', () => {
    updateTotalPrice();
});

loadAllProducts();
