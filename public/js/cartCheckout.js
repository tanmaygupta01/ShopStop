const quantities = document.querySelectorAll('.quantities');
const cartCount = document.querySelector('.cart-count');
const card = document.querySelectorAll('.remove-card');
const item = document.querySelectorAll('.remove-item');
const final = document.querySelector('.final');
const times = document.querySelectorAll('.times');
const amount = document.querySelector('.amount');
const btn = document.querySelector('#rzp-button1');


function checkout() {
    let callbackURL = "";
    if (btn.innerText === 'Proceed to checkout') {
        callbackURL += "/is-order-complete"
    } else {
        callbackURL += "/is-order-complete-buynow"
    }
    btn.addEventListener('click', async(e) => {
        const data = await axios({
            method: 'post',
            url: '/order',
            data: { "amount": btn.getAttribute('netAmount') },
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        });
        const options = {
            "key": "rzp_test_U0yIixRZ83uP0Z",
            "amount": btn.getAttribute('netAmount') * 100,
            "currency": "INR",
            "name": "Shopping Cart",
            "description": btn.getAttribute('productInfo'),
            "order_id": data.id,
            "callback_url": callbackURL,
            "prefill": {
                "name": btn.getAttribute('username'),
                "email": btn.getAttribute('email')
            },
            "notes": {
                "address": "Razorpay Corporate Office"
            },
            "theme": {
                "color": "#3399cc"
            }
        };
        const rzp1 = new Razorpay(options);
        rzp1.open();
        e.preventDefault();
    });
}


async function increaseQuantity(productid, quantity, i) {
    try {
        const response = await axios({
            method: 'post',
            url: `/user/${productid}/increase`,
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        });

        quantity.children[1].innerText = response.data.quantity;
        const value = response.data.totalCartProducts;
        if (value > 99) {
            cartCount.innerText = '99+';
        } else {
            cartCount.innerText = value;
        }


        times[i].innerText = 'x' + response.data.quantity.toString();

        amount.innerText = response.data.totalAmount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' }) + '/-';
        btn.setAttribute('netAmount', response.data.totalAmount);

    } catch (e) {
        window.location.replace('/login');
        console.log(e.message);
    }

}


async function decreaseQuantity(productid, quantity, i) {
    try {
        const response = await axios({
            method: 'post',
            url: `/user/${productid}/decrease`,
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        });
        console.log(response);
        if (response.data.quantity) {
            const value = response.data.quantity;
            quantity.children[1].innerText = value;
            times[i].innerText = 'x' + response.data.quantity.toString();

        } else {
            card[i].remove();
            item[i].remove();
        }



        if (response.data.totalAmount) {
            amount.innerText = response.data.totalAmount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' }) + '/-';
            btn.setAttribute('netAmount', response.data.totalAmount);
            btn.setAttribute('productInfo', response.data.productInfo);

        } else {
            final.remove();
            btn.remove();
        }


        const value = response.data.totalCartProducts;
        if (value > 99) {
            cartCount.innerText = '99+';
        } else {
            cartCount.innerText = value;
        }


    } catch (e) {
        window.location.replace('/login');
        console.log(e.message);
    }
}



for (let i = 0; i < quantities.length; i++) {
    quantities[i].children[0].addEventListener('click', () => {
        const productid = quantities[i].getAttribute('product-id');
        increaseQuantity(productid, quantities[i], i);
    });
}

for (let i = 0; i < quantities.length; i++) {
    quantities[i].children[2].addEventListener('click', () => {
        const productid = quantities[i].getAttribute('product-id');
        decreaseQuantity(productid, quantities[i], i);
    });
}

if (btn) {
    checkout();
}