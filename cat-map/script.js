// ==========================
// Firebase設定
// ==========================


const firebaseConfig = {

apiKey: "AIzaSyCPSWkc7VfhhEROFY_EdPyP56kS66tTQZ4",

authDomain: "kyudai-cat-map.firebaseapp.com",

projectId: "kyudai-cat-map",

storageBucket:
"kyudai-cat-map.firebasestorage.app",

messagingSenderId:
"164561348047",

appId:
"1:164561348047:web:e3733a0ea44a3e37339eba"

};



firebase.initializeApp(firebaseConfig);


const db =
firebase.firestore();




// ==========================
// 変数
// ==========================


let selectedCats = [];

let currentLocation = null;

let postMap = null;

let viewMap = null;

let marker = null;







// ==========================
// 頭数入力
// ==========================


const countInput =
document.getElementById("cat-count");



if(countInput){


countInput.addEventListener(
"change",
function(){


let count =
Number(this.value);



if(count < 1){

this.value = 1;

}



selectedCats = [];


displaySelectedCats();


});



}









// ==========================
// 柄選択
// ==========================


document
.querySelectorAll(".pattern-btn")
.forEach(btn=>{


btn.addEventListener(
"click",
()=>{


const count =
Number(
document.getElementById("cat-count").value
);



if(!count){

alert(
"先に頭数を入力してください"
);

return;

}



if(selectedCats.length >= count){

alert(
"入力した頭数分までです"
);

return;

}



const pattern =
btn.innerText.replace(/\n/g,"");



selectedCats.push({

pattern:pattern

});



displaySelectedCats();


});



});









// ==========================
// 選択表示
// ==========================


function displaySelectedCats(){



const area =
document.getElementById(
"selected-cats"
);



if(!area)
return;



area.innerHTML="";





const grouped = {};



selectedCats.forEach(cat=>{


if(!grouped[cat.pattern]){

grouped[cat.pattern]=0;

}


grouped[cat.pattern]++;


});





Object.keys(grouped)
.forEach(pattern=>{


const div =
document.createElement("div");


div.className =
"post-card";



let text =
"🐈 "
+
pattern;



if(grouped[pattern] > 1){

text +=
" × "
+
grouped[pattern];

}



div.innerHTML =

text
+
`
<button 
class="delete-cat"
data-pattern="${pattern}">
削除
</button>
`;



area.appendChild(div);


});







document
.querySelectorAll(".delete-cat")
.forEach(btn=>{


btn.onclick = ()=>{


const target =
btn.dataset.pattern;



const index =
selectedCats.findIndex(
cat =>
cat.pattern===target
);



if(index !== -1){


selectedCats.splice(index,1);


}



displaySelectedCats();



};


});


}











// ==========================
// 投稿地図
// ==========================


function createPostMap(){



if(!document.getElementById("map"))
return;



postMap =
L.map("map")
.setView(
[33.5904,130.2220],
16
);



L.tileLayer(
"https://tile.openstreetmap.org/{z}/{x}/{y}.png",
{

attribution:
"© OpenStreetMap contributors"

}

)
.addTo(postMap);




postMap.on(
"click",
e=>{


currentLocation = {

lat:e.latlng.lat,

lng:e.latlng.lng

};



if(marker){

postMap.removeLayer(marker);

}



marker =
L.marker(
[
currentLocation.lat,
currentLocation.lng
]
)
.addTo(postMap);



document
.getElementById(
"location-result"
)
.innerText =
"位置を選択しました";


});



}



createPostMap();










// ==========================
// GPS
// ==========================



const gpsBtn =
document.getElementById(
"gps-btn"
);



if(gpsBtn){


gpsBtn.onclick = ()=>{


navigator.geolocation.getCurrentPosition(

pos=>{


currentLocation={

lat:
pos.coords.latitude,

lng:
pos.coords.longitude

};



if(marker){

postMap.removeLayer(marker);

}



marker =
L.marker(
[
currentLocation.lat,
currentLocation.lng
]
)
.addTo(postMap);



postMap.setView(
[
currentLocation.lat,
currentLocation.lng
],
17
);



document
.getElementById(
"location-result"
)
.innerText =
"現在地を取得しました";



},


()=>{


alert(
"位置情報を取得できませんでした"
);


}

);



};



}











// ==========================
// 投稿保存
// ==========================


const postBtn =
document.getElementById(
"post-btn"
);



if(postBtn){



postBtn.onclick = async()=>{



if(
!document.getElementById("agree").checked
){

alert(
"同意してください"
);

return;

}



if(!currentLocation){

alert(
"場所を指定してください"
);

return;

}



if(selectedCats.length===0){

alert(
"柄を選択してください"
);

return;

}






await db.collection("posts")
.add({

date:
document.getElementById("date").value,


cats:selectedCats,


location:currentLocation,


createdAt:
firebase.firestore.FieldValue.serverTimestamp()


});




alert(
"投稿しました"
);



location.reload();



};


}











// ==========================
// トップマップ
// ==========================


function createViewMap(){



if(!document.getElementById("view-map"))
return;



viewMap =
L.map("view-map")
.setView(
[33.5904,130.2220],
16
);



L.tileLayer(
"https://tile.openstreetmap.org/{z}/{x}/{y}.png",
{

attribution:
"© OpenStreetMap contributors"

}

)
.addTo(viewMap);



loadPosts();



}



async function loadPosts(){


const snapshot =
await db.collection("posts")
.orderBy(
"createdAt",
"desc"
)
.get();



snapshot.forEach(doc=>{


const data =
doc.data();



if(!data.location)
return;



L.marker(
[
data.location.lat,
data.location.lng
]
)
.addTo(viewMap)
.bindPopup(
"🐈 目撃情報"
);


});


}



createViewMap();











// ==========================
// 最新3件
// ==========================


async function loadLatestPosts(){



const area =
document.getElementById(
"latest-posts"
);



if(!area)
return;



area.innerHTML="";



const snapshot =
await db.collection("posts")
.orderBy(
"createdAt",
"desc"
)
.limit(3)
.get();




snapshot.forEach(doc=>{


const data =
doc.data();



const div =
document.createElement("div");



div.className =
"post-card";



div.innerHTML =
"🐈 目撃情報";



area.appendChild(div);


});


}



loadLatestPosts();








// ==========================
// 投稿ボタン移動
// ==========================


const postLink =
document.querySelector(".post-link");



if(postLink){


postLink.onclick=()=>{


document
.getElementById("post-form")
.scrollIntoView(
{
behavior:"smooth"
}
);


};


}