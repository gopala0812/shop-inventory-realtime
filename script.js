const itemsRef = window.db.ref("items");

let currentEditId = null;

// ADD
function addItem() {
  const item = {
    name: name.value,
    quantity: quantity.value,
    qUnit: qUnit.value,
    price: price.value,
    pUnit: pUnit.value
  };

  itemsRef.push(item);
}

// DISPLAY
itemsRef.on("value", snap => {
  const data = snap.val();
  const table = document.getElementById("data");
  table.innerHTML = "";

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
});

// EDIT OPEN
function editItem(id) {
  currentEditId = id;

  itemsRef.child(id).once("value", snap => {
    const item = snap.val();

    editName.value = item.name;
    editQty.value = item.quantity;
    editUnit.value = item.qUnit;
    editPrice.value = item.price;
    editPUnit.value = item.pUnit;

    modal.style.display = "flex";
  });
}

// UPDATE
function updateItem() {
  itemsRef.child(currentEditId).update({
    name: editName.value,
    quantity: editQty.value,
    qUnit: editUnit.value,
    price: editPrice.value,
    pUnit: editPUnit.value
  });

  closeModal();
}

// CLOSE MODAL
function closeModal() {
  modal.style.display = "none";
}

// LOGOUT
function logout() {
  localStorage.removeItem("loggedIn");
  window.location.href = "login.html";
}