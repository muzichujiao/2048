var game = new Array();
var add = new Array();

var score = 0;
var bestScore = 0;
window.onload=function(){
    gamestart();
}
function gamestart(){
    
    //获取最高纪录
    var best = localStorage.getItem("bestScore")||bestScore; 
    //初始化数组
    $('#bestScore').text(best);
    for(let i = 0; i<4;i++){
        game[i] = new Array();
        add[i] = new Array();
        for(let j = 0;j<4;j++){
            game[i][j] = 0;
            add[i][j] = 0;
        }
    }
    score=0;
    document.getElementById("score").innerHTML=score;
    $("#gameover").css('display','none');
    //随机生成两个数
    randomOneNumber();
    randomOneNumber();
    //更新页面
    updateLook();   
}
function randomOneNumber(){
    //如果没有位置
    if (isspace(game)) 
        return false;  
    //随机一个位置
    while(true){
        x = Math.floor(Math.random()*4);
        y = Math.floor(Math.random()*4);
        if (game[x][y] == 0) 
            break;
    }
    //随机一个数字
    var randNumber = Math.random()<0.5 ? 2 : 4;
    game[x][y] = randNumber;
    numberAnimation(x,y,randNumber);
    return true;
}
//更新页面
function updateLook(){
    //移除上一次的插入
    $(".number").remove();
    for(let i = 0;i<4;i++){
        for ( let j = 0; j < 4; j++) {     
            if(game[i][j] != 0){
                //当不为0时插入新的数字格子
                $("#container").append('<div class="number" id="number-'+i+'-'+j+'"></div>');
                var theNumberCell = $('#number-'+i+'-'+j);
                theNumberCell.css({
                    'width':'100px',
                    'hegiht':'100px',
                    'top':10 + i * 120,
                    'left':10 + j * 120,
                    'background-color':getcolor(game[i][j]),
                    'color':getNumberColor(game[i][j])
                });
               
                theNumberCell.text(game[i][j]);
            }
        }
    }
}


//事件响应循环
document.addEventListener("keydown",(event)=>{
    switch (event.which) {
    case 37://left
        if(moveLeft()){
            randomOneNumber();//每次新增一个数字就可能出现游戏结束
            setTimeout("isgameover()",400);
        }
        break;
    case 38://up
        if(moveUp()){ 
            randomOneNumber();
            setTimeout("isgameover()",400);
        }
        break;
    case 39://right
        if(moveRight()){    
            randomOneNumber();
            setTimeout("isgameover()",400);
        }
        break;
    case 40://down
        if(moveDown()){
            randomOneNumber();
            setTimeout("isgameover()",400);
        }
        break;
    }
});


function isgameover(){
    if(isspace(game)&&nomove(game))
        gameover();
}

function gameover(){
    var endScore = $("#score").text();
    bestScore = localStorage.getItem("bestScore");
    if(bestScore<endScore)
        localStorage.setItem("bestScore",endScore);
    $("#gameover").css('display','block');     
}

function isadded(){
	for(var i = 0;i<4;i++){
        for(var j = 0;j<4;j++){
        	add[i][j] = 0;
        }
   }
}

function moveLeft(){
    //判断格子是否能够向左移动
    if( !canMoveLeft(game))
        return false;
    isadded();
    for(var i = 0;i<4;i++)
        for(var j = 1;j<4;j++){//第一列的数字不可能向左移动
            if(game[i][j] !=0){
                
                for(var k = 0;k<j;k++){
                    //落脚位置的是否为空 && 中间没有障碍物
                    if(game[i][k] == 0 && noBlockH(i , k, j, game)){
                        //move
                        moveAnimation(i, j,i,k);
                        game[i][k] = game[i][j];
                        game[i][j] = 0;
                        continue;
                    }
                    //落脚位置的数字和本来的数字相等 && 中间没有障碍物
                    else if(game[i][k] == game[i][j] && noBlockH(i , k, j, game)){
                        //move
                        moveAnimation(i, j,i,k);
                        //add
                        if(add[i][k]!=0){//目标落脚点是否完成过合并
                        		game[i][k+1] = game[i][j];
                        		game[i][j] = 0;
                        }
                        else{
                        	game[i][k] += game[i][j];
                        	game[i][j] = 0;
                        	add[i][k] = 1;
                        	score +=game[i][k];
                            document.getElementById("score").innerHTML=score;
                        }
                        continue;
                    }
                }
            }
        }
    setTimeout("updateLook()",200);
    return true;
}

