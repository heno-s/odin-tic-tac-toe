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

    return { placeSymbol, updateScore };
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
