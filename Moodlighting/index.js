
if (document.readyState == 'loading'){
    
    document.addEventListener('DOMContentLoaded', ready)
} else{
    ready()
    
}

function ready(){

//removing items
    var removeCartItemButtons = document.getElementsByClassName('btn-danger')

    for (var i = 0; i < removeCartItemButtons.length; i++){

        var button = removeCartItemButtons[i]

        button.addEventListener('click', removeCartItem)
    }
    
//changing price for quan   tity inputs
    var quantityInputs = document.getElementsByClassName('cart-quantity-input')
    for (var i = 0; i < quantityInputs.length; i++) {
        
        var input = quantityInputs[i]
        input.addEventListener('change', quantityChanged)
    }
    
//adding to the cart
    
    var addToCartButtons = document.getElementsByClassName('item-pick')
    
    for (var i = 0; i < addToCartButtons.length; i++) {
        
        var button = addToCartButtons[i]
        button.addEventListener('click', addToCartClicked)
    }
    

//making purchase
    
    document.getElementsByClassName('btn-purchase')[0].addEventListener('click', purchaseClicked)

}
var stripeHandler = StripeCheckout.configure({
    key: stripePublicKey,
    locale: 'en',
    token: function(token) {
        var items = []
        var cartItemContainer = document.getElementsByClassName('cart-items')[0]
        var cartRows = cartItemContainer.getElementsByClassName('cart-row')
        
        for (var i = 0; i< cartRows.length; i++) {
            
            var cartRow = cartRows[i]
            var quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0]
            //gives us the value customer put inside quantity selector
            var quantity = quantityElement.value
            var id = cartRow.dataset.itemId
            items.push({
                id: id,
                quantity: quantity,
            })
        }
        
        fetch('/purchase', {
            
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                stripeTokenId: token.id,
                items: items
            })
        }).then(function(res) {
            return res.json()
        }).then(function(data){
            alert(data.message)
            
            var cartItems = document.getElementsByClassName('cart-items')[0]

            while (cartItems.hasChildNodes()){

                cartItems.removeChild(cartItems.firstChild)
            }

            updateCartTotal()
        }).catch(function(error){
                 console.error(error)
                 })
         }

})

function purchaseClicked(){
    /*
    
    alert('Thank you for your purchase.')
    
    //remove all items after sale
    
    var cartItems = document.getElementsByClassName('cart-items')[0]
    
    while (cartItems.hasChildNodes()){
        
        cartItems.removeChild(cartItems.firstChild)
    }
    
    updateCartTotal()
    
    */
    var priceElement = document.getElementsByClassName('cart-total-price')[0]
    var price = parseFloat(priceElement.innerText.replace('$', '')) * 100
    stripeHandler.open({
        amount: price
    })
}
//1

function removeCartItem() {
    
    var buttonClicked = event.target
        buttonClicked.parentElement.parentElement.remove()
        
        updateCartTotal()
}

//2
function quantityChanged(event) {
    
    var input = event.target
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1
    }
    
    updateCartTotal()
}

//3

function addToCartClicked(event) {
    
    var button = event.target
    var shopItem = button.parentElement
    
    var title = shopItem.getElementsByClassName('item-title')[0].innerText
    
    
    var price = shopItem.getElementsByClassName('item-price')[0].innerText
    
    var imageSrc = shopItem.getElementsByClassName('item-image')[0].src
    var id = shopItem.dataset.itemId
    
    console.log(title, price, imageSrc)
    
    addItemToCart(title, price, imageSrc, id)
    
    //to update total after item added to cart
    
    updateCartTotal()
}


//4

function addItemToCart(title, price, imageSrc, id) {
    
    var cartRow = document.createElement('div')
    //for the same styling
    cartRow.classList.add('cart-row')
    cartRow.dataset.itemId = id
    var cartItems = document.getElementsByClassName('cart-items')[0]
    
    cartItemsNames = cartItems.getElementsByClassName('cart-item-title')
    
    for (var i = 0; i < cartItemsNames.length; i++) {
         
        if (cartItemsNames[i].innerText == title) {
            alert("This item is already added to the cart. Please change it's quantity.")
            return
        }
    }
    
    var cartRowContents = `

        <div class="cart-item cart-column">
            <img class="cart-item-image" src="${imageSrc}" width="100" height="100">
            <span class="cart-item-title"> ${title}</span>
        </div>
        <span class="cart-price cart-column"> ${price}</span>
        <div class="cart-quantity cart-column">
            <input class="cart-quantity-input" type="number" value="1">
            <button class="btn btn-danger" type="button">REMOVE</button>
        </div>`
    
    cartRow.innerHTML = cartRowContents
    cartItems.append(cartRow)
    
    //when remove item button clicked, call removeCartItem
    cartRow.getElementsByClassName('btn-danger')[0].addEventListener('click', removeCartItem)
    
    //changing the total when quantity changed
    cartRow.getElementsByClassName('cart-quantity-input')[0].addEventListener('change', quantityChanged)
}


//5


    
    
    


function updateCartTotal(){
    
    var cartItemContainer = document.getElementsByClassName('cart-items')[0]
    var cartRows = cartItemContainer.getElementsByClassName('cart-row')
    
    var total = 0
    for (var i = 0; i < cartRows.length; i++) {
        
        var cartRow = cartRows[i]
        var priceElement = cartRow.getElementsByClassName('cart-price')[0]
        var quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0]
        
        var price = parseFloat(priceElement.innerText.replace('$', ''))
        
        var quantity = quantityElement.value
        
        
        total = total + (price * quantity)
    }
    
    total = Math.round(total * 100) / 100
    
   document.getElementsByClassName('cart-total-price')[0].innerText = '$' + total
}
