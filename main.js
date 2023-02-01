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

const player = {
    getSymbol() {
        return "x";
    },
};

displayController.placeSymbol(player, 1);
