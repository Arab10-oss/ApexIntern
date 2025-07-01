document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const successMessage = document.getElementById('successMessage');
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
       
        clearErrors();
        

        const isValid = validateForm();
        
        if (isValid) {
            successMessage.textContent = 'Thank you for your message! We will get back to you soon.';
            successMessage.style.display = 'block';
            
            contactForm.reset();
            
            setTimeout(() => {
                successMessage.style.display = 'none';
            }, 5000);
        }
    });
    
    function validateForm() {
        let isValid = true;
        
        const name = document.getElementById('name').value.trim();
        if (name === '') {
            document.getElementById('nameError').textContent = 'Name is required';
            isValid = false;
        } else if (name.length < 3) {
            document.getElementById('nameError').textContent = 'Name must be at least 3 characters';
            isValid = false;
        }
        
        const email = document.getElementById('email').value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email === '') {
            document.getElementById('emailError').textContent = 'Email is required';
            isValid = false;
        } else if (!emailRegex.test(email)) {
            document.getElementById('emailError').textContent = 'Please enter a valid email';
            isValid = false;
        }
        
        const phone = document.getElementById('phone').value.trim();
        if (phone && !/^\d{10}$/.test(phone)) {
            document.getElementById('phoneError').textContent = 'Please enter a valid 10-digit phone number';
            isValid = false;
        }
        
        const subject = document.getElementById('subject').value;
        if (subject === '') {
            document.getElementById('subjectError').textContent = 'Please select a subject';
            isValid = false;
        }
        
        const message = document.getElementById('message').value.trim();
        if (message === '') {
            document.getElementById('messageError').textContent = 'Message is required';
            isValid = false;
        } else if (message.length < 10) {
            document.getElementById('messageError').textContent = 'Message must be at least 10 characters';
            isValid = false;
        }
        
        return isValid;
    }
    
    function clearErrors() {
        const errorMessages = document.querySelectorAll('.error-message');
        errorMessages.forEach(msg => {
            msg.textContent = '';
        });
    }
    
    
    const todoContainer = document.createElement('div');
    todoContainer.className = 'container';
    todoContainer.innerHTML = `
        <h2>To-Do List</h2>
        <div class="todo-app">
            <input type="text" id="todoInput" placeholder="Add a new task">
            <button id="addTodo">Add Task</button>
            <ul id="todoList"></ul>
        </div>
    `;
    
    document.body.appendChild(todoContainer);
    
    const todoInput = document.getElementById('todoInput');
    const addTodoBtn = document.getElementById('addTodo');
    const todoList = document.getElementById('todoList');
    
    addTodoBtn.addEventListener('click', addTodo);
    todoInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addTodo();
        }
    });
    
    function addTodo() {
        const task = todoInput.value.trim();
        if (task) {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${task}</span>
                <button class="delete-btn">×</button>
            `;
            
            const deleteBtn = li.querySelector('.delete-btn');
            deleteBtn.addEventListener('click', function() {
                li.remove();
            });
            
            todoList.appendChild(li);
            todoInput.value = '';
        }
    }
});