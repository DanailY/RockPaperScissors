//import { signalR } from "./signalr/dist/browser/signalr";

const choices = document.querySelectorAll('.choice');
const score = document.getElementById('score');
const result = document.getElementById('result');
const restart = document.getElementById('restart');
const modal = document.querySelector('.modal');
const connection = new signalR.HubConnectionBuilder().withUrl("/gameHub").build();

const scoreboard = {
    player: 0,
    computer: 0
};

let playersStats = [{
    user: '',
    shape: ''
}];



connection.on("ReceiveShape", function (user, shape) {
    playersStats.push({ user, shape });
    console.log(user, shape)
})

connection.start();

// Play game
function play(e) {
    restart.style.display = 'inline-block';
    var playerChoice = e.target.id;
    var user = sessionStorage.getItem('user');
    connection.invoke("SendChosenShape", user, playerChoice)
        .then((r) => {
            if (playersStats.length === 3) {
                let sp = playersStats.pop();
                let fp = playersStats.pop();
                const winner = getWinner(fp, sp);

                console.log(winner);
                showWinner(winner, fp, sp);
            }
        })
        .catch(function (err) {
            return console.error(err.toString());
        });
};

// Get game winner
function getWinner(fp, sp) {
    if (fp.shape === sp.shape) {
        return 'draw';
    } else if (fp.shape === 'rock') {
        if (sp.shape === 'paper') {
            return sp.user;
        } else {
            return fp.user;
        }
    } else if (fp.shape === 'paper') {
        if (sp.shape === 'scissors') {
            return sp.user;
        } else {
            return fp.user;
        }
    } else if (fp.shape === 'scissors') {
        if (sp.shape === 'rock') {
            return sp.user;
        } else {
            return fp.user;
        }
    }

}

// Show winner
function showWinner(winner, fp, sp) {
    //TODO: to implement the logic for displaying the result
    if (winner === fp.user) {
        // inc player score
        scoreboard.player++;
        //Show modal result
        result.innerHTML = `
            <h1 class="text-win">You win</h1>
            <i class="fas fa-hand-${sp.shape} fa-10x"></i>
            <p>Computer Chose <strong>${sp.shape.charAt(0).toUpperCase() + sp.shape.slice(1)}</strong></p>
            `;
    } else if (winner === 'computer') {
        // inc computer score
        scoreboard.computer++;
        // Show modal result
        result.innerHTML = `
             <h1 class="text-lose">You Lose</h1>
             <i class="fas fa-hand-${computerChoice} fa-10x"></i>
             <p>Computer Chose <strong>${computerChoice.charAt(0).toUpperCase() + computerChoice.slice(1)}</strong></p>
             `;
    } else {
        result.innerHTML = `
             <h1>It's A Draw</h1>
             <i class="fas fa-hand-${computerChoice} fa-10x"></i>
             <p>Computer Chose <strong>${computerChoice.charAt(0).toUpperCase() + computerChoice.slice(1)}</strong></p>
             `;
    }

    // Show score
    score.innerHTML = `
    <p>Player: ${scoreboard.player}</p>
    <p>Computer: ${scoreboard.computer}</p>
    `;

    modal.style.display = 'block';  
}

// Clear modal
function clearModal(e) {
    if (e.target == modal) {
        modal.style.display = 'none';
    }
}

// Restart game
function restartGame(){
    scoreboard.player = 0;
    scoreboard.computer = 0;
    score.innerHTML = `
    <p>Player: 0</p>
    <p>Computer: 0</p>
    `;

    restart.style.display = 'none';
}

// Event listeners
choices.forEach(choice => choice.addEventListener('click', play));
window.addEventListener('click', clearModal);
restart.addEventListener('click', restartGame);