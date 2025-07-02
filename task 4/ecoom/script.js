document.addEventListener('DOMContentLoaded', function() {
    // Sample product data
    const products = [
        {
            id: 1,
            name: "Organic Apples",
            price: 3.99,
            category: "fruits",
            image: "https://via.placeholder.com/300x200?text=Organic+Apples",
            rating: 4,
            sale: false
        },
        {
            id: 2,
            name: "Bananas",
            price: 0.99,
            category: "fruits",
            image: "https://via.placeholder.com/300x200?text=Bananas",
            rating: 5,
            sale: false
        },
        {
            id: 3,
            name: "Carrots",
            price: 2.49,
            category: "vegetables",
            image: "https://via.placeholder.com/300x200?text=Carrots",
            rating: 4,
            sale: false
        },
        {
            id: 4,
            name: "Broccoli",
            price: 1.99,
            category: "vegetables",
            image: "https://via.placeholder.com/300x200?text=Broccoli",
            rating: 3,
            sale: true,
            originalPrice: 2.99
        },
        {
            id: 5,
            name: "Milk",
            price: 3.49,
            category: "dairy",
            image: "https://via.placeholder.com/300x200?text=Milk",
            rating: 5,
            sale: false
        },
        {
            id: 6,
            name: "Eggs",
            price: 4.99,
            category: "dairy",
            image: "https://via.placeholder.com/300x200?text=Eggs",
            rating: 4,
            sale: false
        },
        {
            id: 7,
            name: "Chicken Breast",
            price: 7.99,
            category: "meat",
            image: "https://via.placeholder.com/300x200?text=Chicken+Breast",
            rating: 5,
            sale: true,
            originalPrice: 9.99
        },
        {
            id: 8,
            name: "Ground Beef",
            price: 6.49,
            category: "meat",
            image: "https://via.placeholder.com/300x200?text=Ground+Beef",
            rating: 4,
            sale: false
        }
    ];

    // Cart functionality
    let cart = [];
    const cartCount = document.querySelector('.cart-count');

    // Display products
    const productGrid = document.getElementById('product-grid');
    const categoryFilter = document.getElementById('category-filter');
    const sortBy = document.getElementById('sort-by');

    function displayProducts(productsToDisplay) {
        productGrid.innerHTML = '';
        
        productsToDisplay.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            
            let badge = '';
            if (product.sale) {
                badge = `<div class="product-badge">SALE</div>`;
            }
            
            let ratingStars = '';
            for (let i = 0; i < 5; i++) {
                if (i < product.rating) {
                    ratingStars += '<i class="fas fa-star"></i>';
                } else {
                    ratingStars += '<i class="far fa-star"></i>';
                }
            }
            
            let priceHtml = `<div class="price">$${product.price.toFixed(2)}</div>`;
            if (product.sale) {
                priceHtml = `
                    <div class="price">
                        <span class="original-price">$${product.originalPrice.toFixed(2)}</span>
                        <span class="sale-price">$${product.price.toFixed(2)}</span>
                    </div>
                `;
            }
            
            productCard.innerHTML = `
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                    ${badge}
                </div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    ${priceHtml}
                    <div class="rating">${ratingStars}</div>
                    <button class="btn add-to-cart" data-id="${product.id}">Add to Cart</button>
                </div>
            `;
            
            productGrid.appendChild(productCard);
        });
        
        // Add event listeners to "Add to Cart" buttons
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', function() {
                const productId = parseInt(this.getAttribute('data-id'));
                const product = products.find(p => p.id === productId);
                addToCart(product);
            });
        });
    }

    // Filter and sort products
    function filterAndSortProducts() {
        const category = categoryFilter.value;
        const sort = sortBy.value;
        
        let filteredProducts = [...products];
        
        // Filter by category
        if (category !== 'all') {
            filteredProducts = filteredProducts.filter(product => product.category === category);
        }
        
        // Sort products
        switch(sort) {
            case 'price-low':
                filteredProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                filteredProducts.sort((a, b) => b.price - a.price);
                break;
            case 'name':
                filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
                break;
            default:
                // No sorting or default sorting
                break;
        }
        
        displayProducts(filteredProducts);
    }

    // Add to cart function
    function addToCart(product) {
        const existingItem = cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                ...product,
                quantity: 1
            });
        }
        
        updateCartCount();
        
        // Show notification
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = `${product.name} added to cart!`;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 2000);
    }

    // Update cart count
    function updateCartCount() {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
    }

    // Initialize
    displayProducts(products);
    
    // Event listeners for filters
    categoryFilter.addEventListener('change', filterAndSortProducts);
    sortBy.addEventListener('change', filterAndSortProducts);
    
    // Countdown timer for deal of the day
    function updateCountdown() {
        const now = new Date();
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 0);
        
        const diff = endOfDay - now;
        
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
        document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
        document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
    }
    
    updateCountdown();
    setInterval(updateCountdown, 1000);
    
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navIcons = document.querySelector('.nav-icons');
    
    hamburger.addEventListener('click', function() {
        this.classList.toggle('active');
        navIcons.classList.toggle('active');
    });
});