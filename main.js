const form = document.forms[0];
const main = document.querySelector("main");
const gameboardDOM = document.querySelector(".gameboard");
const restart = document.querySelector(".restart button");

restart.addEventListener("click", (evt) => {
    game.restart();
});

gameboardDOM.addEventListener("click", (evt) => {
    const t = evt.target;
    if (!t.classList.contains("tile")) {
        return null;
    }
    game.playTurn(t.dataset.index);
});

form.addEventListener("submit", (evt) => {
    evt.preventDefault();

    const player1 = {
        name: form.player1Name.value,
        symbol: form.player1Symbol.value,
        id: form.player1Id.value,
    };
    const player2 = {
        name: form.player2Name.value,
        symbol: form.player2Symbol.value,
        id: form.player2Id.value,
    };
    game.init(player1, player2);
});

form.addEventListener("click", (evt) => {
    const t = evt.target;
    if (t.nodeName === "INPUT" && t.type === "radio") {
        const oppositeSymbol = document.querySelector(
            `#${t.dataset.oppositeSymbol}`
        );
        oppositeSymbol.checked = true;
    }
});

const gameboard = (function () {
    const _gameboard = [];

    for (let i = 0; i < 9; i++) {
        _gameboard[i] = null;
    }

    function placeSymbol(player, index) {
        const symbol = player.getSymbol();
        if (_gameboard[index] !== null) {
            return false;
        }
        _gameboard[index] = symbol;
        displayController.placeSymbol(player, index);
        return true;
    }

    function getBoard() {
        return [..._gameboard];
    }

    function clear() {
        for (let i = 0; i < 9; i++) {
            _gameboard[i] = null;
        }
        displayController.clearBoard();
    }

    return { placeSymbol, getBoard, clear };
})();

const displayController = (function () {
    const gameboardDOM = document.querySelector(".gameboard");

    function placeSymbol(player, index) {
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

    function init(player1, player2, turningPlayer) {
        const [scoreboard1, scoreboard2] =
            document.querySelectorAll(".scoreboard");
        scoreboard1.id = `p${player1.getId()}`;
        scoreboard2.id = `p${player2.getId()}`;

        scoreboard1.querySelector(".name").textContent =
            player1.getName();
        scoreboard1.querySelector("[data-score]").textContent = "0";
        scoreboard1.querySelector("[data-symbol]").textContent =
            player1.getSymbol();
        scoreboard2.querySelector(".name").textContent =
            player2.getName();
        scoreboard2.querySelector("[data-score]").textContent = "0";
        scoreboard2.querySelector("[data-symbol]").textContent =
            player2.getSymbol();

        if (player1 === turningPlayer) {
            scoreboard1.classList.add("turning");
        } else {
            scoreboard2.classList.add("turning");
        }

        form.classList.add("hide");
        main.classList.remove("hide");
    }

    function clearBoard() {
        [...gameboardDOM.children].forEach(
            (tile) => (tile.textContent = "")
        );
    }

    function restart() {
        [...document.querySelectorAll(".scoreboard")].forEach(
            (scoreboard) => scoreboard.classList.remove("turning")
        );
        main.classList.add("hide");
        form.classList.remove("hide");
    }

    function switchPlayer(turningPlayer) {
        const scoreboard = document.querySelector(
            `#p${turningPlayer.getId()}`
        );
        const scoreboard2 = document.querySelector(
            `.scoreboard:not(#p${turningPlayer.getId()})`
        );
        scoreboard.classList.add("turning");
        scoreboard2.classList.remove("turning");
    }

    return {
        placeSymbol,
        updateScore,
        init,
        clearBoard,
        restart,
        switchPlayer,
    };
})();

const game = (function () {
    let _player1;
    let _player2;
    let _turningPlayer;

    function playTurn(index) {
        if (!gameboard.placeSymbol(_turningPlayer, index)) {
            return false;
        }

        if (_isGameEnd()) {
            if (_findWinCombination()) {
                const winner = _findWinner();
                winner.updateScore();
            }
            gameboard.clear();
        }

        _switchPlayer();
        return true;
    }

    function _switchPlayer() {
        if (_turningPlayer === _player1) {
            _turningPlayer = _player2;
        } else {
            _turningPlayer = _player1;
        }
        displayController.switchPlayer(_turningPlayer);
    }

    function _isGameEnd() {
        const board = gameboard.getBoard();
        if (
            _findWinCombination() ||
            board.every((tile) => tile !== null)
        ) {
            return true;
        }
        return false;
    }

    function _findWinner() {
        const winnerCombination = _findWinCombination();
        if (!winnerCombination) {
            return null;
        }
        const symbol = winnerCombination[0];
        if (_player1.getSymbol() === symbol) {
            return _player1;
        } else {
            return _player2;
        }
    }

    function _findWinCombination() {
        const combinations = [
            ..._splitBoard(0, 1, 3, 3), // rows
            ..._splitBoard(0, 3, 1, 3), // columns
            ..._splitBoard(0, 4, 0, 1), // diagonal to right
            ..._splitBoard(2, 2, 0, 1), // diagonal to left
        ];

        return combinations.find((combination) => {
            const symbol = combination[0];
            return combination.every(
                (symb) => symb === symbol && symbol !== null
            );
        });
    }

    function _splitBoard(startIndex, step, moveBy, numberOfChunks) {
        const board = gameboard.getBoard();
        const modifiedBoard = [];
        let counter = 0;
        let index = startIndex;
        while (counter < numberOfChunks) {
            modifiedBoard.push([
                board[index],
                board[index + step],
                board[index + step * 2],
            ]);
            index += moveBy;
            counter++;
        }
        return modifiedBoard;
    }

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

        displayController.init(_player1, _player2, _turningPlayer);
    }

    function restart() {
        _player1 = null;
        _player2 = null;
        _turningPlayer = null;
        gameboard.clear();
        displayController.restart();
    }

    return { init, playTurn, restart };
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
