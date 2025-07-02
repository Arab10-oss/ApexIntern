document.addEventListener('DOMContentLoaded', () => {
    // Initialize particles.js
    particlesJS('particles-js', {
        "particles": {
            "number": {
                "value": 80,
                "density": {
                    "enable": true,
                    "value_area": 800
                }
            },
            "color": {
                "value": "#00f0ff"
            },
            "shape": {
                "type": "circle",
                "stroke": {
                    "width": 0,
                    "color": "#000000"
                }
            },
            "opacity": {
                "value": 0.5,
                "random": true,
                "anim": {
                    "enable": true,
                    "speed": 1,
                    "opacity_min": 0.1,
                    "sync": false
                }
            },
            "size": {
                "value": 3,
                "random": true,
                "anim": {
                    "enable": true,
                    "speed": 2,
                    "size_min": 0.1,
                    "sync": false
                }
            },
            "line_linked": {
                "enable": true,
                "distance": 150,
                "color": "#b400ff",
                "opacity": 0.4,
                "width": 1
            },
            "move": {
                "enable": true,
                "speed": 1,
                "direction": "none",
                "random": true,
                "straight": false,
                "out_mode": "out",
                "bounce": false,
                "attract": {
                    "enable": true,
                    "rotateX": 600,
                    "rotateY": 1200
                }
            }
        },
        "interactivity": {
            "detect_on": "canvas",
            "events": {
                "onhover": {
                    "enable": true,
                    "mode": "grab"
                },
                "onclick": {
                    "enable": true,
                    "mode": "push"
                },
                "resize": true
            },
            "modes": {
                "grab": {
                    "distance": 140,
                    "line_linked": {
                        "opacity": 1
                    }
                },
                "push": {
                    "particles_nb": 4
                }
            }
        },
        "retina_detect": true
    });

    // DOM Elements
    const introSection = document.getElementById('intro');
    const quizSection = document.getElementById('quiz');
    const resultSection = document.getElementById('result');
    const startBtn = document.getElementById('start-btn');
    const nextBtn = document.getElementById('next-btn');
    const restartBtn = document.getElementById('restart-btn');
    const questionElement = document.getElementById('question');
    const optionsElement = document.getElementById('options');
    const scoreElement = document.getElementById('score');
    const timeElement = document.getElementById('time');
    const finalScoreElement = document.getElementById('final-score');
    const correctElement = document.getElementById('correct');
    const incorrectElement = document.getElementById('incorrect');
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');
    const categorySelect = document.getElementById('category');
    const rocket = document.querySelector('.rocket');
    const explosion = document.querySelector('.explosion');
    const starsResult = document.querySelector('.stars-result');

    // Quiz variables
    let currentQuestionIndex = 0;
    let score = 0;
    let questions = [];
    let timer;
    let timeLeft = 30;
    let correctAnswers = 0;
    let incorrectAnswers = 0;

    // API URL - Using Open Trivia Database
    const API_URL = 'https://opentdb.com/api.php';

    // Event Listeners
    startBtn.addEventListener('click', startQuiz);
    nextBtn.addEventListener('click', showNextQuestion);
    restartBtn.addEventListener('click', restartQuiz);

    // Start the quiz
    async function startQuiz() {
        const category = categorySelect.value;
        try {
            // Show loading state
            startBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Loading Questions...</span>';
            startBtn.disabled = true;
            
            // Fetch questions from API
            const response = await fetch(`${API_URL}?amount=10&category=${category}&difficulty=medium&type=multiple`);
            const data = await response.json();
            
            if (data.response_code === 0) {
                questions = data.results.map(question => {
                    // Format the question and answers
                    const formattedQuestion = {
                        question: decodeHtml(question.question),
                        correctAnswer: decodeHtml(question.correct_answer),
                        incorrectAnswers: question.incorrect_answers.map(answer => decodeHtml(answer))
                    };
                    
                    // Combine all answers and shuffle them
                    const allAnswers = [
                        formattedQuestion.correctAnswer,
                        ...formattedQuestion.incorrectAnswers
                    ].sort(() => Math.random() - 0.5);
                    
                    return {
                        ...formattedQuestion,
                        allAnswers
                    };
                });
                
                // Hide intro and show quiz
                introSection.style.display = 'none';
                quizSection.style.display = 'block';
                
                // Start with first question
                currentQuestionIndex = 0;
                score = 0;
                correctAnswers = 0;
                incorrectAnswers = 0;
                scoreElement.textContent = score;
                showQuestion();
                startTimer();
            } else {
                alert('Failed to load questions. Please try again.');
                startBtn.innerHTML = '<span>Launch Quiz</span> <i class="fas fa-chevron-right"></i>';
                startBtn.disabled = false;
            }
        } catch (error) {
            console.error('Error fetching questions:', error);
            alert('An error occurred while loading questions. Please try again.');
            startBtn.innerHTML = '<span>Launch Quiz</span> <i class="fas fa-chevron-right"></i>';
            startBtn.disabled = false;
        }
    }

    // Display current question
    function showQuestion() {
        resetState();
        const currentQuestion = questions[currentQuestionIndex];
        const questionNo = currentQuestionIndex + 1;
        
        // Update progress bar and text
        progressBar.style.width = `${(questionNo / questions.length) * 100}%`;
        progressText.textContent = `${questionNo}/${questions.length}`;
        
        // Display question
        questionElement.textContent = currentQuestion.question;
        
        // Display options
        currentQuestion.allAnswers.forEach(answer => {
            const button = document.createElement('button');
            button.textContent = answer;
            button.classList.add('option-btn');
            button.addEventListener('click', selectAnswer);
            optionsElement.appendChild(button);
        });
    }

    // Reset quiz state for next question
    function resetState() {
        clearInterval(timer);
        timeLeft = 30;
        timeElement.textContent = timeLeft;
        timeElement.classList.remove('timer-animation');
        nextBtn.style.display = 'none';
        
        // Remove all option buttons
        while (optionsElement.firstChild) {
            optionsElement.removeChild(optionsElement.firstChild);
        }
    }

    // Start timer for current question
    function startTimer() {
        timeElement.textContent = timeLeft;
        
        timer = setInterval(() => {
            timeLeft--;
            timeElement.textContent = timeLeft;
            
            // Flash timer when time is running out
            if (timeLeft <= 5) {
                timeElement.classList.add('timer-animation');
            }
            
            if (timeLeft <= 0) {
                clearInterval(timer);
                timeUp();
            }
        }, 1000);
    }

    // Handle when time runs out
    function timeUp() {
        const currentQuestion = questions[currentQuestionIndex];
        incorrectAnswers++;
        
        // Disable all options
        const options = document.querySelectorAll('.option-btn');
        options.forEach(option => {
            option.disabled = true;
            
            // Highlight correct answer
            if (option.textContent === currentQuestion.correctAnswer) {
                option.classList.add('correct');
            }
        });
        
        nextBtn.style.display = 'block';
    }

    // Handle answer selection
    function selectAnswer(e) {
        const selectedButton = e.target;
        const currentQuestion = questions[currentQuestionIndex];
        const correct = selectedButton.textContent === currentQuestion.correctAnswer;
        
        // Disable all options
        const options = document.querySelectorAll('.option-btn');
        options.forEach(option => {
            option.disabled = true;
            
            // Highlight correct answer
            if (option.textContent === currentQuestion.correctAnswer) {
                option.classList.add('correct');
            }
        });
        
        // Highlight selected answer if incorrect
        if (!correct) {
            selectedButton.classList.add('incorrect');
            incorrectAnswers++;
        } else {
            correctAnswers++;
            score += 10;
            scoreElement.textContent = score;
        }
        
        clearInterval(timer);
        nextBtn.style.display = 'block';
    }

    // Show next question or finish quiz
    function showNextQuestion() {
        currentQuestionIndex++;
        
        if (currentQuestionIndex < questions.length) {
            showQuestion();
            startTimer();
        } else {
            showResult();
        }
    }

    // Show final result with animations
    function showResult() {
        quizSection.style.display = 'none';
        resultSection.style.display = 'block';
        
        finalScoreElement.textContent = score;
        correctElement.textContent = correctAnswers;
        incorrectElement.textContent = incorrectAnswers;
        
        // Rocket launch animation
        rocket.style.animation = 'rocket-launch 2s forwards';
        
        // Delay explosion animation
        setTimeout(() => {
            explosion.style.animation = 'explosion 1s forwards';
            starsResult.style.opacity = '1';
            starsResult.style.transition = 'opacity 1s ease';
        }, 2000);
    }

    // Restart the quiz
    function restartQuiz() {
        // Reset animations
        rocket.style.animation = '';
        explosion.style.animation = '';
        starsResult.style.opacity = '0';
        
        currentQuestionIndex = 0;
        score = 0;
        correctAnswers = 0;
        incorrectAnswers = 0;
        
        scoreElement.textContent = score;
        resultSection.style.display = 'none';
        introSection.style.display = 'block';
        
        // Reset start button
        startBtn.innerHTML = '<span>Launch Quiz</span> <i class="fas fa-chevron-right"></i>';
        startBtn.disabled = false;
    }

    // Helper function to decode HTML entities
    function decodeHtml(html) {
        const txt = document.createElement('textarea');
        txt.innerHTML = html;
        return txt.value;
    }
});