/**
 * Created by swarnavinashkumar on 15/05/15.
 */
function Blocks(initialValue) {
    this.value = initialValue;
    this.row = -1;
    this.col = -1;
    this.getValue = function() {
        return this.value;
    };
    this.addValue = function(other) {
        other.value += this.value;
    };
    this.merge = function(other, matrix) {
        this.addValue(other);
        matrix.spaces[this.row][this.col] = null;

    };

    this.isPossibleMerge = function(other) {
        return other != null && other != -1 && this.value === other.getValue();

    };

    this.canMove = function(dir, grid) {
        return this.getAdjacentBlocks(dir, grid) == null;
    };
    this.decideColor = function() {
        switch(this.value) {
            case 2:
                return "#E6BE8A";
            case 4:
                return "orange";
            case 8:
                return "#FE5A1D";
            case 16:
                return "#960018";
            case 32:
                return "#8F9779";
            case 64:
                return "#568203";
            case 128:
                return "#01796F";
            case 256:
                return "#72A0C1";
            case 512:
                return "#0047AB";
            case 1024:
                return "#000080";
            case 2048:
                return "black";
                return "#ccc0b3;";

        }
    };
    this.moveOnce = function(dir, grid) {
        switch (dir) {
            case "down":
                var currRow = this.row + 1;
                var currCol = this.col;
                break;
            case "up":
                var currRow = this.row - 1;
                var currCol = this.col;
                break;
            case "left":
                var currRow = this.row;
                var currCol = this.col - 1;
                break;
            case "right":
                var currRow = this.row;
                var currCol = this.col + 1;
                break;
        }
        grid.spaces[this.row][this.col] = null;

        grid.spaces[currRow][currCol] = this;
        this.row = currRow;
        this.col = currCol;
    };
    this.getAdjacentBlocks = function(dir, grid) {
        var isPresentInBounds = function(row, col) {
            return row < grid.spaces.length && row >= 0 && col < grid.spaces[row].length && col >= 0;
        };
        switch (dir) {
            case "down":
                var currRow = this.row + 1;
                var currCol = this.col;
                break;
            case "up":
                var currRow = this.row - 1;
                var currCol = this.col;
                break;
            case "left":
                var currRow = this.row;
                var currCol = this.col - 1;
                break;
            case "right":
                var currRow = this.row;
                var currCol = this.col + 1;
                break;
        }
        if (!isPresentInBounds(currRow, currCol)) {
            return -1;
        }

        return grid.spaces[currRow][currCol];

    };


}


