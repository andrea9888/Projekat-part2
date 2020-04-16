let add = document.querySelector(".add");

let listProducts = document.querySelector(".list-products")
let container = document.querySelector(".container")
let shoppingCartProducts = document.querySelector(".shopping-cart-products");
let shoppingCartSummary = document.querySelector(".shopping-cart-summary");
add.onclick = saveAndUploadToNextColumn;

let count = 0;
let obj = {};
let listOfBought = [];

let loc = localStorage.getItem("location");

if(loc && loc !== "undefined"){
    fetch(loc, {
        method: 'get',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
        })
        .then(function(response) {
            return response.json();
        })
        .then(function(data){
            for(let key in data){
                let name = data[key]['productName'];
                let desc = data[key]['productDesc'];
                let img = data[key]['productImg'];
                let price = data[key]['productPrice'];
                let quantity = data[key]['quantity'];
                if (quantity !== 0){
                    listOfBought.push(name);
                }
                showAndSaveElement(name, desc, img, price, quantity);
                countTotal();
            }
        });
}

window.addEventListener("beforeunload", saveOnBlob, false)
function saveOnBlob(){
    fetch('https://jsonblob.com/api/jsonBlob', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(obj)
        })
        .then(function(response) {
            localStorage.setItem("location", response.headers.get('Location'))
            return response.json();
        })
        .then(function(data) {
            console.log(data)
            return null;
        })
        .catch((error) => {
            console.error(error);
        });
}

function saveAndUploadToNextColumn(event){
    
    
    let productName = document.querySelector(".product-name").value;
    let productDesc = document.querySelector(".product-desc").value;
    let productImg = document.querySelector(".product-img").value;
    let productPrice = document.querySelector(".product-price").value;

    showAndSaveElement(productName, productDesc, productImg, productPrice, 0);
    
}

