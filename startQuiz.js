import { quizData } from "./quizQuestions.js";

// default players
let leaderboard = [
    { name: "Alex", score: 3500 },
    { name: "Emma", score: 2500 },
    { name: "John", score: 1500 }
];


let currentQuestionIndex = 0;
let score = 0;

const questionText = document.getElementById("question");
const optionsContainer = document.getElementById("options");
const hintText = document.getElementById("hint");
const scoreText = document.getElementById("score");
const nextBtn = document.getElementById("nextBtn");
const questionCount = document.getElementById("questionCount");
const totalQuestions = quizData.length;

// Load First Question
loadQuestion();

function loadQuestion() {
    if (currentQuestionIndex >= quizData.length) {
        showFinalResults();
        return;
    }

    let currentQuestion = quizData[currentQuestionIndex];

    questionText.innerText = currentQuestion.question;
    optionsContainer.innerHTML = "";
    hintText.innerText = currentQuestion.hint;
    questionCount.innerText = currentQuestionIndex + 1 + " of " + totalQuestions;

    currentQuestion.options.forEach(option => {
        let button = document.createElement("button");
        button.innerText = option;
        button.classList.add("btn", "btn-outline-dark", "w-100", "mt-2");
        button.onclick = () => checkAnswer(button, option, currentQuestion.correct);
        optionsContainer.appendChild(button);
    });
}

function checkAnswer(button, selectedOption, correctOption) {
    let buttons = optionsContainer.querySelectorAll("button");

    if (selectedOption === correctOption) {
        button.classList.add("correct");
        score += 500; 
    } else {
        button.classList.add("btn-danger"); 
        buttons.forEach(btn => {
            if (btn.innerText === correctOption) {
                btn.classList.add("correct"); 
            }
        });
    }

    buttons.forEach(btn => btn.disabled = true); 

    scoreText.innerText = "Score: " + score;

    nextBtn.style.display = "block"; 
}



nextBtn.addEventListener("click", () => {
    currentQuestionIndex++;
    nextBtn.style.display = "none";
    loadQuestion();
});

function showFinalResults() {
    leaderboard.push({ name: "You", score: score });

    leaderboard.sort((a, b) => b.score - a.score);

    let leaderboardHTML = `
        <div class="leaderboard p-3">
            <h3 class="text-center fw-bold">Leaderboard</h3>
            <h4 class="text-center text-success">Your Score: ${score} points</h4>
            <ul class="list-group mt-3">`;

    leaderboard.forEach((player, index) => {
        leaderboardHTML += `
            <li class="list-group-item d-flex justify-content-between">
                <span>${index + 1}. ${player.name}</span> 
                <span class="fw-bold">${player.score} Points</span>
            </li>`;
    });

    leaderboardHTML += `</ul></div>`;

    let totalQuestions = quizData.length;
    let correctAnswers = score / 500;

    let progressHTML = `
        <div class="score-summary p-4 text-center">
            <h4 class="fw-bold">🎉 Congrats!</h4>
            <div class="progress-circle">
                <svg viewBox="0 0 36 36" class="circular-chart">
                    <path class="circle-bg" d="M18 2a16 16 0 1 1 0 32a16 16 0 1 1 0-32"/>
                    <path class="circle"
                        stroke-dasharray="${(correctAnswers / totalQuestions) * 100}, 100"
                        d="M18 2a16 16 0 1 1 0 32a16 16 0 1 1 0-32"/>
                </svg>
                <div class="progress-text">
                    <span class="fw-bold">${correctAnswers}/${totalQuestions}</span>
                    <p>${score} points</p>
                </div>
            </div>
            <button class="btn btn-primary mt-3" id="playAgainBtn">🔄 Play Again</button>
        </div>`;

    document.querySelector(".quiz-container").innerHTML = `
        <div class="results-container">
            ${leaderboardHTML}
            ${progressHTML}
        </div>`;

    document.getElementById("playAgainBtn").addEventListener("click", () => {
        restartQuiz();
    });
}




function restartQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    document.location.reload(); // Reload Page
}
