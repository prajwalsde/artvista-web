document.addEventListener('DOMContentLoaded', () => {

    // Database of Products
    const products = {
        "fcb": {
            title: "FC Barcelona Club Logo Frame",
            price: 499, // Numeric price for calculations
            priceDisplay: "₹499.00", // String for display
            category: "Football Clubs",
            description: "Show your loyalty with this stylish logo-themed frame. Ideal for sports rooms, offices, or fan caves. Printed on high-quality materials and framed for longevity. This frame captures the essence of the club's history.",
            images: [
                "assets/images/fcb/Main-1.png",
                "assets/images/fcb/Main-2.png",
                "assets/images/fcb/Main-3.png",
                "assets/images/fcb/Main-4.png",
                "assets/images/fcb/Main-5.png"
            ]
        },
        "messi": {
            title: "Messi 'The GOAT' Celebration",
            price: 499,
            priceDisplay: "₹499.00",
            category: "Legends",
            description: "A heartfelt tribute to Messi's most emotional celebration. This frame tells a story of love, passion, and greatness. A must-have for any true football historian.",
            images: [
                "assets/images/messi/Main-1.png",
                "assets/images/messi/Main-2.png",
                "assets/images/messi/Main-3.png",
                "assets/images/messi/Main-4.png",
                "assets/images/messi/Main-5.png"
            ]
        },
        "msn": {
            title: "The MSN Era Tribute",
            price: 499,
            priceDisplay: "₹499.00",
            category: "Trio Series",
            description: "Elegant tribute to the iconic Messi-Suarez-Neymar era. Perfect for football fans who witnessed the most dangerous attacking trio in history.",
            images: [
                "assets/images/msn/Main-1.png",
                "assets/images/msn/Main-2.png", 
                "assets/images/msn/Main-3.png",
                "assets/images/msn/Main-4.png",
                "assets/images/msn/Main-5.png"
            ]
        },
        "champions": {
            title: "Champions League Legacy",
            price: 499,
            priceDisplay: "₹499.00",
            category: "Moments",
            description: "Celebrate the legendary UEFA Champions League victory. This premium frame showcases the triumph and legacy of the team.",
            images: [
                "assets/images/champions/Main-1.png",
                "assets/images/champions/Main-2.png",
                "assets/images/champions/Main-3.png",
                "assets/images/champions/Main-4.png",
                "assets/images/champions/Main-5.png"
            ]
        },
        "combo": {
            title: "Ultimate Fan Combo (Set of 4)",
            price: 1999,
            priceDisplay: "₹1999.00",
            category: "Value Pack",
            description: "Get the best of all collections in one value pack. The perfect gift for FC Barcelona fans and sports lovers. Includes the Logo frame, MSN, Messi, and Champions League frames.",
            images: [
                "assets/images/combo/Main-1.png",
                "assets/images/combo/Main-2.png",
                "assets/images/combo/Main-3.png",
                "assets/images/combo/Main-4.png",
                "assets/images/combo/Main-5.png",
                "assets/images/combo/Main-6.png",
                "assets/images/combo/Main-7.png",
                "assets/images/combo/Main-8.png"
            ]
        }
    };

    // 1. Get the Product ID from the URL (e.g., ?id=fcb)
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    // 2. Load Data
    const product = products[productId];

    // Initial Badge Update on page load
    updateCartBadge();

    if (product) {
        // Fill Text Data
        document.getElementById('pTitle').innerText = product.title;
        document.getElementById('pPrice').innerText = product.priceDisplay; // Use Display price
        document.getElementById('pCategory').innerText = product.category;
        document.getElementById('pDesc').innerText = product.description;

        // Fill Images
        const mainImg = document.getElementById('mainImg');
        const thumbContainer = document.getElementById('thumbnailContainer');
        
        // Set first image as main
        if (product.images.length > 0) {
            mainImg.src = product.images[0];
        } else {
            mainImg.alt = "No Image Available";
        }

        // Generate Thumbnails
        product.images.forEach((imgSrc, index) => {
            const thumb = document.createElement('img');
            thumb.src = imgSrc;
            thumb.classList.add('thumbnail');
            if(index === 0) thumb.classList.add('active');

            // Click event to swap image
            thumb.addEventListener('click', () => {
                mainImg.src = imgSrc;
                // Update active class
                document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
                thumb.classList.add('active');
            });

            thumbContainer.appendChild(thumb);
        });

        // --- ADD TO CART LOGIC START ---
        const addToCartBtn = document.getElementById('addToCartBtn');
        
        if(addToCartBtn) {
            addToCartBtn.addEventListener('click', function() {
                // Create item object for cart
                const cartItem = {
                    title: product.title,
                    price: product.price, // Use numeric price
                    image: product.images[0],
                    id: Date.now() // Unique ID for this specific item
                };

                // Save to LocalStorage
                let cart = JSON.parse(localStorage.getItem('artvista_cart')) || [];
                cart.push(cartItem);
                localStorage.setItem('artvista_cart', JSON.stringify(cart));

                // Update Badge
                updateCartBadge();

                // Button Visual Feedback
                const originalText = this.innerText;
                this.innerHTML = '<i class="fas fa-check"></i> Added';
                this.style.backgroundColor = '#0B132B';
                this.style.color = '#fff';
                this.style.borderColor = '#0B132B';
                
                setTimeout(() => {
                    this.innerText = originalText;
                    this.style.backgroundColor = '';
                    this.style.color = '';
                    this.style.borderColor = '';
                }, 2000);
            });
        }
        // --- ADD TO CART LOGIC END ---

    } else {
        // If product not found
        if(window.location.pathname.includes('product.html')) {
             document.querySelector('.product-wrapper').innerHTML = "<h2>Product not found. <a href='index.html'>Go Home</a></h2>";
        }
    }

    // Helper: Update Badge Count
    function updateCartBadge() {
        let cart = JSON.parse(localStorage.getItem('artvista_cart')) || [];
        const badges = document.querySelectorAll('.badge');
        badges.forEach(b => b.innerText = cart.length);
    }
    
    // Helper: Go to checkout when bag icon clicked
    const cartIcon = document.querySelector('.cart-icon');
    if(cartIcon) {
        cartIcon.addEventListener('click', () => {
            window.location.href = 'checkout.html';
        });
    }
});