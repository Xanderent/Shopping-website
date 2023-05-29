const firebaseConfig = {
  apiKey: "AIzaSyBshRevRE2C_ezz52yd-f7zR6t-JWh6rmE",
  authDomain: "flutter-project-shopping.firebaseapp.com",
  databaseURL:
    "https://flutter-project-shopping-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "flutter-project-shopping",
  storageBucket: "flutter-project-shopping.appspot.com",
  messagingSenderId: "404982533386",
  appId: "1:404982533386:web:92cd79e42ec2b00aeb3ef3",
  measurementId: "G-60TK8H53LY",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = firebase.firestore();

// log all data firestore
db.collectionGroup("items")
  .get()
  .then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      // console.log("doc", doc);
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
    });
  });

const dataListElement = document.getElementById("data-list");

db.collectionGroup("items")
  .get()
  .then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const name = data.name;
      const userEmail = data.user_email;
      const price = data.price;
      const status = data.status;

      console.log("status", status);

      const row = document.createElement("tr");

      const userEmailCell = document.createElement("td");
      userEmailCell.textContent = userEmail;
      row.appendChild(userEmailCell);

      const nameCell = document.createElement("td");
      nameCell.textContent = name;
      row.appendChild(nameCell);

      const priceCell = document.createElement("td");
      priceCell.textContent = new Intl.NumberFormat().format(price); // Format price with commas
      row.appendChild(priceCell);

      const statusCell = document.createElement("td");
      const selectElement = document.createElement("select");
      selectElement.name = "format";
      selectElement.id = "format";

      const statusOptions = [
        { value: "เสร็จสิ้น", label: "เสร็จสิ้น" },
        { value: "กำลังดำเนินการ", label: "กำลังดำเนินการ" },
        { value: "รอดำเนินการ", label: "รอดำเนินการ" },
        { value: "ยกเลิกรายการ", label: "ยกเลิกรายการ" },
      ];

      statusOptions.forEach((option) => {
        const optionElement = document.createElement("option");
        optionElement.value = option.value;
        optionElement.textContent = option.label;

        // Compare option value with retrieved status value and set 'selected' attribute
        if (option.value === status) {
          optionElement.selected = true;
        }

        selectElement.appendChild(optionElement);
      });

      // Add change event listener to select element
      selectElement.addEventListener("change", (event) => {
        const selectedStatus = event.target.value;
        const docRef = doc.ref; // Get the document reference

        // Display a confirmation alert
        const confirmation = window.confirm("คุณต้องการเปลี่ยนสถานะหรือไม่?");

        if (confirmation) {
          // Update the status field in Firestore
          docRef
            .update({ status: selectedStatus })
            .then(() => {
              alert(`อัพเดดทสถานะเป็น "${event.target.value}" เรียบร้อย`);
              console.log("Status updated successfully");
            })
            .catch((error) => {
              console.error("Error updating status:", error);
            });
        } else {
          // Revert the select element value if the confirmation is canceled
          selectElement.value = doc.data().status;
        }
      });

      statusCell.appendChild(selectElement);
      row.appendChild(statusCell);

      //btn print
      const printCell = document.createElement("td");
      const printButton = document.createElement("button");
      printButton.textContent = "Print";
      printButton.addEventListener("click", () => {
        const userEmail = doc.data().user_email;
        const name = doc.data().name;
        const price = doc.data().price;
        PrintDiv(userEmail, name, price);
      });
      printCell.appendChild(printButton);
      row.appendChild(printCell);

      dataListElement.appendChild(row);
    });
  })
  .catch((error) => {
    console.log("Error getting documents:", error);
  });

