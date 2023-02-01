const form = document.forms[0];
const main = document.querySelector("main");
form.addEventListener("submit", (evt) => {
    evt.preventDefault();

    const player1 = {
        name: form.player1Name.value,
        symbol: form.player1Symbol.value,
        id: "1",
    };
    const player2 = {
        name: form.player2Name.value,
        symbol: form.player2Symbol.value,
        id: "2",
    };
    game.init(player1, player2);

    form.classList.add("hide");
    main.classList.remove("hide");
});

const gameboard = (function () {
    const gameboard = [];
    for (let i = 0; i < 9; i++) {
        gameboard[i] = null;
    }
    function placeSymbol(player, index) {
        const symbol = player.getSymbol();
        if (gameboard[index] !== null) {
            return false;
        }
        gameboard[index] = symbol;
        return true;
    }

    return { placeSymbol };
})();

const displayController = (function () {
    const gameboardDOM = document.querySelector(".gameboard");

    function placeSymbol(player, index) {
        if (!gameboard.placeSymbol(player, index)) {
            return null;
        }
        const tile = gameboardDOM.querySelector(
            `[data-index="${index}"]`
        );
        tile.textContent = player.getSymbol();
    }

    function updateScore(player) {
        const score = player.getScore();
        const scoreboard = document.querySelector(
            `#p${player.getId()}`
        );
        const scoreDOM = scoreboard.querySelector("[data-score]");
        scoreDOM.textContent = score;
    }

    function init(player1, player2) {
        const scoreboard1 = document.querySelector("#p1");
        const scoreboard2 = document.querySelector("#p2");

        scoreboard1.querySelector(".name").textContent = player1.name;
        scoreboard1.querySelector("[data-score]").textContent = "0";
        scoreboard1.querySelector("[data-symbol]").textContent =
            player1.symbol;
        scoreboard2.querySelector(".name").textContent = player2.name;
        scoreboard2.querySelector("[data-score]").textContent = "0";
        scoreboard2.querySelector("[data-symbol]").textContent =
            player2.symbol;
    }

    return { placeSymbol, updateScore, init };
})();

const game = (function () {
    let _player1;
    let _player2;
    let _turningPlayer;

    function init(player1, player2) {
        _player1 = playerFactory(
            player1.name,
            player1.symbol,
            player1.id
        );
        _player2 = playerFactory(
            player2.name,
            player2.symbol,
            player2.id
        );
        _turningPlayer = Math.random() > 0.5 ? _player1 : _player2;

        displayController.init(player1, player2);
    }
    return { init };
})();

function playerFactory(name, symbol, id) {
    let _score = 0;

    function getName() {
        return name;
    }

    function getSymbol() {
        return symbol;
    }

    function getScore() {
        return _score;
    }

    function getId() {
        return id;
    }

    function updateScore() {
        _score++;
        displayController.updateScore(this);
    }

    return { getName, getSymbol, getScore, getId, updateScore };
}

const player1 = playerFactory("John", "x", "2");
