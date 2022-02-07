var WALL = 'WALL';
var FLOOR = 'FLOOR';
var BALL = 'BALL';
var GAMER = 'GAMER';
var GLOW= 'GLOW';

var GAMER_IMG = '<img src="gamer.png" />';
var BALL_IMG = '<img src="ball.png" />';
var GLOW_IMG = '<img src="candy.png" />';

var audioObj = new Audio('audio/Ding.mp3');

var gBoard;
var gGamerPos;
var IntrvalId;
var Intrvalglow;
var ballEat=0;
var ballOnFiled=2;
var timeGlow=0;
var gIsGameOn;

function initGame() {
	 gIsGameOn=true;
	gGamerPos = { i: 2, j: 9 };
	gBoard = buildBoard();
	renderBoard(gBoard);
	 IntrvalId=setInterval(function(){newBall(gBoard)},3000)
	 Intrvalglow=setInterval(glow,5000)
}

function buildBoard() {
	// Create the Matrix
	var board = createMat(10, 12)


	// Put FLOOR everywhere and WALL at edges
	for (var i = 0; i < board.length; i++) {
		for (var j = 0; j < board[0].length; j++) {
			// Put FLOOR in a regular cell
			var cell = { type: FLOOR, gameElement: null };
			

			// Place Walls at edges
			if (i === 0 || i === board.length - 1 || j === 0 || j === board[0].length - 1) {
				cell.type = WALL;
			}
			// Add created cell to The game board
			board[i][j] = cell;
			board[0][5].type=FLOOR
			board[5][0].type=FLOOR
			board[5][board[5].length-1].type=FLOOR
			board[board.length-1][5].type=FLOOR
		

		}
	}

	// Place the gamer at selected position
	board[gGamerPos.i][gGamerPos.j].gameElement = GAMER;

	// Place the Balls (currently randomly chosen positions)
	board[3][8].gameElement = BALL;
	board[7][4].gameElement = BALL;

	// console.log(board);
	return board;
}

// Render the board to an HTML table
function renderBoard(board) {

	var strHTML = '';
	for (var i = 0; i < board.length; i++) {
		strHTML += '<tr>\n';
		for (var j = 0; j < board[0].length; j++) {
			var currCell = board[i][j];

			var cellClass = getClassName({ i: i, j: j })

			// TODO - change to short if statement
			if (currCell.type === FLOOR) cellClass += ' floor';
			else if (currCell.type === WALL) cellClass += ' wall';

			//TODO - Change To template string
			strHTML += '\t<td class="cell ' + cellClass +
				'"  onclick="moveTo(' + i + ',' + j + ')" >\n';

			// TODO - change to switch case statement
			if (currCell.gameElement === GAMER) {
				strHTML += GAMER_IMG;
			} else if (currCell.gameElement === BALL) {
				strHTML += BALL_IMG;
			}

			strHTML += '\t</td>\n';
		}
		strHTML += '</tr>\n';
	}

	// console.log('strHTML is:');
	// console.log(strHTML);
	var elBoard = document.querySelector('.board');
	elBoard.innerHTML = strHTML;
}

// Move the player to a specific location
function moveTo(i, j) {
	if(!gIsGameOn) return;
	var targetCell = gBoard[i][j];
	if (targetCell.type === WALL) return;
	if (targetCell.gameElement === GLOW) {gIsGameOn= false; setTimeout(function() { gIsGameOn= true;},3000)}

	// Calculate distance to make sure we are moving to a neighbor cell
	var iAbsDiff = Math.abs(i - gGamerPos.i);
	var jAbsDiff = Math.abs(j - gGamerPos.j);

	// If the clicked Cell is one of the four allowed
	if ((iAbsDiff === 1 && jAbsDiff === 0) || (jAbsDiff === 1 && iAbsDiff === 0) ||
	(jAbsDiff===11) || (iAbsDiff === 9)) {

		if (targetCell.gameElement === BALL) {
			ballEat++
			ballOnFiled--
			audioObj.play()
			
		}

		// MOVING from current position
		// Model:
		gBoard[gGamerPos.i][gGamerPos.j].gameElement = null;
	
		// Dom:
		renderCell(gGamerPos, '');
		if(ballOnFiled===0){
			var elrestrt=document.querySelector('.restart');
			elrestrt.style.display='block'
			clearInterval(IntrvalId)

		}

		// MOVING to selected position
		// Model:
		gGamerPos.i = i;
		gGamerPos.j = j;
		gBoard[gGamerPos.i][gGamerPos.j].gameElement = GAMER;
		// DOM:
		renderCell(gGamerPos, GAMER_IMG);

	} // else console.log('TOO FAR', iAbsDiff, jAbsDiff);

}

// Convert a location object {i, j} to a selector and render a value in that element
function renderCell(location, value) {
	var cellSelector = '.' + getClassName(location)
	var elCell = document.querySelector(cellSelector);
	elCell.innerHTML = value;
}

// Move the player by keyboard arrows
function handleKey(event) {

	var i = gGamerPos.i;
	var j = gGamerPos.j;


	switch (event.key) {
		case 'ArrowLeft':
			if(j===0){
				moveTo(5,11)
			}else{
			moveTo(i, j - 1);
			}
			break;
		case 'ArrowRight':
			if(j === 11){
				moveTo(5,0);
			}else{
			moveTo(i, j + 1);
			}
			break;
		case 'ArrowUp':
			if(i===0){
				moveTo(9,5)
			}else{
			moveTo(i - 1, j);
			}
			break;
		case 'ArrowDown':
			if(i===9){
				moveTo(0,5)
			}else{
			moveTo(i + 1, j);
			}
			break;

	}

}

// Returns the class name for a specific cell
function getClassName(location) {
	var cellClass = 'cell-' + location.i + '-' + location.j;
	return cellClass;
}



 function newBall(gBoard){
	 var emptyCells= checkCell(gBoard)
	 var Index=getRandomInt(0, emptyCells.length);
	 var newBallPos=emptyCells[Index]
gBoard[newBallPos.i][newBallPos.j].type='FLOOR'
gBoard[newBallPos.i][newBallPos.j].gameElement='BALL'
	 renderCell(newBallPos, BALL_IMG)
	 ballOnFiled++
 }
 
 function renderCellBall(location, value){
		var cellSelector = '.' + getClassName(location)
		var elCell = document.querySelector(cellSelector);
		elCell.innerHTML = value;
		console.log( elCell);
	}

function checkCell(gBoard){
	var arr=[]
	for(var i=0; i<gBoard.length; i++){
		for(var j=0; j<gBoard[i].length;j++){
			if(gBoard[i][j].type==='FLOOR'){
				arr.push({i:i, j:j})
			}
		}
	}
	return arr;

}

function glow(){
	var emptyCells= checkCell(gBoard)
	var Index=getRandomInt(0, emptyCells.length);
	var newGlowPos=emptyCells[Index]
	gBoard[newGlowPos.i][newGlowPos.j].type='FLOOR'
gBoard[newGlowPos.i][newGlowPos.j].gameElement='GLOW'
renderCell(newGlowPos, GLOW_IMG)
setTimeout(() => { if(gBoard[newGlowPos.i][newGlowPos.j].gameElement==='GLOW')
	renderCell(newGlowPos, '');
}, 3000);
}




 function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min) + min); 
  }