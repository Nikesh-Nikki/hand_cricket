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
        aPlayed : false
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


function playBall(roomCode,username,value,cb){
    const game = this.getGame(roomCode)
    const player = game.players.find(
        (p) => p.username==username
    )
    if(game.bPlayed || game.aPlayed) {
        //call function for playing
        if(player.team == 'A') game.ballA = value
        else game.ballB = value
        cb()
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
    playBall
}