let LocalProduct = getproductfromLS();
const cartContainer = document.querySelector('.cartvalue');
const productConatiner = document.querySelector("#cart-product-conatiner");
const cartTemplate = document.querySelector(".cartTemplate");

UpdateCartValue(LocalProduct);

async function GetDataFromLocal() {
    if (!cartTemplate || !productConatiner) {
        return;
    }
    try {

        let res = await fetch("../products.json");
        let jsonproducts = await res.json();

        let filteredProducts = jsonproducts.filter((product) => {
            return LocalProduct.some((pro) => pro.id === product.id)
        });

        filteredProducts.forEach(currentProd => {

            const { id,
                name,
                category,
                brand,
                price,
                stock,
                description,
                image } = currentProd;

            let productclone = document.importNode(cartTemplate.content, true);

            productclone.querySelector("#cardvalue").setAttribute("id", `card${id}`);
            productclone.querySelector('.product-info').innerHTML = `<img src="${image}" alt="">

                <div>

                    <h3>${name}</h3>

                    <p>${description}</p>


                </div>`;

            productclone.querySelector(".category-badge").textContent = category;
            productclone.querySelector('.price').textContent = `$${price}`;
            productclone.querySelector('.cart-quantity').textContent = `${getQuantity(id)}`;
            productclone.querySelector('.total-price').textContent = `$${getPrice(id)}`;


            productclone.querySelector('.delete-btn').addEventListener("click", (e) => {
                removeCartItem(id, e);
            });

            productclone.querySelector('.quantity-control').addEventListener("click", (e) => {
                IncrementDecrement(id, stock, e, price);
            });

            document.querySelector('.checkout-btn').addEventListener("click", (e) => {
                afterproceed(id,e);
            })



            productConatiner.append(productclone);



        });



    } catch (error) {
        console.log("error in mypurchase.js");
    }

}

GetDataFromLocal();

function getproductfromLS() {
    let products = localStorage.getItem('PurchasedProducts');

    // ? --->  here we doing not exitsable statement when products is not in it 
    if (!products) {
        return [];
    }

    products = JSON.parse(products);

    return products;
}


function UpdateCartValue(arrlocalstorage) {

    if (!cartContainer) return;

    cartContainer.innerHTML = arrlocalstorage.length;
}


// ======= getPrice fucntion to get price from local storage =======

function getPrice(id) {
     LocalProduct = getproductfromLS();
    let exitingProduct = LocalProduct.find((cuEle) => cuEle.id === id);

    let price = exitingProduct.price;
    return price;
}

// ======== getQuantity(id) to get quantity from local storage

function getQuantity(id) {
     LocalProduct = getproductfromLS();
    let exitingProduct = LocalProduct.find((cuEle) => cuEle.id === id);

    let quantity = exitingProduct.Quantity;
    return quantity;

}


/// ========== remove cart btn function =============

function removeCartItem(id, e) {
     LocalProduct = getproductfromLS();
    LocalProduct = LocalProduct.filter((cuPro) => cuPro.id !== id);

    localStorage.setItem('PurchasedProducts', JSON.stringify(LocalProduct));
    let removediv = document.querySelector(`#card${id}`);
    if (removediv) {
        removediv.remove();
        addtoast("delete", id);
    }
    UpdateCartValue(LocalProduct);
    productsBill();
}



function afterproceed(id,e){
    LocalProduct=getproductfromLS();
    LocalProduct.forEach(element => {
       let removediv=document.querySelector(`#card${element.id}`);
        removediv.remove();

    });
    localStorage.removeItem('PurchasedProducts');
    UpdateCartValue(LocalProduct);
    productsBill();
    addtoast("allclear",id)
    // alert('thank for buying');
}

// ================= fucntion to incerement and decrement =========


function IncrementDecrement(id, stock, e, price) {

    let currentProduct = document.querySelector(`#card${id}`);
    let productquantity = currentProduct.querySelector(".cart-quantity");
    let productprice = currentProduct.querySelector('.total-price');
    let quantity = 1;
    let localstoragePrice = 0;
    let LocalProduct = getproductfromLS();

    let exitingproduct = LocalProduct.find((cupro) => cupro.id === id);

    if (exitingproduct) {
        quantity = exitingproduct.Quantity;
        localstoragePrice = exitingproduct.price
    }

    if (e.target.textContent === "+") {
        if (quantity < stock) {
            quantity++;
            price = price;
        }
        else if (quantity === stock) {
            quantity = stock;
            localstoragePrice = Number((price * quantity).toFixed(2));
        }
    }


    if (e.target.textContent === "-") {
        if (quantity > 1) {
            quantity--;
        }
    }
    localstoragePrice = Number((price * quantity).toFixed(2));

    let updatedCart = { id, Quantity: quantity, price: localstoragePrice };
    updatedCart = LocalProduct.map(cuEle => {
        return cuEle.id === id ? updatedCart : cuEle;
    });


    localStorage.setItem('PurchasedProducts', JSON.stringify(updatedCart));
    productquantity.innerHTML = quantity;
    productprice.innerHTML = `$${localstoragePrice}`;
    productsBill();


}

//============ this cuntion is use to dispaly products bill amount ==========


productsBill();


function productsBill() {

    let LocalProduct = getproductfromLS();
    let subtotalContainer = document.querySelector('.subtotal');
    let totalAmountContainer = document.querySelector('.totalAmount')
    let tax = document.querySelector(".tax").textContent;
    let discount = document.querySelector(".discount").textContent;

    tax = tax.replace("$", "");
    discount = discount.replace("$", "")



    let totalProductPrice = LocalProduct.reduce((accum, curEle) => {
        let productprice = Number((curEle.price)) || 0;
        return accum + productprice;
    }, 0);

    subtotalContainer.innerHTML = `$${totalProductPrice.toFixed(2)}`;

    let totalAmount = totalProductPrice + Number(tax) - Number(discount);

    totalAmountContainer.innerHTML = `$${totalAmount.toFixed(2)}`;


}

//===========  this fucntion is use to display pop message ==============


function addtoast(conditon, id) {
    let toast = document.createElement("div");
    toast.classList.add("toast");
    if (conditon === "delete") {
        toast.innerHTML = `Product with ID ${id} is delete`;
    }
    else if (conditon === "add") {
        toast.innerHTML = `Product with ID ${id} is added`;

    }
    else if (conditon === "download") {
        toast.innerHTML = `Invoice Downloaded`
    }
    else if(conditon === "allclear"){
        toast.innerHTML =  `Payment Porceed Successfully`
    }
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.remove();
    }, 2000);
}




document.querySelector('.invoice-btn').addEventListener("click", () => {
    addtoast("download")
})



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