function moveRight(){
    //判断格子是否能够向右移动
    if( !canMoveRight(game))
        return false;
    isadded();
    for(var i = 0;i<4;i++)
        for(var j = 2;j>=0;j--){
        //最后一列的数字不可能向右移动
            if(game[i][j] !=0){
                for(var k = 3;k>j;k--){
                    //落脚位置的是否为空 && 中间没有障碍物
                    if(game[i][k] == 0 && noBlockH(i , j, k, game)){
                        //move
                        moveAnimation(i, j,i,k);
                        game[i][k] = game[i][j];
                        game[i][j] = 0;
                        continue;
                    }
                    //落脚位置的数字和本来的数字相等 && 中间没有障碍物
                    else if(game[i][k] == game[i][j] && noBlockH(i , j, k, game)){
                        moveAnimation(i, j,i,k);
                         if(add[i][k]!=0){
                        		game[i][k-1] = game[i][j];
                        		game[i][j] = 0;
                        }
                        else{
                        	game[i][k] += game[i][j];
                        	game[i][j] = 0;
                        	add[i][k] = 1;
                        	score +=game[i][k];
                            document.getElementById("score").innerHTML=score;
                        }
                        continue;
                    }
                }
            }
        }
    setTimeout("updateLook()",200);
    return true;
}

function moveUp(){
    //判断格子是否能够向上移动
    if( !canMoveUp(game))
        return false;
    isadded();
    for(var j = 0;j<4;j++)
        for(var i = 1;i<4;i++){
        //第一行的数字不可能向上移动
            if(game[i][j] !=0){
                for(var k = 0;k<i;k++){
                    //落脚位置的是否为空 && 中间没有障碍物
                    if(game[k][j] == 0 && noBlockV(j , k, i, game)){
                        moveAnimation(i, j,k,j);
                        game[k][j] = game[i][j];
                        game[i][j] = 0;
                        continue;
                    }
                    //落脚位置的数字和本来的数字相等 && 中间没有障碍物
                    else if(game[k][j] == game[i][j] && noBlockV(j , k, i, game)){
                        moveAnimation(i, j,k,j);
                        //之前有相加，则不相加
                        if(add[k][j]!=0){
                        	game[k+1][j] = game[i][j];
                        	game[i][j] = 0;
                        }
                        else{
                        	game[k][j] += game[i][j];
                        	game[i][j] = 0;
                        	add[k][j] = 1;
                        	score +=game[k][j];
                            document.getElementById("score").innerHTML=score;
                        }
                        continue;
                    }
                }
            }
        }
    setTimeout("updateLook()",200);
    return true;
}

function moveDown(){
    //判断格子是否能够向下移动
    if( !canMoveDown(game))
        return false;
        
    isadded();
    for(var j = 0;j<4;j++)
        for(var i = 2;i>=0;i--){
        //最后一行的数字不可能向下移动
            if(game[i][j] !=0){
                for(var k = 3;k>i;k--){
                    //落脚位置的是否为空 && 中间没有障碍物
                    if(game[k][j] == 0 && noBlockV(j , i, k, game)){
                        moveAnimation(i, j,k,j);
                        game[k][j] = game[i][j];
                        game[i][j] = 0;
                        continue;
                    }
                    //落脚位置的数字和本来的数字相等 && 中间没有障碍物
                    else if(game[k][j] == game[i][j] && noBlockV(j , i, k, game)){
                        moveAnimation(i, j,k,j);
                        //之前有相加，则不相加
                        if(add[k][j]!=0){
                        	game[k-1][j] = game[i][j];
                        	game[i][j] = 0;
                        }
                        else{
                        	game[k][j] += game[i][j];
                        	game[i][j] = 0;
                        	add[k][j] = 1;
                        	score +=game[k][j];
                            document.getElementById("score").innerHTML=score;
                        }
                        continue;
                    }
                }
            }
        }
    setTimeout("updateLook()",200);
    return true;
}


