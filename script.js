// Firebase reference
const itemsRef = window.db.ref("items");

let currentEditId = null;

// ================= ADD ITEM =================
function addItem() {
  const name = document.getElementById("name").value.trim();
  const quantity = document.getElementById("quantity").value.trim();
  const qUnit = document.getElementById("qUnit").value.trim();
  const price = document.getElementById("price").value.trim();
  const pUnit = document.getElementById("pUnit").value.trim();

  // VALIDATION (prevents undefined error)
  if (!name || !quantity || !qUnit || !price || !pUnit) {
    alert("⚠️ Please fill all fields properly");
    return;
  }

  const item = {
    name: name,
    quantity: quantity,
    qUnit: qUnit,
    price: price,
    pUnit: pUnit
  };

  console.log("Sending to Firebase:", item);

  itemsRef.push(item)
    .then(() => console.log("✅ Saved to Firebase"))
    .catch(err => console.error("❌ Firebase Error:", err));

  // CLEAR INPUTS
  document.getElementById("name").value = "";
  document.getElementById("quantity").value = "";
  document.getElementById("qUnit").value = "";
  document.getElementById("price").value = "";
  document.getElementById("pUnit").value = "";
}

// ================= DISPLAY (REALTIME) =================
itemsRef.on("value", (snapshot) => {
  const data = snapshot.val();
  const table = document.getElementById("data");

  table.innerHTML = "";

  if (data) {
    for (let id in data) {
      const item = data[id];

      table.innerHTML += `
        <tr>
          <td>${item.name}</td>
          <td>${item.quantity} ${item.qUnit}</td>
          <td>${item.price} ${item.pUnit}</td>
          <td>
            <button onclick="editItem('${id}')">Edit</button>
          </td>
        </tr>
      `;
    }
  }
});

// ================= OPEN EDIT MODAL =================
function editItem(id) {
  currentEditId = id;

  itemsRef.child(id).once("value", (snap) => {
    const item = snap.val();

    document.getElementById("editName").value = item.name;
    document.getElementById("editQty").value = item.quantity;
    document.getElementById("editUnit").value = item.qUnit;
    document.getElementById("editPrice").value = item.price;
    document.getElementById("editPUnit").value = item.pUnit;

    document.getElementById("modal").style.display = "flex";
  });
}

// ================= UPDATE ITEM =================
function updateItem() {
  const name = document.getElementById("editName").value.trim();
  const quantity = document.getElementById("editQty").value.trim();
  const qUnit = document.getElementById("editUnit").value.trim();
  const price = document.getElementById("editPrice").value.trim();
  const pUnit = document.getElementById("editPUnit").value.trim();

  if (!name || !quantity || !qUnit || !price || !pUnit) {
    alert("⚠️ Fill all fields before updating");
    return;
  }

  itemsRef.child(currentEditId).update({
    name,
    quantity,
    qUnit,
    price,
    pUnit
  });

  closeModal();
}

// ================= CLOSE MODAL =================
function closeModal() {
  document.getElementById("modal").style.display = "none";
}

// ================= LOGOUT =================
function logout() {
  localStorage.removeItem("loggedIn");
  window.location.href = "login.html";
}