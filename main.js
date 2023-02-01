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
    const gameboard_DOM = document.querySelector(".gameboard");

    function placeSymbol(player, index) {
        console.log(gameboard);
        if (!gameboard.placeSymbol(player, index)) {
            return null;
        }
        const tile = gameboard_DOM.querySelector(
            `[data-index="${index}"]`
        );
        tile.textContent = player.getSymbol();
    }

    return { placeSymbol };
})();

function playerFactory(name, symbol, id) {
    const _score = 0;

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

    return { getName, getSymbol, getScore, getId };
}

const player1 = playerFactory("John", "x");
