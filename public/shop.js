const u=JSON.parse(localStorage.getItem("user")||"null");if(!u)location.href="login.html";
Promise.all([fetch("/api/shop").then(r=>r.json()),fetch(`/api/auth/me?userId=${u.id}`).then(r=>r.json())]).then(([items,data])=>{
 localStorage.setItem("user",JSON.stringify(data.user));
 document.getElementById("shop").innerHTML=items.map(i=>`<article class="shop-item"><div class="icon">${i.icon}</div><div><h3>${i.name}</h3><p>${i.description}</p><b>${i.price} ${i.currency}</b></div><button class="btn ghost" onclick="buy('${i.id}')">Buy</button></article>`).join("")
});
async function buy(itemId){const r=await fetch("/api/shop/buy",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({userId:u.id,itemId})});const d=await r.json();alert(d.message||"Done");if(r.ok){localStorage.setItem("user",JSON.stringify(d.user));location.reload()}}
