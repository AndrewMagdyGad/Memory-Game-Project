/*
 * Create a list that holds all of your cards
 */
const icons = [
    'fa fa-diamond',
    'fa fa-paper-plane-o',
    'fa fa-anchor',
    'fa fa-bolt',
    'fa fa-cube',
    'fa fa-anchor',
    'fa fa-leaf',
    'fa fa-bicycle',
    'fa fa-diamond',
    'fa fa-bomb',
    'fa fa-leaf',
    'fa fa-bomb',
    'fa fa-bolt',
    'fa fa-bicycle',
    'fa fa-paper-plane-o',
    'fa fa-cube',
];

let matchedCards = [];
let openedCards = [];

// Timer variables
let seconds = 0;
let minutes = 0;
let hours = 0;

let timerCounter;
let isTimerOn = false;

const timer = document.querySelector('.timer');
const hourTimer = document.querySelector('.hour');
const minuteTimer = document.querySelector('.minute');
const secondTimer = document.querySelector('.second');

// Moves variables
let moves = 0;
const movesCounter = document.querySelector('.moves');

// Rating variables
const starsForRate = document.querySelector('.stars');
const stars = starsForRate.childNodes;

/* Shuffle function from http://stackoverflow.com/a/2450976 */
function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue,
        randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

const displayCard = card => {
    card.classList.add('open', 'show');
};

const hideCard = card => {
    card.classList.remove('open', 'show');
};

const matchCard = card => {
    card.classList.remove('open', 'show');
    card.classList.add('match');
};

const addToOpenedCards = card => {
    if (!openedCards.includes(card)) {
        openedCards.push(card);
    }
};

const addToMatchedCards = card => {
    if (!matchedCards.includes(card)) {
        matchedCards.push(card);
    }
};

const checkMatching = () => {
    if (openedCards.length === 2) {
        return openedCards[0].innerHTML === openedCards[1].innerHTML
            ? true
            : false;
    }
    return false;
};

/* function to change the stars rating according to the number of moves */
const starsRating = () => {
    if (moves === 12) {
        stars[5].classList.add('grey');
    } else if (moves === 20) {
        stars[3].classList.add('grey');
    }
};

/* function to increment the moves counter */
const incrementMoves = () => {
    moves++;

    if (moves === 1) {
        movesCounter.innerHTML = `1 Move`;
    } else {
        movesCounter.innerHTML = `${moves} Moves`;
    }
    starsRating();
};

/* function to begin the game`s timer */
const startTimer = () => {
    timerCounter = setInterval(() => {
        // increment seconds by one
        seconds++;

        // handle overflow
        if (seconds == 60) {
            minutes++;
            seconds = 0;
        }
        if (minutes == 60) {
            hours++;
            minutes = 0;
        }

        // update UI
        secondTimer.innerHTML = seconds < 10 ? `0${seconds}` : seconds;
        minuteTimer.innerHTML = minutes < 10 ? `0${minutes}` : minutes;
        hourTimer.innerHTML = hours < 10 ? `0${hours}` : hours;
    }, 1000);
};

/* check if the user wins */
const checkWin = () => {
    const modal = document.querySelector('.modal');
    const btnModal = document.querySelector('.btn-modal');
    const timeModal = document.querySelector('.time-modal');
    const ratingModal = document.querySelector('.rating-modal');
    const movesModal = document.querySelector('.moves-modal');

    if (matchedCards.length === 16) {
        // show some statistics
        timeModal.innerText = timer.innerText;
        ratingModal.innerHTML = starsForRate.innerHTML;
        movesModal.innerHTML = movesCounter.innerHTML;

        clearInterval(timerCounter);
        modal.style.display = 'block';
        btnModal.addEventListener('click', function() {
            modal.style.display = 'none';
            restart();
        });
    }
};

/* to handle user`s click */
const handleClick = event => {
    if (
        event.target.nodeName.toLowerCase() === 'li' &&
        !event.target.classList.contains('match') &&
        openedCards.length < 2
    ) {
        // start timer if the timer is off
        if (!isTimerOn) {
            startTimer();
            isTimerOn = true;
        }
        displayCard(event.target);
        addToOpenedCards(event.target);
        if (openedCards.length === 2) {
            setTimeout(() => {
                if (checkMatching()) {
                    openedCards.map(card => {
                        matchCard(card);
                        addToMatchedCards(card);
                    });
                } else {
                    openedCards.map(card => hideCard(card));
                }
                openedCards = [];
                incrementMoves();
                checkWin();
            }, 2000);
        }
    }
};

const restart = () => {
    // reset the timer
    clearInterval(timerCounter);
    isTimerOn = false;

    seconds = 0;
    minutes = 0;
    hours = 0;
    // update UI
    secondTimer.innerHTML = '00';
    minuteTimer.innerHTML = '00';
    hourTimer.innerHTML = '00';

    // reset moves
    moves = 0;
    movesCounter.innerHTML = '0 Move';

    // reset the color of the stars
    stars[5].classList.remove('grey');
    stars[3].classList.remove('grey');

    // empty the cards arrays
    matchedCards = [];
    openedCards = [];

    init();
};

// restart button
const restartBtn = document.querySelector('.restart');
restartBtn.addEventListener('click', restart);

/* initialize the game */
function init() {
    const cardsBoard = document.querySelector('#cards-board');
    // clear the old card board
    cardsBoard.innerHTML = '';

    const shuffledIcons = shuffle(icons);
    const unorderedList = document.createElement('ul');
    unorderedList.className = 'deck';
    shuffledIcons.map(icon => {
        const listItem = document.createElement('li');
        listItem.className = 'card';
        listItem.innerHTML = `<i class="${icon}"></i>`;
        unorderedList.appendChild(listItem);
    });
    unorderedList.addEventListener('click', handleClick);
    cardsBoard.appendChild(unorderedList);
}

init();
