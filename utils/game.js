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
        inningsOver : 0,
        overs : 0,
        balls : 0
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

function assignTeams(game){
    let {players} = game
    for(let i = 0 ;i < players.length ;i++){
        players[i].team = "AB"[i%2]
    }
}

function gameOver(roomCode){
    const game = this.getGame(roomCode)
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
        if( ! this.changeBatsman(game) )
        {
            game.inningsOver ++
            game.battingA = !game.battingA
        }
    } else {
        if(game.battingA) game.scoreA += game.ballA
        else game.scoreB += game.ballB
    }
}

function nextPlayer(players,username){
    const index = players.map(p=>p.username).indexOf(username)
    if(index == -1) return
    if(index+2 < players.length) return players[index+2].username
}

function changeBowler(game){
    const players = game.players;
    const currentBowler = (game.battingA) ? game.playerB : game.playerA
    const nextBowler = nextPlayer(players,currentBowler)
    if(!nextBowler){
        if(game.battingA){
            game.playerB = players.find((p)=>p.team=='B').username
        } else {
            game.playerA = players.find((p)=>p.team=='A').username
        }
    }
    if(game.battingA) game.playerB = nextBowler
    else game.playerA = nextBowler
}

function changeBatsman(game){
    const players = game.players;
    const currentBatsman = (game.battingA) ? game.playerA : game.playerB
    const nextBatsman = nextPlayer(players,currentBatsman)
    if(!nextBatsman) return
    if(game.battingA) game.playerA = nextBatsman
    else game.playerB = nextBatsman
}

function resetRoom(game){
    game.scoreA =game.scoreB = game.ballA = game.ballB = game.inningsOver = game.overs = game.balls = 0
}

function playBall(roomCode,username,value,cb,over){
    const game = this.getGame(roomCode)
    if(!game) return
    const player = game.players.find(
        (p) => p.username==username
    )
    if(!player) return
    if(game.bPlayed || game.aPlayed) {
        //call function for playing
        if(player.team == 'A') game.ballA = value
        else game.ballB = value
        this.updateGame(roomCode)
        game.balls++
        if(game.balls == 6){
            game.overs++
            game.balls = 0
            changeBowler(game)
        }
        cb()
        game.bPlayed = false 
        game.aPlayed = false
        const result = this.gameOver(roomCode)
        if(result){
            game.gameInProgress = false
            over(result)
            resetRoom(game)
        }
    }
    else if(player.team == 'A'){
        game.ballA = value
        game.aPlayed = true
    } else {
        game.ballB = value
        game.bPlayed = true
    }
}

function startGame(roomCode){
    const game = this.getGame(roomCode)
    this.assignTeams(game)
    if(game.players[0].team == 'A'){
        game.playerA = game.players[0].username
        game.playerB = game.players[1].username
    } else {
        game.playerB = game.players[0].username
        game.playerA = game.players[1].username
    }
    game.gameInProgress = true
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
    startGame,
    changeBatsman,
    changeBowler,
    nextPlayer,
    totalInnings : 2
}