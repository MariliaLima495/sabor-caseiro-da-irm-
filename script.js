// ===============================
// SELEÇÃO DE ELEMENTOS
// ===============================
const cartItemsEl = document.getElementById('cart-items');
const cartTotalEl = document.getElementById('cart-total');
const emptyCartEl = document.getElementById('empty-cart');

const clearCartBtn = document.getElementById('clear-cart');
const sendOrderBtn = document.getElementById('send-order');

const customerName = document.getElementById('customer-name');
const customerStreet = document.getElementById('customer-street');
const customerNeighborhood = document.getElementById('customer-neighborhood');
const customerCondo = document.getElementById('customer-condo');

const paymentMethod = document.getElementById('payment-method');
const orderNote = document.getElementById('order-note');

const viewCartBtn = document.getElementById('view-cart-btn');
const cartCountEl = document.getElementById('cart-count');

let cart = [];


// ==========================================
// FUNÇÕES DE INTERFACE
// ==========================================
function updateViewCartButton() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  cartCountEl.textContent = totalItems;

  viewCartBtn.style.display = totalItems > 0 ? 'block' : 'none';
}


function updateCart() {

  cartItemsEl.innerHTML = '';

  if (cart.length === 0) {
    emptyCartEl.style.display = 'block';
  } else {

    emptyCartEl.style.display = 'none';

    cart.forEach((item, index) => {

      const li = document.createElement('li');
      li.classList.add('cart-item');

      li.innerHTML = `
        <span>${item.quantity}x ${item.name} - R$ ${(item.price * item.quantity).toFixed(2)}</span>
        <button class="remove-btn" onclick="removeItem(${index})">❌</button>
      `;

      cartItemsEl.appendChild(li);

    });

  }

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  cartTotalEl.textContent = total.toFixed(2);

  updateViewCartButton();

}


window.removeItem = (index) => {

  cart.splice(index, 1);

  updateCart();

};


// ==========================================
// ADICIONAR ITENS SIMPLES
// ==========================================
document.querySelectorAll('.add-btn').forEach((btn) => {

  btn.addEventListener('click', () => {

    const name = btn.getAttribute('data-name');
    const price = parseFloat(btn.getAttribute('data-price'));

    const existingItem = cart.find((i) => i.name === name);

    if (existingItem) {
      existingItem.quantity++;
    } else {
      cart.push({ name, price, quantity: 1 });
    }

    updateCart();

  });

});


// ==========================================
// LÓGICA DE PORÇÕES
// ==========================================
document.querySelectorAll('.add-btn-porcao').forEach(btn => {

  btn.addEventListener('click', (e) => {

    const parent = e.target.closest('.menu-item');

    const inputs = parent.querySelectorAll('.flavor-input');

    const nameBase = btn.getAttribute('data-name');

    const basePrice = parseFloat(btn.getAttribute('data-price'));

    const limit = parseInt(btn.getAttribute('data-limit')) || 0;

    const isUnitario = btn.getAttribute('data-type') === 'unitario';

    let totalSelected = 0;

    let selectedFlavors = [];

    let flavorCount = 0;


    inputs.forEach(input => {

      let val = parseInt(input.value) || 0;

      if (val > 0) {

        totalSelected += val;

        flavorCount++;

        selectedFlavors.push(`${val}x ${input.getAttribute('data-flavor')}`);

      }

    });


    if (totalSelected === 0) {
      return alert("Selecione pelo menos um sabor!");
    }


    if (limit > 0 && limit < 100 && flavorCount > 2) {
      alert("Para porções de " + limit + " unidades escolha no máximo 2 sabores.");
      return;
    }


    if (!isUnitario) {

      if (totalSelected > limit) {
        alert(`Limite de ${limit} unidades excedido.`);
        return;
      }

      if (limit === 100 && totalSelected !== 100) {
        alert(`Para o cento selecione exatamente 100 unidades.`);
        return;
      }

    }


    const finalPrice = isUnitario ? (basePrice * totalSelected) : basePrice;


    cart.push({
      name: `${nameBase} [${selectedFlavors.join(', ')}]`,
      price: finalPrice,
      quantity: 1
    });


    inputs.forEach(i => i.value = 0);

    updateCart();

    alert("Item adicionado!");

  });

});


// ===============================
// LIMPAR CARRINHO
// ===============================
clearCartBtn.addEventListener('click', () => {

  cart = [];

  updateCart();

});


// ===============================
// FINALIZAÇÃO E WHATSAPP
// ===============================
sendOrderBtn.addEventListener('click', () => {

  if (cart.length === 0) {
    return alert('Seu carrinho está vazio!');
  }

  if (!customerName.value || !customerStreet.value || !customerNeighborhood.value || !paymentMethod.value) {
    return alert('Preencha Nome, Endereço e Pagamento.');
  }

  let message = `🍗 *PEDIDO - CASA DOS SALGADOS*\n\n`;

  cart.forEach((item) => {

    message += `*${item.quantity}x* ${item.name}\n`;
    message += `_Subtotal: R$ ${(item.price * item.quantity).toFixed(2)}_\n\n`;

  });

  message += `💰 *Total: R$ ${cartTotalEl.textContent}*\n\n`;

  message += `👤 *Cliente:* ${customerName.value}\n`;

  message += `📍 *Endereço:* ${customerStreet.value}, ${customerNeighborhood.value} ${customerCondo.value}\n`;

  message += `💳 *Pagamento:* ${paymentMethod.value}\n`;

  if (orderNote.value) {
    message += `📝 *Obs:* ${orderNote.value}\n`;
  }


  const phone = '5581988032271';

  const encodedMsg = encodeURIComponent(message);

  const whatsappUrl = `https://api.whatsapp.com/send?phone=${phone}&text=${encodedMsg}`;

  window.location.href = whatsappUrl;

});


// ===============================
// ROLAGEM SUAVE DO BOTÃO FIXO
// ===============================
viewCartBtn.addEventListener('click', () => {

  const cartElement = document.getElementById('cart');

  if (cartElement) {

    const offset = 80;

    const elementPosition = cartElement.getBoundingClientRect().top + window.scrollY;

    window.scrollTo({
      top: elementPosition - offset,
      behavior: 'smooth'
    });

  }

});