function Matrix() {
    this.spaces = [[null, null, null, null], [null, null, null, null], [null, null, null, null], [null, null, null, null]];
    var moved = false;
    this.move = function(dir) { //TO-COMPLETE
        var currRow = 0;
        var currCol = 0;
        var moveHelper = function(piece, grid) {
            if (currPiece != null) {
                while (currPiece.canMove(dir, grid)) {
                    currPiece.moveOnce(dir, grid);
                    moved = true;
                }
                var neighbor = currPiece.getAdjacentBlocks(dir, grid);
                if (currPiece.isPossibleMerge(neighbor)) {
                    currPiece.merge(neighbor, grid);
                    moved = true;
                }
            }
        }
        switch (dir) {
            case "down":
                currRow = this.spaces.length - 1;
                for (var col = currCol; col < this.spaces[0].length; col++) {
                    for (var row = currRow; row >= 0; row--) {
                        var currPiece = this.spaces[row][col];
                        moveHelper(currPiece, this);
                    }
                }
                break;
            case "up":
                currRow = 0;
                for (var col = currCol; col < this.spaces[0].length; col++) {
                    for (var row = currRow; row < this.spaces.length; row++) {
                        var currPiece = this.spaces[row][col];
                        moveHelper(currPiece, this);
                    }
                }
                break;
            case "left":
                currCol = 0;
                for (var row = currRow; row < this.spaces.length; row++) {
                    for (var col = currCol; col < this.spaces[0].length; col++) {
                        var currPiece = this.spaces[row][col];
                        moveHelper(currPiece, this);
                    }
                }
                break;
            case "right":
                currCol = this.spaces[0].length - 1;
                for (var row = currRow; row < this.spaces.length; row++) {
                    for (var col = currCol; col >= 0; col--) {
                        var currPiece = this.spaces[row][col];
                        moveHelper(currPiece, this);
                    }
                }
                break;
        }
        if (moved) {
            if (Math.random() < 0.5) {
                this.addBlock(new Blocks(2));
            } else {
                this.addBlock(new Blocks(4));
            }
        }
        moved = false;

    };

    this.addBlock = function(piece) {
        var emptyPositions = [];
        for (var i = 0; i < this.spaces.length; i++) {
            for (var j = 0; j < this.spaces[i].length; j++) {
                if (this.spaces[i][j] == null) {
                    emptyPositions.push([i, j]);
                }
            }
        }
        var randomPos = emptyPositions[Math.floor(Math.random() * emptyPositions.length)];
        this.spaces[randomPos[0]][randomPos[1]] = piece;
        piece.row = randomPos[0];
        piece.col = randomPos[1];
    };
    this.addPieceToPos = function(piece, row, col) {
        this.spaces[row][col] = piece;
        piece.row = row;
        piece.col = col;
    };

    this.canEndGame = function() {
        var g = this;
        var canEndGameHelper = function(piece) {
            if (piece === -1) {
                return true;
            } else if (piece == null) {
                return false;
            } else {
                var rightNeighbor = piece.getAdjacentBlocks("right", g);
                var downNeighbor = piece.getAdjacentBlocks("down", g);
                return !piece.isPossibleMerge(rightNeighbor) && !piece.isPossibleMerge(downNeighbor)
                    && canEndGameHelper(rightNeighbor) && canEndGameHelper(downNeighbor);
            }
        }
        return canEndGameHelper(this.spaces[0][0]);

    };

    this.toString = function() {
        var returned = "";
        for (var row = 0; row < this.spaces.length; row++) {
            for (var col = 0; col < this.spaces[row].length; col++) {
                var currPiece = this.spaces[row][col];
                if (currPiece == null) {
                    returned = returned + "0"
                } else {
                    returned = returned + currPiece.getValue();
                }
                returned = returned + " ";
            }
            returned = returned + "\n";
        }
        return returned;

    };

}

function Game() {
    this.score = 0;
    this.grid = new Matrix();
    this.playing = false;
    this.configureFromReset = function() {
        this.grid = new Matrix();
        this.score = 0;
        this.grid.addBlock(new Blocks(2));
        this.grid.addBlock(new Blocks(2));
        this.playing = true;
        this.updateMatrixUI();
    };
    this.updateMatrixUI = function() {
        for (var i = 0; i < this.grid.spaces.length; i++) {
            for (var j = 0; j < this.grid.spaces[i].length; j++) {
                var currPiece = this.grid.spaces[i][j];
                var idString = "#position-" + i + "-" + j;
                if (currPiece == null) {
                    $(idString + " .label").html("&nbsp;");
                    $(idString).css("background-color", "#ccc0b3");
                } else {
                    $(idString + " .label").html("" + currPiece.getValue());
                    $(idString).css("background-color", currPiece.decideColor());
                }

            }
        }

    };
    this.gameOverUI = function() {
        alert("Game Over");
        $(".gameover").fadeTo("slow", 0.9);
    };
    this.resetMatrixUI = function() {
        $(".gameover").fadeTo("fast", 1);
        this.run();
    };
    this.run = function() {
        this.configureFromReset();
        var grid = this.grid;
        var game = this;
        $(document).keydown(function(e) {

            switch(e.which) {
                case 37: // left
                    grid.move("left");
                    break;

                case 38: // up
                    grid.move("up");
                    break;

                case 39: // right
                    grid.move("right");
                    break;

                case 40: // down
                    grid.move("down");
                    break;

                default: return;
            }
            game.updateMatrixUI();
            if (grid.canEndGame()) {
                game.gameOverUI();
                game.playing = false;
                return;
            }
            e.preventDefault(); // prevent the default action (scroll / move caret)
        });
    };

}

var game = new Game();
function restartGame() {
    if (!game.playing) {
        game = new Game();
        $(document).off("keydown");
        game.resetMatrixUI();
    }
}

var main = function() {
    game.run();
}
$(document).ready(main);
