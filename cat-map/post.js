// ==========================
// Firebase
// ==========================

const firebaseConfig = {

  apiKey:
    "AIzaSyBm4zHG4OsX3ql3oItk3AILSwbvOpge-k4",

  authDomain:
    "qu-cats-map.firebaseapp.com",

  projectId:
    "qu-cats-map",

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
// 変数
// ==========================

let selectedCats = [];

let currentLocation = null;

let postMap = null;

let marker = null;


// ==========================
// 地図
// ==========================

function createPostMap() {

  const mapElement =
    document.getElementById("map");

  if (!mapElement) return;


  postMap =
    L.map("map")
      .setView(
        [
          33.5904,
          130.2220
        ],
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
  ).addTo(postMap);


  // ==========================
  // 地図クリック
  // ==========================

  postMap.on(
    "click",
    (e) => {

      currentLocation = {

        lat:
          e.latlng.lat,

        lng:
          e.latlng.lng

      };


      if (marker) {

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


      document.getElementById(
        "location-result"
      ).innerText =
        "位置を選択しました";

    }
  );

}


createPostMap();


// ==========================
// 現在日時を自動入力
// ==========================

const dateInput =
  document.getElementById("date");


if (dateInput) {

  const now =
    new Date();


  const year =
    now.getFullYear();


  const month =
    String(
      now.getMonth() + 1
    ).padStart(2, "0");


  const day =
    String(
      now.getDate()
    ).padStart(2, "0");


  const hour =
    String(
      now.getHours()
    ).padStart(2, "0");


  const minute =
    String(
      now.getMinutes()
    ).padStart(2, "0");


  dateInput.value =
    `${year}-${month}-${day}T${hour}:${minute}`;

}


// ==========================
// 頭数変更
// ==========================

const countInput =
  document.getElementById(
    "cat-count"
  );


if (countInput) {

  countInput.addEventListener(
    "change",
    () => {

      let count =
        Number(
          countInput.value
        );


      if (count < 1) {

        countInput.value = 1;

      }


      selectedCats =
        selectedCats.slice(
          0,
          count
        );


      document
        .querySelectorAll(
          ".pattern-btn"
        )
        .forEach(
          btn => {

            btn.classList.remove(
              "selected"
            );

          }
        );


      selectedCats.forEach(
        cat => {

          document
            .querySelector(
              `.pattern-btn[data-pattern="${cat.pattern}"]`
            )
            ?.classList.add(
              "selected"
            );

        }
      );


      displaySelectedCats();

    }
  );

}


// ==========================
// 柄選択
// ==========================

document
  .querySelectorAll(
    ".pattern-btn"
  )
  .forEach(
    btn => {

      btn.addEventListener(
        "click",
        () => {

          const limit =
            Number(
              document.getElementById(
                "cat-count"
              ).value
            );


          if (
            selectedCats.length >=
            limit
          ) {

            alert(
              "入力した頭数分までです"
            );

            return;

          }


          const pattern =
            btn.dataset.pattern;


          selectedCats.push({

            pattern:
              pattern,

            sakura:
              "不明",

            features:
              []

          });


          btn.classList.add(
            "selected"
          );


          displaySelectedCats();

        }
      );

    }
  );


// ==========================
// 猫カード表示
// ==========================

function displaySelectedCats() {

  const area =
    document.getElementById(
      "selected-cats"
    );


  if (!area) return;


  area.innerHTML = "";


  selectedCats.forEach(
    (cat, index) => {

      const card =
        document.createElement(
          "div"
        );


      card.className =
        "cat-card";


      card.innerHTML = `

        <h3>
          猫${index + 1}
        </h3>

        <p>
          柄：
          ${cat.pattern || "不明"}
        </p>


        <div class="sakura-area">

          <p>
            🌸 さくらカット
          </p>


          <button
            class="sakura-btn ${
              cat.sakura === "あり"
                ? "active"
                : ""
            }"
            data-index="${index}"
            data-value="あり"
          >
            あり
          </button>


          <button
            class="sakura-btn ${
              cat.sakura === "なし"
                ? "active"
                : ""
            }"
            data-index="${index}"
            data-value="なし"
          >
            なし
          </button>


          <button
            class="sakura-btn ${
              cat.sakura === "不明"
                ? "active"
                : ""
            }"
            data-index="${index}"
            data-value="不明"
          >
            不明
          </button>

        </div>


        <h4>
          特徴
        </h4>


        <div class="feature-buttons">


          <button
            class="feature-btn ${
              cat.features.includes(
                "くつした"
              )
                ? "selected"
                : ""
            }"
            data-index="${index}"
            data-feature="くつした"
          >

            <img
              src="assets/pins/pin-icon-sox.jpeg"
            >

            <span>
              くつした
            </span>

          </button>


          <button
            class="feature-btn ${
              cat.features.includes(
                "白いお腹"
              )
                ? "selected"
                : ""
            }"
            data-index="${index}"
            data-feature="白いお腹"
          >

            <img
              src="assets/pins/pin-icon-siroionaka.jpeg"
            >

            <span>
              白いお腹
            </span>

          </button>


          <button
            class="feature-btn ${
              cat.features.includes(
                "縞"
              )
                ? "selected"
                : ""
            }"
            data-index="${index}"
            data-feature="縞"
          >

            <img
              src="assets/pins/pin-icon-sima.png"
            >

            <span>
              縞模様
            </span>

          </button>


          <button
            class="feature-btn ${
              cat.features.includes(
                "長毛"
              )
                ? "selected"
                : ""
            }"
            data-index="${index}"
            data-feature="長毛"
          >

            <img
              src="assets/pins/pin-icon-husahusa.png"
            >

            <span>
              長毛
            </span>

          </button>


          <button
            class="feature-btn ${
              cat.features.includes(
                "かぎしっぽ"
              )
                ? "selected"
                : ""
            }"
            data-index="${index}"
            data-feature="かぎしっぽ"
          >

            <img
              src="assets/pins/pin-icon-sippo.png"
            >

            <span>
              かぎしっぽ
            </span>

          </button>


          <button
            class="feature-btn ${
              cat.features.includes(
                "首輪"
              )
                ? "selected"
                : ""
            }"
            data-index="${index}"
            data-feature="首輪"
          >

            <img
              src="assets/pins/pin-icon-kubiwa.jpeg"
            >

            <span>
              首輪
            </span>

          </button>


        </div>


        <button
          class="delete-cat"
          data-index="${index}"
        >
          削除
        </button>

      `;


      area.appendChild(card);

    }
  );

}


// ==========================
// ボタン操作
// ==========================

document.addEventListener(
  "click",
  function (e) {


    // ==========================
    // さくらカット
    // ==========================

    const sakuraBtn =
      e.target.closest(
        ".sakura-btn"
      );


    if (sakuraBtn) {

      const index =
        Number(
          sakuraBtn.dataset.index
        );


      const value =
        sakuraBtn.dataset.value;


      selectedCats[index].sakura =
        value;


      displaySelectedCats();


      return;

    }


    // ==========================
    // 特徴選択
    // ==========================

    const featureBtn =
      e.target.closest(
        ".feature-btn"
      );


    if (featureBtn) {

      const index =
        Number(
          featureBtn.dataset.index
        );


      const feature =
        featureBtn.dataset.feature;


      if (
        !selectedCats[index].features
      ) {

        selectedCats[index].features =
          [];

      }


      const list =
        selectedCats[index].features;


      if (
        list.includes(feature)
      ) {

        selectedCats[index].features =
          list.filter(
            f => f !== feature
          );

      }
      else {

        selectedCats[index].features.push(
          feature
        );

      }


      displaySelectedCats();


      return;

    }


    // ==========================
    // 削除
    // ==========================

    const deleteBtn =
      e.target.closest(
        ".delete-cat"
      );


    if (deleteBtn) {

      const index =
        Number(
          deleteBtn.dataset.index
        );


      selectedCats.splice(
        index,
        1
      );


      displaySelectedCats();


      return;

    }

  }
);


// ==========================
// GPS
// ==========================

const gpsBtn =
  document.getElementById(
    "gps-btn"
  );


if (gpsBtn) {

  gpsBtn.onclick = () => {

    navigator.geolocation.getCurrentPosition(

      pos => {

        currentLocation = {

          lat:
            pos.coords.latitude,

          lng:
            pos.coords.longitude

        };


        if (marker) {

          postMap.removeLayer(
            marker
          );

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


        document.getElementById(
          "location-result"
        ).innerText =
          "現在地を取得しました";

      },


      () => {

        alert(
          "位置情報を取得できませんでした"
        );

      }

    );

  };

}


// ==========================
// 投稿処理
// ==========================

const postBtn =
  document.getElementById(
    "post-btn"
  );


if (postBtn) {

  postBtn.onclick =
    async () => {


      // ==========================
      // 同意確認
      // ==========================

      if (
        !document.getElementById(
          "agree"
        ).checked
      ) {

        alert(
          "公開同意が必要です"
        );

        return;

      }


      // ==========================
      // 位置確認
      // ==========================

      if (!currentLocation) {

        alert(
          "場所を指定してください"
        );

        return;

      }


      // ==========================
      // 猫情報確認
      // ==========================

      if (
        selectedCats.length === 0
      ) {

        alert(
          "猫情報を入力してください"
        );

        return;

      }


      const textarea =
        document.querySelector(
          "textarea"
        );


      // ==========================
      // Firebaseへ保存
      // ==========================

      try {

        await db
          .collection("posts")
          .add({

            date:
              document.getElementById(
                "date"
              ).value,

            cats:
              selectedCats,

            comment:
              textarea
                ? textarea.value
                : "",

            location:
              currentLocation,

            createdAt:
              firebase.firestore
                .FieldValue
                .serverTimestamp()

          });


        alert(
          "投稿しました"
        );


        location.reload();

      }
      catch (error) {

        console.error(
          "投稿エラー:",
          error
        );


        alert(
          "投稿に失敗しました。\nもう一度お試しください。"
        );

      }

    };

}