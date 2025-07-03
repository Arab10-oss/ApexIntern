document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded - initializing GroceryHub'); // Debug log

    // Sample product data
    const products = [
        {
            id: 1,
            name: "Organic Apples",
            price: 3.99,
            category: "fruits",
            image: "https://images.pexels.com/photos/1510392/pexels-photo-1510392.jpeg?cs=srgb&dl=pexels-suzyhazelwood-1510392.jpg&fm=jpg",
            rating: 4,
            sale: false
        },
        {
            id: 2,
            name: "Bananas",
            price: 0.99,
            category: "fruits",
            image: "https://www.southernliving.com/thmb/EM-f8L_T36WluwBtBkhD4gnCKg8=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/How_To_Freeze_Bananas_023-71e81efacb6a4d87a3596b8c2c519884.jpg",
            rating: 5,
            sale: false
        },
        {
            id: 3,
            name: "Carrots",
            price: 2.49,
            category: "vegetables",
            image: "https://media.istockphoto.com/id/1388403435/photo/fresh-carrots-isolated-on-white-background.jpg?s=612x612&w=0&k=20&c=XmrTb_nASc7d-4zVKUz0leeTT4fibDzWi_GpIun0Tlc=",
            rating: 4,
            sale: false
        },
        {
            id: 4,
            name: "Broccoli",
            price: 1.99,
            category: "vegetables",
            image: "https://media.istockphoto.com/id/1364035705/photo/fresh-broccoli-on-white-background.jpg?s=612x612&w=0&k=20&c=fEcEq65rKBmT8PltpAyg_-na0WomTJ6S6m04uXQQtJs=",
            rating: 3,
            sale: true,
            originalPrice: 2.99
        },
        {
            id: 5,
            name: "Milk",
            price: 3.49,
            category: "dairy",
            image: "https://img.freepik.com/free-vector/milk-products-template_1284-14600.jpg?semt=ais_items_boosted&w=740",
            rating: 5,
            sale: false
        },
        {
            id: 6,
            name: "Eggs",
            price: 4.99,
            category: "dairy",
            image: "https://media.istockphoto.com/id/536878363/photo/in-hands-of-woman-packing-eggs-in-supermarket.jpg?s=612x612&w=0&k=20&c=_SLc1_GjqBqBHkx5MOzgqW5duwPZtVSeSWfH8TW80nw=",
            rating: 4,
            sale: false
        },
        {
            id: 7,
            name: "Chicken Breast",
            price: 7.99,
            category: "meat",
            image: "https://assets.tendercuts.in/product/C/H/594e4559-f6b7-417d-9aac-d0643b5711d3.jpg",
            rating: 5,
            sale: true,
            originalPrice: 9.99
        },
        {
            id: 8,
            name: "Ground Beef",
            price: 6.49,
            category: "meat",
            image: "https://www.shutterstock.com/image-photo/fresh-ground-beef-cooking-delicious-260nw-2390250333.jpg",
            rating: 4,
            sale: false
        }
    ];

    // Cart functionality
    let cart = [];
    const cartCount = document.querySelector('.cart-count');
    const cartModal = document.getElementById('cart-modal');
    const cartBody = document.getElementById('cart-body');
    const cartTotal = document.getElementById('cart-total');
    const closeCartBtn = document.querySelector('.close-cart');
    const clearCartBtn = document.getElementById('clear-cart');
    const printBillBtn = document.getElementById('print-bill');
    const cartIcon = document.querySelector('.cart-icon');

    // Display products
    const productGrid = document.getElementById('product-grid');
    const categoryFilter = document.getElementById('category-filter');
    const sortBy = document.getElementById('sort-by');

    function displayProducts(productsToDisplay) {
        console.log('Displaying products:', productsToDisplay.length);
        productGrid.innerHTML = '';
        
        if (productsToDisplay.length === 0) {
            productGrid.innerHTML = '<p class="no-products">No products found matching your criteria</p>';
            return;
        }
        
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
                    <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/300?text=Product+Image'">
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
        
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', function() {
                const productId = parseInt(this.getAttribute('data-id'));
                const product = products.find(p => p.id === productId);
                addToCart(product);
            });
        });
    }

    function filterAndSortProducts() {
        const category = categoryFilter.value;
        const sort = sortBy.value;
        
        let filteredProducts = [...products];
        
        if (category !== 'all') {
            filteredProducts = filteredProducts.filter(product => product.category === category);
        }
        
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
        updateCartModal();
        
        // Show notification
        showNotification(`${product.name} added to cart!`);
    }

    // Update cart count
    function updateCartCount() {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
    }

    // Update cart modal
    function updateCartModal() {
        cartBody.innerHTML = '';
        
        if (cart.length === 0) {
            cartBody.innerHTML = '<p>Your cart is empty</p>';
            cartTotal.textContent = '0.00';
            return;
        }
        
        let total = 0;
        
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            cartItem.innerHTML = `
                <div class="cart-item-info">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-image" onerror="this.src='https://via.placeholder.com/100?text=Product'">
                    <div class="cart-item-details">
                        <div class="cart-item-title">${item.name}</div>
                        <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                    </div>
                </div>
                <div class="cart-item-actions">
                    <button class="btn btn-small decrease-quantity" data-id="${item.id}">-</button>
                    <span class="cart-item-quantity">${item.quantity}</span>
                    <button class="btn btn-small increase-quantity" data-id="${item.id}">+</button>
                    <i class="fas fa-trash cart-item-remove" data-id="${item.id}"></i>
                </div>
            `;
            
            cartBody.appendChild(cartItem);
        });
        
        cartTotal.textContent = total.toFixed(2);
        
        // Add event listeners to quantity buttons
        document.querySelectorAll('.increase-quantity').forEach(button => {
            button.addEventListener('click', function() {
                const productId = parseInt(this.getAttribute('data-id'));
                const item = cart.find(item => item.id === productId);
                if (item) {
                    item.quantity += 1;
                    updateCartModal();
                    updateCartCount();
                }
            });
        });
        
        document.querySelectorAll('.decrease-quantity').forEach(button => {
            button.addEventListener('click', function() {
                const productId = parseInt(this.getAttribute('data-id'));
                const item = cart.find(item => item.id === productId);
                if (item && item.quantity > 1) {
                    item.quantity -= 1;
                    updateCartModal();
                    updateCartCount();
                }
            });
        });
        
        document.querySelectorAll('.cart-item-remove').forEach(button => {
            button.addEventListener('click', function() {
                const productId = parseInt(this.getAttribute('data-id'));
                cart = cart.filter(item => item.id !== productId);
                updateCartModal();
                updateCartCount();
                showNotification('Item removed from cart');
            });
        });
    }

    // Show notification
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
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

    // Print bill function
    function printBill() {
        if (cart.length === 0) {
            showNotification('Your cart is empty');
            return;
        }
        
        const printArea = document.getElementById('print-area');
        const printItems = document.getElementById('print-items');
        const printTotal = document.getElementById('print-total');
        const printDate = document.getElementById('print-date');
        
        // Set current date
        const now = new Date();
        printDate.textContent = now.toLocaleDateString() + ' ' + now.toLocaleTimeString();
        
        // Clear previous items
        printItems.innerHTML = `
            <thead>
                <tr>
                    <th>Item</th>
                    <th>Qty</th>
                    <th>Price</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
            </tbody>
        `;
        
        const tbody = printItems.querySelector('tbody');
        let total = 0;
        
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>$${item.price.toFixed(2)}</td>
                <td>$${itemTotal.toFixed(2)}</td>
            `;
            tbody.appendChild(row);
        });
        
        printTotal.textContent = total.toFixed(2);
        
        // Show print dialog
        const printWindow = window.open('', '', 'width=600,height=600');
        printWindow.document.write(`
            <html>
                <head>
                    <title>GroceryHub - Order Receipt</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 20px; }
                        h2, h3 { color: #4CAF50; }
                        table { width: 100%; border-collapse: collapse; margin: 15px 0; }
                        th { text-align: left; padding: 8px; background-color: #f2f2f2; }
                        td { padding: 8px; border-bottom: 1px solid #ddd; }
                        .print-total { text-align: right; font-weight: bold; font-size: 1.1em; margin-top: 10px; }
                        .print-footer { text-align: center; margin-top: 20px; font-style: italic; color: #666; }
                    </style>
                </head>
                <body>
                    ${printArea.innerHTML}
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        printWindow.close();
    }

    // Initialize
    displayProducts(products);
    
    // Event listeners for filters
    categoryFilter.addEventListener('change', filterAndSortProducts);
    sortBy.addEventListener('change', filterAndSortProducts);
    
    // Cart modal events
    cartIcon.addEventListener('click', function() {
        cartModal.style.display = 'block';
        updateCartModal();
    });
    
    closeCartBtn.addEventListener('click', function() {
        cartModal.style.display = 'none';
    });
    
    clearCartBtn.addEventListener('click', function() {
        cart = [];
        updateCartCount();
        updateCartModal();
        showNotification('Cart cleared');
    });
    
    printBillBtn.addEventListener('click', printBill);
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === cartModal) {
            cartModal.style.display = 'none';
        }
    });
    
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