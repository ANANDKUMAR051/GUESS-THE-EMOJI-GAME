const API = "";
const getUser = () => JSON.parse(localStorage.getItem("user") || "null");
const requireUser = () => { const u=getUser(); if(!u) location.href="login.html"; return u; };
async function refreshUser(){
  const u=getUser(); if(!u) return null;
  const r=await fetch(`${API}/api/auth/me?userId=${encodeURIComponent(u.id)}`);
  if(!r.ok){localStorage.removeItem("user");return null;}
  const data=await r.json(); localStorage.setItem("user",JSON.stringify(data.user)); return data.user;
}
async function loadLeaderboard(id="leaderboard"){
  const box=document.getElementById(id); if(!box)return;
  const data=await fetch("/api/leaderboard").then(r=>r.json());
  box.innerHTML=data.length?data.map(x=>`<div class="leaderboard-entry"><span class="rank">#${x.rank}</span><span>${escapeHtml(x.username)}</span><b>${x.score} pts</b></div>`).join(""):"<div class='leaderboard-entry'>No scores yet. Be the first!</div>";
}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
document.addEventListener("DOMContentLoaded",async()=>{
  const logout=document.getElementById("logout");
  if(logout) logout.onclick=()=>{localStorage.removeItem("user");location.href="index.html"};
  if(document.getElementById("playerName")){
    const u=requireUser(); if(!u)return; const fresh=await refreshUser()||u;
    playerName.textContent=fresh.username; highScore.textContent=fresh.highScore; gamesPlayed.textContent=fresh.gamesPlayed; cash.textContent=fresh.cash; diamonds.textContent=fresh.diamonds;
    loadLeaderboard();
  }
});