//根据数值判断格子的背景颜色
function getcolor(number) {
    switch (number) {
    case 2:
        return "#eee4da";
        break;
    case 4:
        return "#eee4da";
        break;
    case 8:
        return "#f26179";
        break;
    case 16:
        return "#f59563";
        break;
    case 32:
        return "#f67c5f";
        break;
    case 64:
        return "#f65e36";
        break;
    case 128:
        return "#edcf72";
        break;
    case 256:
        return "#edcc61";
        break;
    case 512:
        return "#9c0";
        break;
    case 1024:
        return "#3365a5";
        break;
    case 2048:
        return "#09c";
        break;
    case 4096:
        return "#a6bc";
        break;
    case 8192:
        return "#93c";
        break;
    }
    return "black";
}

function getNumberColor(number) {
    if (number <= 4){
        return "#776e65";
    }
    return "white";
}


//判断是否还有空间
function isspace(board) {
    for ( var i = 0; i < 4; i++) 
        for ( var j = 0; j < 4; j++) 
            if (board[i][j] == 0)
                return false;
    return true;
}

//实现功能判断
function canMoveLeft( board ){ 
    for(var i = 0;i<4;i++)
        for(var j = 0;j<4;j++)
            if( board[i][j] !=0 && j != 0)
                if( board[i][j-1] == 0 || board[i][j-1] == board[i][j])
                    return true;
                    
    return false;
}

function canMoveRight( board ){
    for(var i = 0;i<4;i++)
        for(var j = 0;j<4;j++)
            if( board[i][j] !=0 && j != 3)
                if( board[i][j+1] == 0 || board[i][j+1] == board[i][j])
                    return true;
                    
    return false;
}

function canMoveUp( board ){
    for(var i = 0;i<4;i++)
        for(var j = 0;j<4;j++)
            if( board[i][j] !=0 && i != 0)
                if( board[i-1][j] == 0 || board[i-1][j] == board[i][j])
                    return true;   
    return false;
}

function canMoveDown( board ){
    for(var i = 0;i<4;i++)
        for(var j = 0;j<4;j++)
            if( board[i][j] !=0 && i != 3)
                if( board[i+1][j] == 0 || board[i+1][j] == board[i][j])
                    return true;
    return false;
}

//判断水平方向是否有障碍物
function noBlockH(row, col1, col2, board){
    for(var i = col1 + 1; i<col2; i++)
        if(board[row][i]!=0)
            return false;
    return true;
}

//判断竖直方向是否有障碍物
function noBlockV(col, row1, row2, board){
    for(var i = row1 + 1; i<row2; i++)
        if(board[i][col]!=0)
            return false;
    return true;
}
//最后收尾
function nomove(board){
    if(canMoveLeft(board)|| canMoveRight(board)||canMoveUp(board)||canMoveDown(board))
        return false;
    return true;
}


function numberAnimation(i, j, randNumber) {
//实现随机数字的样式变动
    var numberCell = $('#number-' + i + '-' + j);
    numberCell.css({
        "background-color": getcolor(randNumber),
        "color": getNumberColor(randNumber)
    });
    numberCell.text(randNumber);
    numberCell.animate({
        width : "100px",
        height : "100px",
        top : 10 + i * 120,
        left : 10 + j * 120
    }, 50);
}
//实现移动格子的样式变动
function moveAnimation(i, j, i1, j1){
    var numberCell = $('#number-'+i +'-'+j);
    numberCell.animate({
        top:10 + i1 * 120,
        left:10 + j1 * 120
    },200);
}