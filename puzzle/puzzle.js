class Puzzle {
    constructor() {
        this.container = document.querySelector('.container');
        this.moves = document.getElementById('moves');
        this.startButton = document.getElementById('start-button');
        this.coverScreen = document.querySelector('.cover-screen');
        this.result = document.getElementById('result');
        this.movesCount = 0;
        this.size = 3;
        this.pieces = [];
        this.emptyPiece = this.size * this.size - 1;
        
        this.loadImage().then(() => {
            this.startButton.addEventListener('click', () => this.startGame());
            // Show start screen
            this.coverScreen.classList.remove('hide');
            this.container.classList.add('hide');
        });
    }

    loadImage() {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                this.image = img;
                resolve();
            };
            img.src = 'images/jigsaw.jpg';
        });
    }

    startGame() {
        this.container.classList.remove('hide');
        this.coverScreen.classList.add('hide');
        this.container.innerHTML = '';
        this.movesCount = 0;
        this.updateMoves();
        this.createPieces();
        this.shuffle();
    }

    createPieces() {
        const pieceWidth = this.container.offsetWidth / this.size;
        const pieceHeight = this.container.offsetHeight / this.size;
        
        for (let i = 0; i < this.size * this.size; i++) {
            const piece = document.createElement('div');
            piece.className = 'image-container';
            piece.setAttribute('data-position', i);
            
            if (i !== this.emptyPiece) {
                const img = document.createElement('img');
                img.className = 'image';
                img.setAttribute('data-index', i);
                
                // Calculate background position
                const x = -(i % this.size) * 100;
                const y = -Math.floor(i / this.size) * 100;
                img.style.backgroundImage = `url(${this.image.src})`;
                img.style.backgroundSize = `${this.size * 100}%`;
                img.style.backgroundPosition = `${x}% ${y}%`;
                
                piece.appendChild(img);
            } else {
                const emptyDiv = document.createElement('div');
                emptyDiv.className = 'image target';
                emptyDiv.setAttribute('data-index', i);
                piece.appendChild(emptyDiv);
            }
            
            piece.addEventListener('click', (e) => this.movePiece(e));
            this.container.appendChild(piece);
        }
    }

    movePiece(e) {
        const clickedPiece = e.target.closest('.image-container');
        if (!clickedPiece) return;

        const emptyPiece = document.querySelector('.target').parentElement;
        const pos1 = parseInt(clickedPiece.getAttribute('data-position'));
        const pos2 = parseInt(emptyPiece.getAttribute('data-position'));

        if (this.isAdjacent(pos1, pos2)) {
            // Swap pieces
            const temp = clickedPiece.innerHTML;
            clickedPiece.innerHTML = emptyPiece.innerHTML;
            emptyPiece.innerHTML = temp;

            this.movesCount++;
            this.updateMoves();

            if (this.checkWin()) {
                setTimeout(() => {
                    const victoryText = document.createElement('p');
                    victoryText.style.color = '#ff4081';
                    victoryText.style.fontSize = '1.2rem';
                    victoryText.style.margin = '20px 0';
                    victoryText.style.animation = 'fadeIn 1s ease';
                    victoryText.innerHTML = 'Our first pic together... ❤️<br>I felt the closest to you for the first time at that moment';
                    document.querySelector('h1').insertAdjacentElement('afterend', victoryText);
                }, 500);
            }
        }
    }

    isAdjacent(pos1, pos2) {
        const row1 = Math.floor(pos1 / this.size);
        const col1 = pos1 % this.size;
        const row2 = Math.floor(pos2 / this.size);
        const col2 = pos2 % this.size;

        return (Math.abs(row1 - row2) === 1 && col1 === col2) ||
               (Math.abs(col1 - col2) === 1 && row1 === row2);
    }

    checkWin() {
        const pieces = document.querySelectorAll('.image');
        return Array.from(pieces).every((piece, index) => {
            if (piece.classList.contains('target')) {
                return index === this.size * this.size - 1;
            }
            return parseInt(piece.getAttribute('data-index')) === index;
        });
    }

    shuffle() {
        for (let i = 0; i < 200; i++) {
            const emptyPiece = document.querySelector('.target').parentElement;
            const emptyPos = parseInt(emptyPiece.getAttribute('data-position'));
            const adjacentPositions = this.getAdjacentPositions(emptyPos);
            const randomPos = adjacentPositions[Math.floor(Math.random() * adjacentPositions.length)];
            const pieceToSwap = document.querySelector(`[data-position="${randomPos}"]`);
            
            if (pieceToSwap) {
                const temp = emptyPiece.innerHTML;
                emptyPiece.innerHTML = pieceToSwap.innerHTML;
                pieceToSwap.innerHTML = temp;
            }
        }
    }

    getAdjacentPositions(pos) {
        const positions = [];
        const row = Math.floor(pos / this.size);
        const col = pos % this.size;

        if (row > 0) positions.push(pos - this.size);
        if (row < this.size - 1) positions.push(pos + this.size);
        if (col > 0) positions.push(pos - 1);
        if (col < this.size - 1) positions.push(pos + 1);

        return positions;
    }

    updateMoves() {
        this.moves.innerText = `Moves: ${this.movesCount}`;
    }
}

// Start the game when the page loads
window.onload = () => new Puzzle();