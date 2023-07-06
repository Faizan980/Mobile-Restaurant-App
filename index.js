import { menuArray } from "./data.js";


const myOrderContainer = document.getElementById('my-order-container')
const cardContainer = document.getElementById('card-container')
const paymentForm = document.getElementById('payment-form')

paymentForm.addEventListener('submit', function(e) {
  e.preventDefault()

  const paymentFormData = new FormData(paymentForm)
  const name = paymentFormData.get('name')
  myOrderContainer.innerHTML = ``
  myOrderContainer.innerHTML = `
    <div class="place-order">
        <h3 class="place-order-text">Thanks ${name}. Your order is on its way.</h3>
    </div>
  `
  cardContainer.style.display = 'none'
})

// text for heading
const para = document.createElement("h3")
para.className = "order-title"
const node = document.createTextNode("My Order")
para.appendChild(node)

// div for order record
const newDiv = document.createElement('div')
newDiv.id = 'my-order'
myOrderContainer.appendChild(newDiv)

// div for total price
const totalPriceDiv = document.createElement('div')
totalPriceDiv.id = "total-price"
myOrderContainer.appendChild(totalPriceDiv)

// complete order button
const completeOrderButton = document.createElement('button')
completeOrderButton.textContent = 'Complete Order'
completeOrderButton.className = "complete-btn"
completeOrderButton.addEventListener('click', handleCompleteOrderClick)


// to display the complete order box
function handleCompleteOrderClick() {
  cardContainer.style.display = 'block'
} 

document.addEventListener("click", function(e) {
    if (e.target.dataset.menu) {
        addItem(e.target.dataset.menu)
    }
})

let totalPrice = 0;
let selectedItems = [] // Declare and initialize an empty array to store selectedItems

// function to add items in Empty Array
function addItem(menuId) {
  const selectedItem = menuArray.find(function (menu) {
    return menu.id == menuId
  });

  if (selectedItem) {
    const existingItem = selectedItems.find(function (item) {
      return item.id === selectedItem.id
    })

    if (existingItem) {
      existingItem.quantity++ // Increment the quantity if the item is already selected
    } else {
      selectedItem.quantity = 1 // Add quantity property if it's a new item
      selectedItems.push(selectedItem)
    }

    totalPrice += selectedItem.price
    renderSelectedItem()
    renderTotalPrice()
  }
}

// function to render selected items in the DOM
function renderSelectedItem() {
  const myOrderDiv = document.getElementById('my-order')
  myOrderDiv.innerHTML = ''
  myOrderDiv.appendChild(para)

  selectedItems.forEach(function (item) {
    const itemContainer = document.createElement('div')
    itemContainer.classList.add('item-container')

    const itemName = document.createElement('div')
    itemName.textContent = `${item.name} x${item.quantity}`
    itemName.classList.add('item-name')

    const itemPrice = document.createElement('div')
    itemPrice.textContent = `$${(item.price * item.quantity).toFixed(0)}`
    itemPrice.classList.add('item-price')

    const removeButton = document.createElement('button');
    removeButton.textContent = 'remove'
    removeButton.classList.add('remove-button');
    removeButton.addEventListener('click', function () {
      removeItem(item.id);
    });

    itemContainer.appendChild(itemName);
    itemContainer.appendChild(removeButton)
    itemContainer.appendChild(itemPrice)

    myOrderDiv.appendChild(itemContainer)
  });
}

// function to calculate and render the total price of selected items
function renderTotalPrice() {
    const totalDiv = document.getElementById('total-price')
    totalDiv.innerHTML = '';
  
    const totalContainer = document.createElement('div')
    totalContainer.classList.add('total-container') 

    const totalLabel = document.createElement('div')
    totalLabel.textContent = 'Total: '
    totalLabel.classList.add('total-label')
  
    const totalPrice = document.createElement('div')
    totalPrice.textContent = `$${calculateTotalPrice().toFixed(0)}`
    totalPrice.classList.add('total-price')
  
    totalContainer.appendChild(totalLabel)
    totalContainer.appendChild(totalPrice)
    totalDiv.appendChild(totalContainer)
    myOrderContainer.appendChild(completeOrderButton)

  }
  
  // calculate the total price of selected items
  function calculateTotalPrice() {
    let total = 0
  
    selectedItems.forEach(function (item) {
      total += item.price * item.quantity
    });
  
    return total
  }

  // remove items from the Selected items in the Array
  function removeItem(itemId) {
    const itemIndex = selectedItems.findIndex(function (item) {
      return item.id === itemId
    });
  
    if (itemIndex !== -1) {
      const item = selectedItems[itemIndex];
  
      if (item.quantity > 1) {
        item.quantity--
      } else {
        selectedItems.splice(itemIndex, 1)
      }
  
      totalPrice -= item.price
      renderSelectedItem()
      renderTotalPrice()
    }
  }

function getFeedHtml() {
    let feedHtml = ``

    menuArray.forEach(function(menu) {
        feedHtml += `
            <div class="menu-modal">
                <div class="menu-inner" id=${menu.id}>
                        <span><img src="${menu.emoji}" /></span>
                        <div class="menu--list" >
                            <h3>${menu.name}</h3>
                            <p class="p-ingredient">${menu.ingredients}</p>
                            <p class="p-price">$${menu.price}</p>
                        </div>
                        <button class="add-btn" data-menu="${menu.id}">+</button>
                </div>
            </div>
        `
    })
    return feedHtml
}

getFeedHtml()


function render() {
    document.getElementById('feed').innerHTML = getFeedHtml()
}

render()