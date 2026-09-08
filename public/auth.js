const form=document.querySelector("form"), message=document.getElementById("message");
form.addEventListener("submit",async e=>{
  e.preventDefault();
  const username=document.getElementById("username").value.trim();
  const password=document.getElementById("password").value;
  if(form.id==="signupForm"){
    const confirm=document.getElementById("confirmPassword").value;
    if(password!==confirm){message.textContent="Passwords do not match";return;}
  }
  const endpoint=form.id==="signupForm"?"/api/auth/signup":"/api/auth/login";
  try{
    const r=await fetch(endpoint,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username,password})});
    const data=await r.json();
    if(!r.ok) throw new Error(data.message||"Request failed");
    if(form.id==="signupForm"){location.href="login.html";return;}
    localStorage.setItem("user",JSON.stringify(data.user)); location.href="menu.html";
  }catch(err){message.textContent=err.message}
});
