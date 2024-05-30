function getGame(roomCode){
    return (
        this.games.find(
            (game) => (game.roomCode == roomCode)
        )
    );
}

function randomCode(){
    let code = "";
    const str = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    for(let i =  0 ;i < 6 ; i++){
        code += str[Math.floor(Math.random()*26)];
    }

    return code;
}

function roomCodeGenerator(){
    let code = randomCode();
    while(this.getGame(code)) code = randomCode();
    return code;
}

function createGame(){
    let game = {
        roomCode : this.roomCodeGenerator() , 
        ballA : 0,
        ballB : 0,
        battingA : true,
        gameInProgress : false,
        scoreA : 0 , 
        scoreB : 0 , 
        players : [],
        bPlayed : false,
        aPlayed : false,
        inningsOver : 0
    };
    this.games.push(game);
    return game;
}

function joinGame(roomCode , username){
    const game = this.getGame(roomCode)
    if(game.gameInProgress) return
    if (
        game.players.find(
            (p) => (p.username == username)
        )
    ) return
    game.players.push(
        { 
            username : username
        }
    )
}

function userCanJoin( username , roomCode ){
    console.log(roomCode)
    const game = this.getGame(roomCode)
    console.log(game)
    if(game.gameInProgress){
        const player = game.players.find(
            (p) => (p.username == username)
        )
        if(player) return true
        else return false
    } else {
        return true
    }
}

function assignTeams(roomCode){
    let {players} = this.getGame(roomCode)
    for(let i = 0 ;i < players.length ;i++){
        players[i].team = "AB"[i%2]
    }
}

function gameOver(roomCode){
    const game = this.getGame(roomCode)
    console.log(game.inningsOver +  ' '+ this.totalInnings)
    if(game.inningsOver == this.totalInnings) {
        if(game.scoreA>game.scoreB) return 'A'
        else if(game.scoreA < game.scoreB) return 'B'
        else return 'D'
    } else if(game.inningsOver == this.totalInnings - 1) {
        if(game.battingA && game.scoreA > game.scoreB) return 'A'
        else if(!game.battingA && game.scoreB > game.scoreA) return 'B'
    }
}

function updateGame(roomCode){
    const game = this.getGame(roomCode)
    if(game.ballA == game.ballB) {
        // it means batsman is out
        if(
            true
            // if all players in team are out
        )
        {
            game.inningsOver ++
            game.battingA = !game.battingA
        }
        else {
            //give chance to next player in the same team
        }
    } else {
        if(game.battingA) game.scoreA += game.ballA
        else game.scoreB += game.ballB
    }
}

function playBall(roomCode,username,value,cb,over){
    const game = this.getGame(roomCode)
    if(!game) return
    const player = game.players.find(
        (p) => p.username==username
    )
    if(game.bPlayed || game.aPlayed) {
        //call function for playing
        if(player.team == 'A') game.ballA = value
        else game.ballB = value
        this.updateGame(roomCode)
        cb()
        const result = this.gameOver(roomCode)
        console.log(result)
        if(result) over(result)
        game.bPlayed = false 
        game.aPlayed = false
    }
    else if(player.team == 'A'){
        game.ballA = value
        game.aPlayed = true
    } else {
        game.ballB = value
        game.bPlayed = true
    }
}

export default {
    games : [],
    createGame,
    joinGame,
    roomCodeGenerator,
    getGame,
    randomCode,
    userCanJoin,
    assignTeams,
    playBall,
    updateGame,
    gameOver,
    totalInnings : 2
}