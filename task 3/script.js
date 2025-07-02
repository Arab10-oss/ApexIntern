document.addEventListener('DOMContentLoaded', () => {
    
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
    const categorySelect = document.getElementById('category');

  
    let currentQuestionIndex = 0;
    let score = 0;
    let questions = [];
    let timer;
    let timeLeft = 30;
    let correctAnswers = 0;
    let incorrectAnswers = 0;

    const API_URL = 'https://opentdb.com/api.php';

    startBtn.addEventListener('click', startQuiz);
    nextBtn.addEventListener('click', showNextQuestion);
    restartBtn.addEventListener('click', restartQuiz);

    async function startQuiz() {
        const category = categorySelect.value;
        try {
            const response = await fetch(`${API_URL}?amount=10&category=${category}&difficulty=medium&type=multiple`);
            const data = await response.json();
            
            if (data.response_code === 0) {
                questions = data.results.map(question => {
                    const formattedQuestion = {
                        question: decodeHtml(question.question),
                        correctAnswer: decodeHtml(question.correct_answer),
                        incorrectAnswers: question.incorrect_answers.map(answer => decodeHtml(answer))
                    };
                    
                    const allAnswers = [
                        formattedQuestion.correctAnswer,
                        ...formattedQuestion.incorrectAnswers
                    ].sort(() => Math.random() - 0.5);
                    
                    return {
                        ...formattedQuestion,
                        allAnswers
                    };
                });
                
                introSection.style.display = 'none';
                quizSection.style.display = 'block';
                
                showQuestion();
                startTimer();
            } else {
                alert('Failed to load questions. Please try again.');
            }
        } catch (error) {
            console.error('Error fetching questions:', error);
            alert('An error occurred while loading questions. Please try again.');
        }
    }

    function showQuestion() {
        resetState();
        const currentQuestion = questions[currentQuestionIndex];
        const questionNo = currentQuestionIndex + 1;
        
        progressBar.style.width = `${(questionNo / questions.length) * 100}%`;
        
        questionElement.textContent = currentQuestion.question;
        
        currentQuestion.allAnswers.forEach(answer => {
            const button = document.createElement('button');
            button.textContent = answer;
            button.classList.add('option-btn');
            button.addEventListener('click', selectAnswer);
            optionsElement.appendChild(button);
        });
    }

    function resetState() {
        clearInterval(timer);
        timeLeft = 30;
        timeElement.textContent = timeLeft;
        timeElement.classList.remove('timer-animation');
        nextBtn.style.display = 'none';
        
        while (optionsElement.firstChild) {
            optionsElement.removeChild(optionsElement.firstChild);
        }
    }

    function startTimer() {
        timeElement.textContent = timeLeft;
        
        timer = setInterval(() => {
            timeLeft--;
            timeElement.textContent = timeLeft;
            
            if (timeLeft <= 5) {
                timeElement.classList.add('timer-animation');
            }
            
            if (timeLeft <= 0) {
                clearInterval(timer);
                timeUp();
            }
        }, 1000);
    }

    function timeUp() {
        const currentQuestion = questions[currentQuestionIndex];
        incorrectAnswers++;
        
        const options = document.querySelectorAll('.option-btn');
        options.forEach(option => {
            option.disabled = true;
            
            if (option.textContent === currentQuestion.correctAnswer) {
                option.classList.add('correct');
            }
        });
        
        nextBtn.style.display = 'block';
    }

    function selectAnswer(e) {
        const selectedButton = e.target;
        const currentQuestion = questions[currentQuestionIndex];
        const correct = selectedButton.textContent === currentQuestion.correctAnswer;
        
        const options = document.querySelectorAll('.option-btn');
        options.forEach(option => {
            option.disabled = true;
            
            if (option.textContent === currentQuestion.correctAnswer) {
                option.classList.add('correct');
            }
        });
        
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

    function showNextQuestion() {
        currentQuestionIndex++;
        
        if (currentQuestionIndex < questions.length) {
            showQuestion();
            startTimer();
        } else {
            showResult();
        }
    }

    function showResult() {
        quizSection.style.display = 'none';
        resultSection.style.display = 'block';
        
        finalScoreElement.textContent = score;
        correctElement.textContent = correctAnswers;
        incorrectElement.textContent = incorrectAnswers;
    }

    function restartQuiz() {
        currentQuestionIndex = 0;
        score = 0;
        correctAnswers = 0;
        incorrectAnswers = 0;
        
        scoreElement.textContent = score;
        resultSection.style.display = 'none';
        introSection.style.display = 'block';
    }

    function decodeHtml(html) {
        const txt = document.createElement('textarea');
        txt.innerHTML = html;
        return txt.value;
    }
});