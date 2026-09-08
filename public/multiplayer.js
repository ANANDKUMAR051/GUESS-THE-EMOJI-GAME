const socket=io();const user=JSON.parse(localStorage.getItem("user")||"null");if(!user)location.href="login.html";
let roomId="",canSubmit=false;
const $=id=>document.getElementById(id);
$("find").onclick=()=>{ $("find").disabled=true;$("status").textContent="Searching for another player…";socket.emit("findMatch",{username:user.username})};
socket.on("matchWaiting",()=>{$("status").textContent="You’re in the queue. Waiting for an opponent…"});
socket.on("matchFound",data=>{roomId=data.roomId;$("waiting").classList.add("hidden");$("match").classList.remove("hidden");canSubmit=true;render(data)});
function render(data){$("meName").textContent=data.players[0].username==user.username?"You":data.players[0].username;$("opName").textContent=data.players[1].username==user.username?"You":data.players[1].username;$("meScore").textContent=data.players[0].username==user.username?data.players[0].score:data.players[1].score;$("opScore").textContent=data.players[0].username==user.username?data.players[1].score:data.players[0].score;$("mpEmoji").textContent=data.puzzle;$("mpRound").textContent=`Round ${data.round} / ${data.maxRounds}`;$("mpFeedback").textContent=""}
$("mpSubmit").onclick=()=>{if(!canSubmit)return;const guess=$("mpGuess").value.trim();if(!guess)return;canSubmit=false;socket.emit("submitMultiplayerGuess",{roomId,guess});$("mpGuess").value=""};
$("mpGuess").addEventListener("keydown",e=>{if(e.key==="Enter")$("mpSubmit").click()});
socket.on("guessResult",d=>{$("mpFeedback").textContent=d.correct?`✅ ${d.username} got it!`:`❌ ${d.username} missed it`;const mine=d.scores.find(x=>x.username===user.username),opp=d.scores.find(x=>x.username!==user.username);if(mine)$("meScore").textContent=mine.score;if(opp)$("opScore").textContent=opp.score});
socket.on("nextMultiplayerRound",d=>{canSubmit=true;$("mpEmoji").textContent=d.puzzle;$("mpRound").textContent=`Round ${d.round} / ${d.maxRounds}`});
socket.on("multiplayerGameOver",d=>{alert(`Game over! Winner: ${d.winner}`);location.href="menu.html"});
socket.on("opponentLeft",()=>{alert("Your opponent left the game.");location.href="menu.html"});
