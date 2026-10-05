document.addEventListener(
"DOMContentLoaded",
()=>{

const menuBtn =
document.querySelector(".menu-btn");

const sideMenu =
document.getElementById("side-menu");

const closeBtn =
document.getElementById("close-menu");

if(
!menuBtn ||
!sideMenu ||
!closeBtn
){
return;
}

menuBtn.addEventListener(
"click",
()=>{
sideMenu.classList.add("open");
}
);

closeBtn.addEventListener(
"click",
()=>{
sideMenu.classList.remove("open");
}
);

});

