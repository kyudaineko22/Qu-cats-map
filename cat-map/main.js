// ==========================
// Firebase設定
// ==========================

const firebaseConfig = {

  apiKey: "AIzaSyBm4zHG4OsX3ql3oItk3AILSwbvOpge-k4",

  authDomain: "qu-cats-map.firebaseapp.com",

  projectId: "qu-cats-map",

  storageBucket:
    "qu-cats-map.firebasestorage.app",

  messagingSenderId:
    "1070969621910",

  appId:
    "1:1070969621910:web:67199bf212e602e10821b7",

  measurementId:
    "G-FKH3TLZYL2"

};

firebase.initializeApp(firebaseConfig);

const db =
  firebase.firestore();


// ==========================
// MapTiler設定
// ==========================

const mapTilerKey =
  "gPDutQ8FXStgDTDt0Zq2";


// ==========================
// トップマップ作成
// ==========================

function createViewMap() {

  const mapElement =
    document.getElementById("view-map");

  if (!mapElement) return;


  const viewMap =
    L.map("view-map")
      .setView(
        [33.5904, 130.2220],
        16
      );


  // ==========================
  // MapTiler
  // ==========================

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
  ).addTo(viewMap);


  loadPostsToMap(viewMap);

}


// ==========================
// 投稿ピン表示
// ==========================

async function loadPostsToMap(map) {

  try {

    const snapshot =
      await db.collection("posts")
        .orderBy(
          "createdAt",
          "desc"
        )
        .get();


    snapshot.forEach(doc => {

      const data =
        doc.data();


      if (!data.location) return;


      let text =
        "🐈 猫情報";


      // ==========================
      // 猫情報
      // ==========================

      if (
        data.cats &&
        data.cats.length > 0
      ) {

        const cat =
          data.cats[0];


        text +=
          "<br><br>柄：" +
          (cat.pattern || "不明");


        // さくら
        if (cat.sakura) {

          text +=
            "<br>🌸" +
            cat.sakura;

        }


        // 特徴
        if (
          cat.features &&
          cat.features.length > 0
        ) {

          text +=
            "<br>特徴：" +
            cat.features.join("・");

        }


        // 複数匹
        if (data.cats.length > 1) {

          text +=
            "<br><br>他 " +
            (data.cats.length - 1) +
            "匹";

        }

      }


      // ==========================
      // 日時
      // ==========================

      if (data.date) {

        text +=
          "<br><br>日時：" +
          data.date;

      }


      // ==========================
      // ピン
      // ==========================

      L.marker(
        [
          data.location.lat,
          data.location.lng
        ]
      )
        .addTo(map)
        .bindPopup(text);

    });

  }
  catch (error) {

    console.log(
      "投稿読み込みエラー",
      error
    );

  }

}


// ==========================
// 最新投稿3件
// ==========================

async function loadLatestPosts() {

  const area =
    document.getElementById(
      "latest-posts"
    );

  if (!area) return;


  try {

    const snapshot =
      await db.collection("posts")
        .orderBy(
          "createdAt",
          "desc"
        )
        .limit(3)
        .get();


    area.innerHTML = "";


    // ==========================
    // 投稿がない場合
    // ==========================

    if (snapshot.empty) {

      area.innerHTML =
        "まだ投稿はありません";

      return;

    }


    // ==========================
    // 投稿を表示
    // ==========================

    snapshot.forEach(doc => {

      const data =
        doc.data();


      const div =
        document.createElement("div");


      div.className =
        "post-card";


      // ==========================
      // 日時
      // ==========================

      const formattedDate =
        data.date
          ? new Date(data.date)
              .toLocaleString("ja-JP")
          : "";


      let text = "";


      // ==========================
      // 猫情報
      // ==========================

      if (
        data.cats &&
        data.cats.length
      ) {

        data.cats.forEach(
          (cat, index) => {

            text += `
              <div class="latest-cat">

                <strong>
                  🐈 猫${index + 1}
                </strong>

                <br>

                柄：
                ${cat.pattern || "不明"}

                <br>

                さくら耳：
                ${cat.sakura || "不明"}

                <br>

                特徴：
                ${
                  cat.features &&
                  cat.features.length
                    ? cat.features.join("・")
                    : "なし"
                }

              </div>
            `;

          }
        );


        // ==========================
        // 投稿日時
        // ==========================

        text +=
          "<br><small>" +
          formattedDate +
          "</small>";

      }
      else {

        text =
          "目撃情報";

      }


      div.innerHTML =
        text;


      area.appendChild(div);

    });

  }
  catch (error) {

    area.innerHTML =
      "投稿を読み込めませんでした";


    console.log(
      "最新投稿読み込みエラー",
      error
    );

  }

}


// ==========================
// 実行
// ==========================

createViewMap();

loadLatestPosts();