function searchUsers() {
  var searchQuery = document.getElementById("searchInput").value;

  db.collectionGroup("items")
    .get()
    .then((querySnapshot) => {
      // Clear previous search results
      dataListElement.innerHTML = "";

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const name = data.name;
        const userEmail = data.user_email;
        const price = data.price;
        const status = data.status;

        if (
          (userEmail && userEmail.includes(searchQuery)) ||
          (name && name.includes(searchQuery)) ||
          (status && status.includes(searchQuery))
        ) {
          // Add null check here
          const row = document.createElement("tr");

          const userEmailCell = document.createElement("td");
          userEmailCell.textContent = userEmail;
          row.appendChild(userEmailCell);

          const nameCell = document.createElement("td");
          nameCell.textContent = name;
          row.appendChild(nameCell);

          const priceCell = document.createElement("td");
          priceCell.textContent = new Intl.NumberFormat().format(price); // Format price with commas
          row.appendChild(priceCell);

          const statusCell = document.createElement("td");
          const selectElement = document.createElement("select");
          selectElement.name = "format";
          selectElement.id = "format";

          const statusOptions = [
            { value: "เสร็จสิ้น", label: "เสร็จสิ้น" },
            { value: "กำลังดำเนินการ", label: "กำลังดำเนินการ" },
            { value: "รอดำเนินการ", label: "รอดำเนินการ" },
            { value: "ยกเลิกรายการ", label: "ยกเลิกรายการ" },
          ];

          statusOptions.forEach((option) => {
            const optionElement = document.createElement("option");
            optionElement.value = option.value;
            optionElement.textContent = option.label;

            // Compare option value with retrieved status value and set 'selected' attribute
            if (option.value === status) {
              optionElement.selected = true;
            }

            selectElement.appendChild(optionElement);
          });

          statusCell.appendChild(selectElement);
          row.appendChild(statusCell);

          //btn print
          const printCell = document.createElement("td");
          const printButton = document.createElement("button");
          printButton.textContent = "Print";
          printButton.addEventListener("click", () => {
            const userEmail = doc.data().user_email;
            const name = doc.data().name;
            const price = doc.data().price;
            PrintDiv(userEmail, name, price);
          });
          printCell.appendChild(printButton);
          row.appendChild(printCell);

          dataListElement.appendChild(row);
        }
      });
    })
    .catch((error) => {
      console.error("เกิดข้อผิดพลาดในการค้นหา: ", error);
    });
}

function PrintDiv(userEmail, name, price) {
  var html = `<html>
        <head>
            <link rel="stylesheet" href="firebase.css">
        </head>
        <body onload="window.print(); window.close();">
        <div id="container" class="receipt">
        <div style="text-align: center">
          <ul
            style="
              list-style-type: none;
              margin: 0;
              padding: 0;
              display: flex;
              justify-content: space-between;
            "
          >
            <li style="display: inline-block">
              <img
                src="https://cdn3.iconfinder.com/data/icons/eldorado-stroke-furniture/40/armchair-512.png"
                alt="logo"
                style="width: 100px; height: 100px; object-fit: cover"
              />
            </li>
            <li style="display: inline-block"><h2>ใบเสร็จรับเงิน</h2></li>
            <li style="display: inline-block">
              <p id="randomNumber"></p>
              <p id="currentDate"></p>
            </li>
          </ul>
        </div>
  
        <p>ชื่อ :</p>
        <p>ที่อยู่ :</p>
        <p>เบอร์โทรศัพท์ :</p>
        <p>อีเมล : ${userEmail}</p>
        <table class="tbl">
          <tr>
            <th style="text-align: center">รายการ</th>
            <th style="text-align: center">ราคา</th>
          </tr>
          <tr>
            <td>${name}</td>
            <td>${Intl.NumberFormat().format(price)}</td>
          </tr>
          <tr class="tr-list">
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>รวมเป็นเงินทั้งหมด</td>
            <td>${Intl.NumberFormat().format(price)}</td>
          </tr>
        </table>
  
        <div style="text-align: center">
          <ul
            style="
              list-style-type: none;
              margin: 0;
              padding: 0;
              display: flex;
              justify-content: space-around;
            "
          >
            <li style="display: inline-block">
              <p>.......................................</p>
              <p>(&nbsp;&nbsp;&nbsp;วีรภัทร ดุษดี&nbsp;&nbsp;&nbsp;)</p>
              <p>ผู้รับเงิน</p>
            </li>
            <li style="display: inline-block">
              <p>.......................................</p>
              <p>
                (&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;)
              </p>
              <p>ผู้รับสินค้า</p>
            </li>
          </ul>
        </div>
      </div>
      <script>
        // Generate a random number of 10 digits ranging from 0 to 9
        var randomNumber = "";
        for (var i = 0; i < 10; i++) {
          randomNumber += Math.floor(Math.random() * 10);
        }
        document.getElementById("randomNumber").textContent =
          "เลขที่ " + randomNumber;
  
        // Get and format the current date
        var currentDate = new Date();
        var day = currentDate.getDate();
        var month = currentDate.getMonth() + 1;
        var year = currentDate.getFullYear();
        var formattedDate = day + "/" + month + "/" + year;
        document.getElementById("currentDate").textContent =
          "วันที่ " + formattedDate;
      </script>
        </body>
    </html>`;

  var popupWin = window.open();
  popupWin.document.open();
  popupWin.document.write(html);
  popupWin.document.close();
}
