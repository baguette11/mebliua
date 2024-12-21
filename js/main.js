async function getProducts() {
    let response = await fetch("main.json")
    let products = await response.json()
    return products
};

// Функція для отримання значення кукі за ім'ям
function getCookieValue(cookieName) {
    // Розділяємо всі куки на окремі частини
    const cookies = document.cookie.split(';')
    // Шукаємо куки з вказаним ім'ям
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim() // Видаляємо зайві пробіли
        // Перевіряємо, чи починається поточне кукі з шуканого імені
        if (cookie.startsWith(cookieName + '=')) {
            // Якщо так, повертаємо значення кукі
            return cookie.substring(cookieName.length + 1) // +1 для пропуску "="
        }
    }
    // Якщо кукі з вказаним іменем не знайдено, повертаємо порожній рядок 
    return ''
}


let products_list = document.querySelector(".product-list")

function getCard(product) {
    return `
    <div class="product-item">
                <img class='image' src="images/${product.image}" alt="">
                <p>${product.title}</p>
                <p class="price">${product.price} грн</p> 
               
                   
              
                <button class="btn-add-to-cart" data-product='${JSON.stringify(product)}'>🛒Додати у кошик</button>
            </div>
            `
}


class ShoppingCart {
    constructor() {
        this.items = {}
        this.loadCartFromCookies()
    }

    // Зберігання кошика в кукі
    saveCartToCookies() {
        let cartJSON = JSON.stringify(this.items);
        document.cookie = `cart=${cartJSON}; max-age=${60 * 60 * 24 * 7}; path=/`;
    }

    // Завантаження кошика з кукі
    loadCartFromCookies() {
        let cartCookie = getCookieValue('cart');
        if (cartCookie && cartCookie !== '') {
            this.items = JSON.parse(cartCookie);
        }
    }

    addItem(product) {
        if (this.items[product.id]) {
            this.items[product.id].quantity += 1
        } else {
            this.items[product.id] = product
            this.items[product.id].quantity = 1
        }
        this.saveCartToCookies()
    }
}

let cart = new ShoppingCart()

function addToCard(event) {
    let data = event.target.getAttribute('data-product')
    let product = JSON.parse(data)
    cart.addItem(product)

    console.log(cart.items)
}

getProducts().then(function (products) {

    if (products_list) {
        products.forEach(function (product) {
            products_list.innerHTML += getCard(product)
        })
        let addBtn_list = document.querySelectorAll(".btn-add-to-cart")
        addBtn_list.forEach(function (btn) {
            btn.addEventListener("click", addToCard)
        })
    }

})

// Додавання товарів кошика на сторінку


function getCartItem(product) {
    return `
         <div class="card my-2">
                
                    <div class="col-2">
                        <img src="images/${product.image}" class="img-fluid">
                    </div>
                    <div class="col-6">
                        <h5>${product.title}</h5>
                    </div>
                    <div class="col-2"><h6>${product.quantity} шт.</h6></div>
                    <div class="col-2">
                        <h4>${product.price * product.quantity} грн</h4>
                    </div>
                    <div class="remove-btn" data-product='${product.id}'>
                    <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-trash"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 7l16 0" /><path d="M10 11l0 6" /><path d="M14 11l0 6" /><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" /><path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" /></svg>
                     </div>
            </div>
    `
}

let cart_list = document.querySelector(".cart-list")

function showCart(){
    cart_list.innerHTML = ''

    for (let key in cart.items) {
        cart_list.innerHTML += getCartItem(cart.items[key])
    }
    let delBtn_list = document.querySelectorAll(".remove-btn")
    delBtn_list.forEach(function (btn) {
        btn.addEventListener("click", function (event) {
            let id = event.currentTarget.getAttribute('data-product')
            if (id in cart.items) {
                delete cart.items[id]
            }
            cart.saveCartToCookies()
            showCart()
        })
    })
}

if (cart_list) {
    showCart()
}
