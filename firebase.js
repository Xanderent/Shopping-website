const firebaseConfig = {
    apiKey: "AIzaSyBshRevRE2C_ezz52yd-f7zR6t-JWh6rmE",
    authDomain: "flutter-project-shopping.firebaseapp.com",
    databaseURL: "https://flutter-project-shopping-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "flutter-project-shopping",
    storageBucket: "flutter-project-shopping.appspot.com",
    messagingSenderId: "404982533386",
    appId: "1:404982533386:web:92cd79e42ec2b00aeb3ef3",
    measurementId: "G-60TK8H53LY"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);


// Initialize Cloud Firestore and get a reference to the service
const db = firebase.firestore();

// log all data firestore
db.collectionGroup("items").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
        // console.log("doc", doc);
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
    });
});

const dataListElement = document.getElementById("data-list");

db.collectionGroup("items").get().then((querySnapshot) => {
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
                docRef.update({ status: selectedStatus })
                    .then(() => {
                        alert(`อัพเดดทสถานะเป็น "${event.target.value}" เรียบร้อย`)
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
            PrintDiv(userEmail, name, price)
        });
        printCell.appendChild(printButton);
        row.appendChild(printCell);

        dataListElement.appendChild(row);
    });
}).catch((error) => {
    console.log("Error getting documents:", error);
});


function searchUsers() {
    var searchQuery = document.getElementById("searchInput").value;

    db.collectionGroup("items").get().then((querySnapshot) => {
        // Clear previous search results
        dataListElement.innerHTML = "";

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const name = data.name;
            const userEmail = data.user_email;
            const price = data.price;
            const status = data.status;

            if (userEmail && userEmail.includes(searchQuery) || name && name.includes(searchQuery) || status && status.includes(searchQuery)) { // Add null check here
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
                    PrintDiv(userEmail, name, price)
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
                <h2 style="text-align: center;">ใบเสร็จรับเงิน</h2>
                <p>Name: ${userEmail}</p>
                <table class="tbl">
                    <tr>
                        <th>รายการ</th>
                        <th>ราคา</th>
                    </tr>
                    <tr>
                        <td>${name}</td>
                        <td>${price}</td>
                    </tr>
                    <tr class="tr-list">
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>รวมเป็นเงินทั้งหมด</td>
                        <td>${price}</td>
                    </tr>
                </table>
            </div>
        </body>
    </html>`;

    var popupWin = window.open();
    popupWin.document.open();
    popupWin.document.write(html);
    popupWin.document.close();
}
