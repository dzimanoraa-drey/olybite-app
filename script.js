// Navigation
function showScreen(screen) {
  document.querySelectorAll(".screen").forEach(s => s.classList.add("hidden"));
  document.getElementById(screen).classList.remove("hidden");
}

// Fake SMS popup
function showSMS(message) {
  const popup = document.getElementById("smsPopup");
  const text = document.getElementById("smsText");

  text.innerText = message;
  popup.classList.remove("hidden");

  setTimeout(() => {
    popup.classList.add("hidden");
  }, 4000);
}

// Data (FIXED IMAGES)
const stalls = [
  {
    name: "Burger Stall",
    items: [
      {
        name: "Burger",
        price: 10,
        img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd"
      },
      {
        name: "Cheeseburger",
        price: 12,
        img: "https://images.unsplash.com/photo-1550547660-d9450f859349"
      }
    ]
  },
  {
    name: "Snack Stand",
    items: [
      {
        name: "Chips",
        price: 5,
        img: "https://images.unsplash.com/photo-1576107232684-1279f390859f"
      },
      {
        name: "Popcorn",
        price: 6,
        img: "https://images.unsplash.com/photo-1585647347483-22b66260dfff"
      }
    ]
  },
  {
    name: "Drinks Bar",
    items: [
      {
        name: "Coke",
        price: 4,
        img: "https://images.unsplash.com/photo-1581636625402-29b2a704ef13"
      },
      {
        name: "Fanta",
        price: 4,
        img: "https://images.unsplash.com/photo-1600271886742-f049cd451bba"
      }
    ]
  }
];

let cart = [];

// Load menu
function loadStalls() {
  const container = document.getElementById("stalls");

  stalls.forEach(stall => {
    const stallDiv = document.createElement("div");
    stallDiv.classList.add("card");

    stallDiv.innerHTML = `<h5>${stall.name}</h5>`;

    stall.items.forEach(item => {
      const itemDiv = document.createElement("div");
      itemDiv.classList.add("card");

      itemDiv.innerHTML = `
        <img src="${item.img}" class="food-img">
        <strong>${item.name}</strong><br>
        $${item.price}
        <button class="btn btn-primary w-100 mt-2">Add</button>
      `;

      itemDiv.querySelector("button").onclick = () => addToCart(item);
      stallDiv.appendChild(itemDiv);
    });

    container.appendChild(stallDiv);
  });
}

// Add to cart
function addToCart(item) {
  const existing = cart.find(i => i.name === item.name);

  if (existing) {
    existing.quantity++;
  } else {
    cart.push({ ...item, quantity: 1 });
  }

  displayCart();
}

// Increase
function increase(name) {
  const item = cart.find(i => i.name === name);
  item.quantity++;
  displayCart();
}

// Decrease
function decrease(name) {
  const item = cart.find(i => i.name === name);

  if (item.quantity > 1) {
    item.quantity--;
  } else {
    cart = cart.filter(i => i.name !== name);
  }

  displayCart();
}

// Display cart
function displayCart() {
  const cartDiv = document.getElementById("cartItems");
  cartDiv.innerHTML = "";

  let total = 0;

  cart.forEach(item => {
    total += item.price * item.quantity;

    const div = document.createElement("div");
    div.classList.add("card");

    div.innerHTML = `
      ${item.name} - $${item.price} x ${item.quantity}
      <br>
      <button class="btn btn-success btn-sm" onclick="increase('${item.name}')">+</button>
      <button class="btn btn-warning btn-sm" onclick="decrease('${item.name}')">-</button>
    `;

    cartDiv.appendChild(div);
  });

  document.getElementById("total").innerText = total;
}

// Checkout with SMS
function checkout() {
  const phone = document.getElementById("phoneNumber").value;

  if (!phone) {
    alert("Please enter a phone number");
    return;
  }

  if (cart.length === 0) {
    alert("Cart is empty");
    return;
  }

  let message = "OLYBITE Order Confirmed 🍔\n";
  let total = 0;

  cart.forEach(item => {
    message += `${item.name} x ${item.quantity}\n`;
    total += item.price * item.quantity;
  });

  message += `Total: $${total}`;

  const encodedMessage = encodeURIComponent(message);

  window.open(`sms:${phone}?body=${encodedMessage}`);

  showSMS("SMS ready with your order 📩");

  cart = [];
  displayCart();
  showScreen("confirmation");
}

// Init
window.onload = loadStalls;