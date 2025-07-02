document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const taskInput = document.getElementById('task-input');
    const addTaskBtn = document.getElementById('add-task-btn');
    const todoList = document.getElementById('todo-list');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const clearCompletedBtn = document.getElementById('clear-completed');
    const tasksCount = document.getElementById('tasks-count');
    const themeToggle = document.querySelector('.theme-toggle');
    const body = document.body;

    // Theme functionality
    const savedTheme = localStorage.getItem('theme') || 'light';
    body.setAttribute('data-theme', savedTheme);
    
    themeToggle.addEventListener('click', () => {
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });

    // Task array
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    // Render tasks
    function renderTasks(filter = 'all') {
        todoList.innerHTML = '';
        
        let filteredTasks = [...tasks];
        
        if (filter === 'active') {
            filteredTasks = tasks.filter(task => !task.completed);
        } else if (filter === 'completed') {
            filteredTasks = tasks.filter(task => task.completed);
        }
        
        if (filteredTasks.length === 0) {
            const emptyMessage = document.createElement('li');
            emptyMessage.className = 'empty-message';
            emptyMessage.textContent = filter === 'all' ? 'No tasks yet. Add one above!' : 
                                      filter === 'active' ? 'No active tasks!' : 'No completed tasks!';
            todoList.appendChild(emptyMessage);
        } else {
            filteredTasks.forEach((task, index) => {
                const taskItem = document.createElement('li');
                taskItem.className = 'todo-item';
                if (task.completed) {
                    taskItem.classList.add('completed');
                }
                
                taskItem.innerHTML = `
                    <input type="checkbox" class="todo-checkbox" ${task.completed ? 'checked' : ''} data-id="${task.id}">
                    <span class="todo-text">${task.text}</span>
                    <div class="todo-actions">
                        <button class="edit-btn" data-id="${task.id}"><i class="fas fa-edit"></i></button>
                        <button class="delete-btn" data-id="${task.id}"><i class="fas fa-trash"></i></button>
                    </div>
                `;
                
                todoList.appendChild(taskItem);
            });
        }
        
        updateTasksCount();
    }

    // Add new task
    function addTask() {
        const taskText = taskInput.value.trim();
        
        if (taskText) {
            const newTask = {
                id: Date.now(),
                text: taskText,
                completed: false,
                createdAt: new Date()
            };
            
            tasks.unshift(newTask);
            saveTasks();
            renderTasks(getCurrentFilter());
            taskInput.value = '';
            
            // Show success notification
            showNotification('Task added successfully!', 'success');
        } else {
            showNotification('Please enter a task!', 'error');
        }
    }

    // Update task status (completed/active)
    function updateTaskStatus(taskId) {
        tasks = tasks.map(task => {
            if (task.id === taskId) {
                return { ...task, completed: !task.completed };
            }
            return task;
        });
        
        saveTasks();
        renderTasks(getCurrentFilter());
    }

    // Edit task
    function editTask(taskId) {
        const task = tasks.find(task => task.id === taskId);
        const newText = prompt('Edit your task:', task.text);
        
        if (newText !== null && newText.trim() !== '') {
            task.text = newText.trim();
            saveTasks();
            renderTasks(getCurrentFilter());
            showNotification('Task updated successfully!', 'success');
        }
    }

    // Delete task
    function deleteTask(taskId) {
        if (confirm('Are you sure you want to delete this task?')) {
            tasks = tasks.filter(task => task.id !== taskId);
            saveTasks();
            renderTasks(getCurrentFilter());
            showNotification('Task deleted successfully!', 'success');
        }
    }

    // Clear completed tasks
    function clearCompletedTasks() {
        tasks = tasks.filter(task => !task.completed);
        saveTasks();
        renderTasks(getCurrentFilter());
        showNotification('Completed tasks cleared!', 'success');
    }

    // Update tasks count
    function updateTasksCount() {
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(task => task.completed).length;
        const activeTasks = totalTasks - completedTasks;
        
        tasksCount.textContent = `${activeTasks} ${activeTasks === 1 ? 'task' : 'tasks'} remaining (${totalTasks} total)`;
    }

    // Save tasks to localStorage
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Get current filter
    function getCurrentFilter() {
        const activeFilter = document.querySelector('.filter-btn.active');
        return activeFilter ? activeFilter.dataset.filter : 'all';
    }

    // Show notification
    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
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
        }, 3000);
    }

    // Event listeners
    addTaskBtn.addEventListener('click', addTask);
    
    taskInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addTask();
        }
    });
    
    todoList.addEventListener('click', function(e) {
        if (e.target.classList.contains('todo-checkbox')) {
            const taskId = parseInt(e.target.dataset.id);
            updateTaskStatus(taskId);
        }
        
        if (e.target.classList.contains('edit-btn') || e.target.closest('.edit-btn')) {
            const btn = e.target.classList.contains('edit-btn') ? e.target : e.target.closest('.edit-btn');
            const taskId = parseInt(btn.dataset.id);
            editTask(taskId);
        }
        
        if (e.target.classList.contains('delete-btn') || e.target.closest('.delete-btn')) {
            const btn = e.target.classList.contains('delete-btn') ? e.target : e.target.closest('.delete-btn');
            const taskId = parseInt(btn.dataset.id);
            deleteTask(taskId);
        }
    });
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            renderTasks(this.dataset.filter);
        });
    });
    
    clearCompletedBtn.addEventListener('click', clearCompletedTasks);

    // Initialize
    renderTasks();
});

// Add notification styles dynamically
const style = document.createElement('style');
style.textContent = `
    .notification {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        padding: 1rem 2rem;
        border-radius: 5px;
        color: white;
        font-weight: 500;
        opacity: 0;
        transition: opacity 0.3s ease;
        z-index: 1000;
    }
    
    .notification.show {
        opacity: 1;
    }
    
    .notification.success {
        background-color: #4CAF50;
    }
    
    .notification.error {
        background-color: #f44336;
    }
`;
document.head.appendChild(style);