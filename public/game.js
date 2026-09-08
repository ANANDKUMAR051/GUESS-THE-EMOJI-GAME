const puzzles=[
["🦁👑","the lion king"],["🦇🌃","batman"],["🚢🧊","titanic"],["🕷️🦸","spiderman"],
["⚡🧙","harry potter"],["🦖🌎","jurassic world"],["👻🚫","ghostbusters"],["🏠🎈","up"],
["🤖❤️","wall e"],["🐠🔎","finding nemo"],["🎤👑","queen"],["🌧️☂️","singin in the rain"]
];
const user=JSON.parse(localStorage.getItem("user")||"null"); if(!user) location.href="login.html";
let round=0,score=0,attempts=3,wrong=0,timer=60,active=true,current=null,used=[];
const $=id=>document.getElementById(id);
function normalize(s){return s.toLowerCase().replace(/[^a-z0-9]/g,"")}
function pick(){let available=puzzles.filter((_,i)=>!used.includes(i));if(!available.length){used=[];available=puzzles};const item=available[Math.floor(Math.random()*available.length)];current=item;used.push(puzzles.indexOf(item));attempts=3;$("emoji").textContent=item[0];$("round").textContent=`Round ${round+1} / 5`;$("attempts").textContent=attempts;$("guess").value="";$("feedback").textContent="";$("guess").focus()}
function finish(){if(!active)return;active=false;clearInterval(interval);localStorage.setItem("lastScore",score);
fetch("/api/game/save",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({userId:user.id,score,rounds:round+1,won:score>=60,mode:"solo"})})
.then(()=>fetch("/api/achievements/update",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({userId:user.id,score,perfect:wrong===0})}))
.finally(()=>location.href="gameover.html")}
function next(){round++;if(round>=5)finish();else pick()}
$("submit").onclick=()=>{if(!active)return;const guess=normalize($("guess").value);if(!guess)return;$("guess").value="";
if(guess===normalize(current[1])){score+=20;$("score").textContent=score;$("feedback").textContent="✅ Correct! +20";setTimeout(next,700)}
else{wrong++;attempts--;$("attempts").textContent=attempts;if(attempts<=0){$("feedback").textContent=`❌ Answer: ${current[1]}`;setTimeout(next,1100)}else $("feedback").textContent=`❌ Wrong — ${attempts} attempts left`}}
$("guess").addEventListener("keydown",e=>{if(e.key==="Enter")$("submit").click()});
$("hint").onclick=()=>{if(!active||!current)return;$("feedback").textContent=`💡 Starts with "${current[1][0].toUpperCase()}"`};
const interval=setInterval(()=>{if(!active)return;timer--;$("timer").textContent=`${timer}s`;if(timer<=0)finish()},1000);pick();
