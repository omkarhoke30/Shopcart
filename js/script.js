const productConatiner = document.querySelector("#productConatiner");
const productTemplate = document.querySelector("#productTemplate");
const cartContainer = document.querySelector('.cartvalue');



async function GetAndDisplayData() {


    if (!productTemplate || !productConatiner) {
        return;
    }
    try {
        const res = await fetch("../products.json");
        let products = await res.json();
        let displayProducts;
        const isHomePage = window.location.pathname.includes("index.html");

        if (isHomePage) {
            displayProducts = products.slice(0, 8);
        }
        else {
            displayProducts = products;
        }
         displayProducts.forEach((cuProd) => {
        const {
            id,
            name,
            category,
            brand,
            price,
            stock,
            description,
            image
        } = cuProd;

        const productClone = document.importNode(
            productTemplate.content,
            true
        );

        productClone.querySelector("#cardvalue").setAttribute("id", `card${id}`);

        productClone.querySelector(".category").textContent = category;
        productClone.querySelector(".productName").textContent = name;
        productClone.querySelector(".productDescription").textContent = description;
        productClone.querySelector(".productPrice").textContent = `$${price}`;
        productClone.querySelector(".productActualPrice").textContent = `$${price * 2}`;
        productClone.querySelector(".productStock").textContent = stock;
        productClone.querySelector("img").src = image;
        productClone.querySelector("img").alt = name;

        //---------> this is for increment and decrement of stocks of quantity---------

        productClone.querySelector(".stockElement").addEventListener("click", (e) => {
            QuantityChange(id, stock, e);
        });



        //----------> this is for add to cart button ---------------

        productClone.querySelector('.add-to-cart-button').addEventListener("click", (e) => {
            AddtoCartBtn(id, stock, e);
        });

        productConatiner.append(productClone);
    });
       

    } catch (error) {
        console.log(error);
    }
}





GetAndDisplayData();

// ====== Quantity Increment and decrement ====== 


function QuantityChange(id, stock, e) {
    let CurrentProduct = document.querySelector(`#card${id}`);
    let ProductQuantity = CurrentProduct.querySelector(".productQuantity");

    let Quantity = parseInt(ProductQuantity.getAttribute("data-quantity") || 1);

    if (e.target.textContent === "+") {
        if (Quantity < stock) {
            Quantity += 1;
        }
        else if (Quantity === stock) {
            Quantity = stock;
        }
    }

    if (e.target.textContent === "-") {
        if (Quantity > 1) {
            Quantity -= 1;
        }
    }

    ProductQuantity.innerHTML = Quantity;

    ProductQuantity.setAttribute("data-quantity", Quantity.toString());


    return Quantity

}



// =========== Function to Add to cart button ===========

getproductfromLS();

function AddtoCartBtn(id, stock, e) {
    // --------> here we getting products from local storage even if not exits 
    let arrLocalStorageProducts = getproductfromLS();

    let CurrentProduct = document.querySelector(`#card${id}`);
    let Quantity = CurrentProduct.querySelector('.productQuantity').innerHTML
    let price = CurrentProduct.querySelector('.productPrice').innerHTML;

    price = price.replace('$', "");

    let exitingProduct = arrLocalStorageProducts.find((cuele => cuele.id === id));

    if (exitingProduct && Quantity > 1) {

        Quantity = Number(exitingProduct.Quantity) + Number(Quantity);
        price = Number((price * Quantity).toFixed(2));

        let updatedCart = { id, Quantity, price };
        updatedCart = arrLocalStorageProducts.map(cuEle => {
            return cuEle.id === id ? updatedCart : cuEle;
        });


        localStorage.setItem('PurchasedProducts', JSON.stringify(updatedCart));
        addtoast("add", id);

    }
    if (exitingProduct) {
        return false
    }

    price = Number((price * Quantity).toFixed(2));

    Quantity = Number(Quantity);

    arrLocalStorageProducts.push({ id, Quantity, price });

    localStorage.setItem('PurchasedProducts', JSON.stringify(arrLocalStorageProducts));


    // ------> here is fucntion that changed the value in cart navbar section

    UpdateCartValue(arrLocalStorageProducts);
    addtoast("add", id);

}


// ======== getproductfromLS() fucntion  to get products list from local storage even if not  exit ========

function getproductfromLS() {
    let products = localStorage.getItem('PurchasedProducts');

    // ? --->  here we doing not exitsable statement when products is not in it 
    if (!products) {
        return [];
    }

    products = JSON.parse(products);
    UpdateCartValue(products);

    return products;
}


//=========== UpdateCartValue() fucntion to changed the value in cart navbar section==========

function UpdateCartValue(arrlocalstorage) {

    if (!cartContainer) return;

    cartContainer.innerHTML = arrlocalstorage.length;
}


function addtoast(conditon, id) {
    let toast = document.createElement("div");
    toast.classList.add("toast");
    if (conditon === "delete") {
        toast.innerHTML = `Product with ID ${id} is delete`;
    }
    else {
        toast.innerHTML = `Product with ID ${id} is added`;

    }
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.remove();
    }, 2000);
}


const newsletterBtn = document.querySelector('[data-testid="newsletter-btn"]');
if (newsletterBtn) {
    newsletterBtn.addEventListener('click', function () {
        const emailInput = document.querySelector('[data-testid="newsletter-input"]');
        const email = emailInput.value;
        if (email) {
            alert('Thank you for subscribing!');
            emailInput.value = '';
        }
    });
}