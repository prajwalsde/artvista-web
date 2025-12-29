document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Load Cart from LocalStorage
    let cart = JSON.parse(localStorage.getItem('artvista_cart')) || [];
    const container = document.getElementById('cartItemsContainer');
    const totalEl = document.getElementById('finalTotal');
    const payBtn = document.getElementById('payBtn');

    let totalAmount = 0;

    // 2. Display Cart Items
    if (cart.length > 0) {
        container.innerHTML = ''; 
        cart.forEach((item, index) => {
            totalAmount += item.price;
            
            const itemHTML = `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.title}">
                    <div class="item-details">
                        <h4>${item.title}</h4>
                        <div class="item-price">₹${item.price}</div>
                        <span class="remove-btn" onclick="removeItem(${index})">Remove</span>
                    </div>
                </div>
            `;
            container.innerHTML += itemHTML;
        });
        
        totalEl.innerText = `₹${totalAmount}`;
    } else {
        container.innerHTML = '<p>Your cart is empty.</p>';
        payBtn.disabled = true;
        payBtn.style.opacity = '0.5';
    }

    // 3. Remove Item Function
    window.removeItem = function(index) {
        cart.splice(index, 1);
        localStorage.setItem('artvista_cart', JSON.stringify(cart));
        window.location.reload(); 
    };

    // 4. Razorpay Integration
    payBtn.addEventListener('click', function() {
        // --- Validate Form ---
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const address = document.getElementById('address').value;
        const pincode = document.getElementById('pincode').value;

        if(!name || !email || !phone || !address || !pincode) {
            alert("Please fill in all delivery details before paying.");
            return;
        }

        // Prepare Order Description for Email
        let orderDescription = `New Order from ${name}!\n\nItems:\n`;
        cart.forEach(item => {
            orderDescription += `- ${item.title} (₹${item.price})\n`;
        });
        orderDescription += `\nTotal: ₹${totalAmount}`;
        orderDescription += `\n\nDelivery Address:\n${address}\nPincode: ${pincode}\nPhone: ${phone}`;

        // --- Razorpay Options ---
        var options = {
            // ------------------------------------------
            // PASTE YOUR TEST API KEY BELOW
            // ------------------------------------------
            "key": MY_API_KEY, 
            // ------------------------------------------
            
            "amount": totalAmount * 100, 
            "currency": "INR",
            "name": "ArtVista Store",
            "description": "Art Frame Order",
            "image": "assets/images/artvista/logo.png",
            
            // This sends data to Razorpay Dashboard > Transactions > Notes
            "notes": {
                "shipping_address": address,
                "pincode": pincode,
                "customer_phone": phone
            },

            "handler": function (response){
                // --- SUCCESS: Payment Received ---
                
                // 1. Send Order Details to Your Email (via Formspree)
                // UPDATED URL BELOW
                fetch("https://formspree.io/f/xpqzowjn", {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: email, 
                        message: orderDescription
                    })
                }).then(() => {
                    console.log("Order email sent to merchant.");
                }).catch(err => console.error("Email failed", err));

                // 2. Show Success Message on Screen
                localStorage.removeItem('artvista_cart'); // Clear cart
                
                document.querySelector('.checkout-container').innerHTML = `
                    <div style="text-align:center; grid-column: 1 / -1; padding: 50px;">
                        <i class="fas fa-check-circle" style="font-size: 4rem; color: #25D366; margin-bottom: 20px;"></i>
                        <h2>Order Placed Successfully!</h2>
                        <p>Payment ID: ${response.razorpay_payment_id}</p>
                        <p>Thank you, ${name}. We have received your order.</p>
                        <a href="index.html" class="btn btn-primary" style="margin-top:20px;">Return Home</a>
                    </div>
                `;
            },
            "prefill": {
                "name": name,
                "email": email,
                "contact": phone
            },
            "theme": {
                "color": "#0B132B"
            }
        };

        var rzp1 = new Razorpay(options);
        rzp1.on('payment.failed', function (response){
            alert("Payment Failed: " + response.error.description);
        });
        rzp1.open();
    });
});