function showAndSaveElement(productName, productDesc, productImg, productPrice, quantity){
    console.log(count)
    obj[count] = {
    'productName': productName,
    'productDesc': productDesc,
    'productImg': productImg,
    'productPrice': productPrice,
    'quantity': quantity
    }

    let newProduct = document.createElement("div");
    newProduct.className = "product";
    let newImg = document.createElement("img");
    newImg.src = productImg;
    let newName = document.createElement("p");
    newName.innerText = productName;
    let newPrice = document.createElement("p");
    newPrice.innerText = '$' + productPrice;
    let newDetails = document.createElement("button");
    newDetails.className = "details-button";
    newDetails.innerText = "Details"
    let newBuy = document.createElement("button");
    newBuy.className = "buy-button";
    newBuy.innerText = "Buy";
    

    if (quantity !== 0){
        addItemToCart("storage");
        countTotal();
    }
    newBuy.onclick = function(event){ 
        addItemToCart(newName.innerText);
        countTotal();
        
    }
    function addItemToCart(nameHelp){
        console.log(count);
        
        if (nameHelp === "storage" || listOfBought.indexOf(nameHelp.toLowerCase()) === -1){

            listOfBought.push(nameHelp.toLowerCase());
            console.log(listOfBought)
            let shoppingCartProduct = document.createElement("div");
            shoppingCartProduct.className = "shopping-cart-poduct";
            let productInfo = document.createElement("div");
            productInfo.className = "product-info";
            let div1 = document.createElement("div");
            let h3 = document.createElement("h3");
            h3.innerText = productName;
            var p = document.createElement("p");
            div1.appendChild(h3);
            div1.appendChild(p);
            let image1 = document.createElement("img");
            image1.src = productImg;
            productInfo.appendChild(div1);
            productInfo.appendChild(image1);
            let prodCount = document.createElement("div");
            prodCount.className = "product-count";
            let but1 = document.createElement("button");
            but1.innerText = "-"
            var sp = document.createElement("span");
            if (nameHelp === "storage"){
                p.innerHTML = "$" + productPrice + '&times;' + quantity;
                sp.innerText = quantity;
                obj[count]['quantity'] = quantity;
                saveOnBlob();
            }
            else{
                count--;
                console.log(count);
                p.innerHTML = "$" + productPrice + '&times;' + (parseInt(quantity) + 1);
                sp.innerText = parseInt(quantity) + 1;
                
                for (let key2 in obj){
                    if (obj[key2]['productName'] === productName){
                        obj[key2]['quantity'] = parseInt(quantity) + 1;
                    }
                }
                saveOnBlob();
                
            }
            
            
            let but2 = document.createElement("button");
            but2.innerText = "+";

            prodCount.appendChild(but1);
            prodCount.appendChild(sp);
            prodCount.appendChild(but2);

            
            shoppingCartProduct.appendChild(productInfo);
            shoppingCartProduct.appendChild(prodCount);

            shoppingCartProducts.appendChild(shoppingCartProduct);
            
            

            
            but1.onclick = (e) => {
                
                count--;
                
                for(let key1 in obj){
                    if (obj[key1]['productName'] === e.target.parentNode.parentNode.children[0].children[0].children[0].innerText){
                        if (quantity > 1){
                            p.innerHTML = "$" + productPrice + '&times;' + (quantity - 1);
                            sp.innerText = quantity - 1;
                            obj[key1]['quantity'] = quantity - 1;
                            quantity --;
                            saveOnBlob();}
                        else{
                            
                            shoppingCartProducts.removeChild(shoppingCartProduct);
                            obj[key1]['quantity'] = 0;
                            quantity = 0;
                            
                            let remove = listOfBought.indexOf(obj[key1]['productName']);
                            listOfBought = listOfBought.filter((elem) => listOfBought.indexOf(elem) !== remove);
                            
                            saveOnBlob();
                        }
                    }
                }
                countTotal();
                
            }
                
            but2.onclick = (e) => {

                count--;
                for(let key1 in obj){

                    if (obj[key1]['productName'] === e.target.parentNode.parentNode.children[0].children[0].children[0].innerText){
                        if (quantity < 10){
                            p.innerHTML = "$" + productPrice + '&times;' + (quantity + 1);
                            sp.innerText = quantity + 1;
                            obj[key1]['quantity'] = quantity + 1;
                            quantity ++;
                            
                            saveOnBlob();}
                        else{
                            e.target.parentNode.parentNode.classList.add("shake");
                            setTimeout(() => e.target.parentNode.parentNode.classList.remove("shake"), 2000)
                        }
                        
                    }
                }
                countTotal();
                
            }
           
           
        }

        
    }
 
    newProduct.appendChild(newImg);
    newProduct.appendChild(newName);
    newProduct.appendChild(newPrice);
    newProduct.appendChild(newDetails);
    newProduct.appendChild(newBuy);

    listProducts.appendChild(newProduct);
    newDetails.onclick = function(event){
        let modalWindow = document.createElement("div");
        modalWindow.className = "modalWindow";

        let name = document.createElement("h3");
        name.innerText = productName;
        name.className = "modalName";
        let image = document.createElement("img");
        image.src = productImg;
        image.className = "modalImage";
        let details = document.createElement("div");
        details.innerText = productDesc;
        details.className = "modalDesc";

        let x = document.createElement("button");
        x.className = "x";
        x.innerText = "X"

        modalWindow.appendChild(name);
        modalWindow.appendChild(image);
        modalWindow.appendChild(details);
        modalWindow.appendChild(x);

        let mask = document.createElement("div");
        mask.className = "mask";
        

        document.body.appendChild(mask);
        document.body.appendChild(modalWindow);
        

        x.onclick = (event) => {
            document.body.removeChild(mask);
            document.body.removeChild(modalWindow);
        }
    }
    
    saveOnBlob();
    count++;


}
let total = document.createElement("div");
let butDiv = document.createElement("div");
let purchase = document.createElement("button");
purchase.innerHTML = "Purchase";
purchase.onclick = (e) => {
    let modalWindow = document.createElement("div");
    modalWindow.className = "modalWindow";
    let text = document.createElement("p");
    text.innerText = "Purchased!";
    text.className = "text"
    modalWindow.appendChild(text);
    

    let mask = document.createElement("div");
    mask.className = "mask";
    

    document.body.appendChild(mask);
    document.body.appendChild(modalWindow);
    setTimeout(() => {
        document.body.removeChild(mask);
        document.body.removeChild(modalWindow);
    }, 3000)
}
butDiv.appendChild(purchase);

shoppingCartSummary.appendChild(total);
shoppingCartSummary.appendChild(butDiv);

function countTotal(){
    let temp = 0;
    for (let key in obj){
        temp += obj[key]['quantity']*obj[key]['productPrice'];
    }
    total.innerHTML = 'Total: <b> $' + temp + '</b>';

    
}

//https://sc01.alicdn.com/kf/HTB1NtlLwHSYBuNjSspiq6xNzpXaw/230785761/HTB1NtlLwHSYBuNjSspiq6xNzpXaw.jpg
//https://image.made-in-china.com/43f34j00DsKQuSpdhRfk/Men-Watches-Luxury-3ATM-Waterproof-Quartz-Watch-Hand-Watch-Man.jpg
//https://cdn.shopify.com/s/files/1/0102/2250/1947/products/product-image-650439331_480x480@2x.jpg