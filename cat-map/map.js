
// ==========================
// Firebase
// ==========================

const firebaseConfig = {
  apiKey: "AIzaSyBm4zHG4OsX3ql3oItk3AILSwbvOpge-k4",
  authDomain: "qu-cats-map.firebaseapp.com",
  projectId: "qu-cats-map",
  storageBucket: "qu-cats-map.firebasestorage.app",
  messagingSenderId: "1070969621910",
  appId: "1:1070969621910:web:67199bf212e602e10821b7",
  measurementId: "G-FKH3TLZYL2"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();


// ==========================
// MapTiler設定
// ==========================

const mapTilerKey =
  "gPDutQ8FXStgDTDt0Zq2";


// ==========================
// 変数
// ==========================

let map;
let markers = [];
let posts = [];


// ==========================
// 地図を作成
// ==========================

function createMap() {

  map = L.map("big-map").setView(
    [33.5904, 130.2220],
    16
  );

  L.tileLayer(
    `https://api.maptiler.com/maps/streets-v4/{z}/{x}/{y}.png?key=${mapTilerKey}`,
    {
      tileSize: 512,
      zoomOffset: -1,
      minZoom: 1,
      attribution:
        '&copy; MapTiler &copy; OpenStreetMap contributors',
      crossOrigin: true
    }
  ).addTo(map);

}

createMap();


// ==========================
// Firebaseから投稿データを取得
// ==========================

db.collection("posts")
  .orderBy("createdAt", "desc")
  .get()
  .then(snapshot => {

    snapshot.forEach(doc => {

      posts.push(doc.data());

    });

    displayMarkers(posts);

  })
  .catch(error => {

    console.error(
      "投稿データの取得に失敗しました:",
      error
    );

  });


// ==========================
// マーカーを表示
// ==========================

function displayMarkers(list) {

  clearMarkers();

  list.forEach(post => {

    if (!post.location) return;
    if (!post.cats) return;

    post.cats.forEach((cat, index) => {

      const icon =
        createCatIcon(cat.pattern);

      const marker =
        L.marker(
          [
            post.location.lat,
            post.location.lng
          ],
          {
            icon: icon
          }
        )
        .addTo(map);


      // ==========================
      // ポップアップ
      // ==========================

      marker.bindPopup(`

        <h3>
          🐈 猫${index + 1}
        </h3>

        <p>
          柄：
          ${cat.pattern || "不明"}
        </p>

        <p>
          🌸さくら：
          ${cat.sakura || "不明"}
        </p>

        <p>
          特徴：
          ${
            cat.features?.join("・")
            ||
            "なし"
          }
        </p>

        <p>
          日時：
          ${post.date || ""}
        </p>

      `);


      markers.push(marker);

    });

  });

}


// ==========================
// 猫のピン画像
// ==========================

function createCatIcon(pattern) {

  let file = "";

  switch (pattern) {

    case "黒":
      file = "pin-icon-black.jpeg";
      break;

    case "灰":
      file = "pin-icon-gray.jpeg";
      break;

    case "白":
      file = "pin-icon-white.jpeg";
      break;

    case "茶":
      file = "pin-icon-cha.jpeg";
      break;

    case "三毛":
      file = "pin-icon-mike.jpeg";
      break;

    case "キジ・サバ":
      file = "pin-icon-kijitora.jpeg";
      break;

    case "白黒":
      file = "pin-icon-sirokuro.jpeg";
      break;

    case "サビ":
      file = "pin-icon-sabi.jpeg";
      break;

    case "その他":
      file = "pin-icon-sonota.jpeg";
      break;

    default:
      file = "pin-icon-humei.jpeg";
      break;

  }


  return L.icon({

    iconUrl:
      "assets/pins/" + file,

    iconSize:
      [45, 45],

    iconAnchor:
      [22, 45]

  });

}


// ==========================
// マーカーを全部削除
// ==========================

function clearMarkers() {

  markers.forEach(marker => {

    map.removeLayer(marker);

  });

  markers = [];

}


// ==========================
// フィルター適用
// ==========================

const applyBtn =
  document.getElementById(
    "apply-filter"
  );

if (applyBtn) {

  applyBtn.onclick = () => {

    const filtered =
      posts.filter(post => {

        if (!post.cats) {
          return false;
        }


        // --------------------------
        // 日付フィルター
        // --------------------------

        const dateFilter =
          document.getElementById(
            "date-filter"
          )?.value || "all";

        if (
          dateFilter !== "all" &&
          post.date
        ) {

          const postDate =
            new Date(post.date);

          const limit =
            new Date();

          limit.setDate(
            limit.getDate() -
            Number(dateFilter)
          );

          if (
            postDate < limit
          ) {

            return false;

          }

        }


        // --------------------------
        // 猫の条件
        // --------------------------

        return post.cats.some(cat => {


          // --------------------------
          // 柄
          // --------------------------

          const selectedPattern =
            document.getElementById(
              "pattern-filter"
            )?.value || "all";

          if (
            selectedPattern !== "all" &&
            cat.pattern !== selectedPattern
          ) {

            return false;

          }


          // --------------------------
          // さくらカット
          // --------------------------

          const selectedSakura =
            document.getElementById(
              "sakura-filter"
            )?.value || "all";

          if (
            selectedSakura !== "all" &&
            cat.sakura !== selectedSakura
          ) {

            return false;

          }


          // --------------------------
          // 特徴
          // --------------------------

          const selectedFeature =
            document.getElementById(
              "feature-filter"
            )?.value || "all";

          if (
            selectedFeature !== "all"
          ) {

            if (
              !cat.features ||
              !cat.features.includes(
                selectedFeature
              )
            ) {

              return false;

            }

          }


          return true;

        });

      });


    displayMarkers(filtered);

  };

}


// ==========================
// フィルターリセット
// ==========================

const resetBtn =
  document.getElementById(
    "reset-filter"
  );

if (resetBtn) {

  resetBtn.onclick = () => {

    const pattern =
      document.getElementById(
        "pattern-filter"
      );

    const feature =
      document.getElementById(
        "feature-filter"
      );

    const sakura =
      document.getElementById(
        "sakura-filter"
      );

    const date =
      document.getElementById(
        "date-filter"
      );


    if (date) {

      date.value =
        "all";

    }

    if (pattern) {

      pattern.value =
        "all";

    }

    if (feature) {

      feature.value =
        "all";

    }

    if (sakura) {

      sakura.value =
        "all";

    }


    displayMarkers(posts);

  };

}


// ==========================
// ウィンドウサイズ変更時
// ==========================

window.addEventListener(
  "resize",
  () => {

    if (map) {

      map.invalidateSize();

    }

  }
);