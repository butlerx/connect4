var gameField = new Array(),
board = document.getElementById("board"),
currentCol,
currentRow,
currentPlayer,
id = 1,
won = false;

newgame();

function newgame(){
  prepareField();
  placeDisc(Math.floor(Math.random()*2)+1);
}

function checkWinner(row,col){
  if(getAdj(row,col,0,1)+getAdj(row,col,0,-1) > 2 || getAdj(row,col,1,0) > 2 || getAdj(row,col,-1,1)+getAdj(row,col,1,-1) > 2 || getAdj(row,col,1,1)+getAdj(row,col,-1,-1) > 2){
    return true;
  } else return false;
}

function getAdj(row,col,row_inc,col_inc){
  if(cellVal(row,col) == cellVal(row+row_inc,col+col_inc)){
    return 1+getAdj(row+row_inc,col+col_inc,row_inc,col_inc);
  } else {
    return 0;
  }
}

function cellVal(row,col){
  if(gameField[row] == undefined || gameField[row][col] == undefined){
    return -1;
  } else {
    return gameField[row][col];
  }
}

function firstFreeRow(col,player){
  for(var i = 0; i<6; i++){
    if(gameField[i][col]!=0){
      break;
    }
  }
  gameField[i-1][col] = player;
  return i-1;
}

function possibleCol(){
  var moves = new Array();
  for(var i=0; i<7; i++){
    if(gameField[0][i] == 0){
      moves.push(i);
    }
  }
  return moves;
}

function decide(){
  var possibleMoves = possibleCol();
  if (possibleMoves.length === 0) {
    alert('THE Game was a Draw');
    board.innerHTML = "";
    newgame();
  }
  var aiMoves = new Array();
  var blocked;
  var bestBlocked = 0;

  for(var i=0; i<possibleMoves.length; i++){
    for(var j=0; j<6; j++){
      if(gameField[j][possibleMoves[i]] != 0){
        break;
      }
    }

    gameField[j-1][possibleMoves[i]] = 1;
    blocked = getAdj(j-1,possibleMoves[i],0,1)+getAdj(j-1,possibleMoves[i],0,-1);
    blocked = Math.max(blocked,getAdj(j-1,possibleMoves[i],1,0));
    blocked = Math.max(blocked,getAdj(j-1,possibleMoves[i],-1,1));
    blocked = Math.max(blocked,getAdj(j-1,possibleMoves[i],1,1)+getAdj(j-1, possibleMoves[i],-1,-1));

    if(blocked >= bestBlocked){
      if(blocked>bestBlocked){
        bestBlocked = blocked;
        aiMoves = new Array();
      }
      aiMoves.push(possibleMoves[i]);
    }
    gameField[j-1][possibleMoves[i]] = 0;
  }
  return aiMoves;
}

function Disc(player){
  this.player = player;
  this.color = player == 1 ? 'blue' : 'orange';
  this.id = id.toString();
  id++;

  this.addToScene = function(){
    board.innerHTML += '<div id="d'+this.id+'" class="disc '+this.color+'"></div>';
    if(currentPlayer==2 && won === false){
      //computer move
      var possibleMoves = decide();
      var cpuMove = Math.floor( Math.random() * possibleMoves.length);
      currentCol = possibleMoves[cpuMove];
      document.getElementById('d'+this.id).style.left = (14+60*currentCol)+"px";
      dropDisc(this.id,currentPlayer);
    }
  }

  var $this = this;
  document.onmousemove = function(evt){
    if(currentPlayer == 1){
    currentCol = Math.floor((evt.clientX - board.offsetLeft)/60);
    if(currentCol<0){currentCol=0;}
    if(currentCol>6){currentCol=6;}
    document.getElementById('d'+$this.id).style.left = (14+60*currentCol)+"px";
    document.getElementById('d'+$this.id).style.top = "-55px";
    }
  }
  document.onload = function(evt){
    if(currentPlayer == 1){
    currentCol = Math.floor((evt.clientX - board.offsetLeft)/60);
    if(currentCol<0){currentCol=0;}
    if(currentCol>6){currentCol=6;}
    document.getElementById('d'+$this.id).style.left = (14+60*currentCol)+"px";
    document.getElementById('d'+$this.id).style.top = "-55px";
    }
  }

  document.onclick = function(evt){
    if(currentPlayer == 1){
      if(possibleCol().indexOf(currentCol) != -1){
        dropDisc($this.id,$this.player);
      }
    }
  }

  document.ontouchstart = function(evt){
    if(currentPlayer == 1){
    currentCol = Math.floor((evt.pageX - board.offsetLeft)/60);
    if(currentCol<0){currentCol=0;}
    if(currentCol>6){currentCol=6;}
    document.getElementById('d'+$this.id).style.left = (14+60*currentCol)+"px";
    document.getElementById('d'+$this.id).style.top = "-55px";
    }
  }

  document.ontouchend = function(evt){
    if(currentPlayer == 1){
      if(possibleCol().indexOf(currentCol) != -1){
        dropDisc($this.id,$this.player);
      }
    }
  }
}

function dropDisc(cid,player){
  currentRow = firstFreeRow(currentCol,player);
  moveit(cid,(14+currentRow*60));
  currentPlayer = player;
  checkForMoveVictory();
}

function checkForMoveVictory(){
  if(!checkWinner(currentRow,currentCol)){
    placeDisc(3-currentPlayer);
  } else {
    var winner = currentPlayer == 2 ? 'Computer' : 'Player';
    won = true;
    placeDisc(3-currentPlayer);
    alert(winner+" win!");
    board.innerHTML = "";
    newgame();
  }
}

function placeDisc(player){
  currentPlayer = player;
  var disc = new Disc(player);
  disc.addToScene();
}

function prepareField(){
  won = false;
  gameField = new Array();
  for(var i=0; i<6; i++){
    gameField[i] = new Array();
    for(var j=0; j<7; j++){
      gameField[i].push(0);
    }
  }
}

function moveit(who,where){
    document.getElementById('d'+who).style.top = where+'px';
}
