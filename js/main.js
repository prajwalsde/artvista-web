document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Initial Setup ---
    updateCartBadge();
    
    // --- 2. Add to Cart Logic ---
    const btns = document.querySelectorAll('.add-to-cart-btn');
    
    btns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent link jump if any

            // Get product data from the HTML structure
            // We look for the closest 'product-card' parent
            const card = this.closest('.product-card');
            const title = card.querySelector('h3').innerText;
            const priceText = card.querySelector('.price').innerText;
            // Clean the price (remove ₹ and commas)
            const price = parseFloat(priceText.replace('₹', '').replace(',', ''));
            const image = card.querySelector('img').src;
            
            // Create product object
            const product = {
                title: title,
                price: price,
                image: image,
                id: Date.now() // Simple unique ID
            };

            // Add to LocalStorage
            addToLocalStorage(product);

            // Visual Feedback
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fas fa-check"></i> Added';
            this.style.backgroundColor = '#0B132B';
            this.style.color = '#fff';
            
            updateCartBadge();

            // Reset button after 2 seconds
            setTimeout(() => {
                this.innerHTML = originalText;
                this.style.backgroundColor = '';
                this.style.color = '';
            }, 2000);
        });
    });

    // --- 3. Mobile Menu Logic ---
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const closeMenu = document.querySelector('.close-menu');

    if(hamburger) {
        hamburger.addEventListener('click', () => mobileMenu.classList.add('active'));
        closeMenu.addEventListener('click', () => mobileMenu.classList.remove('active'));
    }

    // --- 4. Helper Functions ---
    function addToLocalStorage(product) {
        let cart = JSON.parse(localStorage.getItem('artvista_cart')) || [];
        cart.push(product);
        localStorage.setItem('artvista_cart', JSON.stringify(cart));
    }

    function updateCartBadge() {
        let cart = JSON.parse(localStorage.getItem('artvista_cart')) || [];
        const badges = document.querySelectorAll('.badge');
        badges.forEach(b => b.innerText = cart.length);
    }
    
    // Make the cart icon clickable to go to checkout
    const cartIcons = document.querySelectorAll('.cart-icon');
    cartIcons.forEach(icon => {
        icon.style.cursor = 'pointer';
        icon.addEventListener('click', () => {
            window.location.href = 'checkout.html';
        });
    });
});