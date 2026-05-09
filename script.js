
// ================= FIREBASE =================

const firebaseConfig = {
  apiKey: "AIzaSyDBTgtQxniOJBTDozbTFA3WTwBsHG4a2xw",
  authDomain: "olybite-app.firebaseapp.com",
  projectId: "olybite-app",
  storageBucket: "olybite-app.firebasestorage.app",
  messagingSenderId: "169512248880",
  appId: "1:169512248880:web:b9acd5c8d1b7d27a2b2ff5",
  measurementId: "G-TR98VM682K"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

console.log("🔥 Firebase loaded");


// ================= LOGIN =================

function login() {
  let u = document.getElementById("username").value;
  let p = document.getElementById("password").value;

  if (u && p) {
    document.getElementById("login").style.display = "none";
    document.getElementById("app").style.display = "block";
  }
}


// ================= CART =================

let cart = [];

function addToCart(name, price) {

  let item = cart.find(i => i.name === name);

  if (item) {
    item.qty++;
  } else {
    cart.push({ name, price, qty: 1 });
  }

  render();
}

function render() {

  let box = document.getElementById("cart");
  let total = 0;
  let count = 0;

  box.innerHTML = "";

  cart.forEach((i, index) => {

    total += i.price * i.qty;
    count += i.qty;

    box.innerHTML += `
      <p>
        ${i.name} - $${i.price} x ${i.qty}
        <button onclick="cart[${index}].qty++; render()">+</button>
        <button onclick="cart[${index}].qty--; if(cart[${index}].qty<=0) cart.splice(${index},1); render()">-</button>
      </p>
    `;
  });

  document.getElementById("total").innerText = "Total: $" + total;
  document.getElementById("count").innerText = count;
}


// ================= CHECKOUT =================

function checkout() {

  let phone = document.getElementById("phone").value;

  let total = cart.reduce((s, i) => s + i.price * i.qty, 0);

  // SAVE TO FIREBASE
  db.collection("orders").add({
    phone,
    cart,
    total,
    time: new Date()
  })
  .then(() => {
    console.log("✅ Saved to Firebase");
  })
  .catch(err => {
    console.log("❌ Firebase error:", err);
  });

  // SEND SMS TO BACKEND
  fetch("http://localhost:3000/send-sms", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone })
  });

  alert("Order placed!");

  cart = [];
  render();
}