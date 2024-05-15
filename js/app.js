let add = document.querySelector(".add");
let tbody = document.querySelector(".tbody");

let api = "http://127.0.0.1:5000/products";

fetch(api)
  .then((response) => response.json())
  .then((data) => {
    console.log(typeof data);
    console.log(data);
    renderData(data);
  });

const renderData = (data = []) => {
  console.log(data.length);
  if (data.length === 0) {
    tbody.innerHTML = `<span class="loader"></span>`;
  } else {
    tbody.innerHTML = "";
    data.forEach((item) => {
      let tr = document.createElement("tr");
      tr.classList = "text-center";
      tr.innerHTML = `
        <td>${item.id}</td>
        <td>${item.barcode}</td>
        <td>${item.name}</td>
        <td>${item.number}</td>
        <td>${item.price}</td>
        <td>
          <button class="btn btn-warning update" data-barcode="${item.barcode}">Update</button>
          <button class="btn btn-danger delete" data-barcode="${item.barcode}">Delete</button>
        </td>
      `;
      tbody.appendChild(tr);
    });

    document
      .querySelectorAll(".update")
      .forEach((button) => button.addEventListener("click", handleUpdate));
    document
      .querySelectorAll(".delete")
      .forEach((button) => button.addEventListener("click", handleDelete));
  }
};

// POST Create New Item
async function createItem(formData) {
  try {
    const response = await fetch(api, {
      method: "POST",
      body: formData,
      redirect: "follow",
    });
    console.log(formData);
    const data = await response.text();
    console.log(data);
    return data;
  } catch (error) {
    console.log("Error creating item:", error);
  }
}

add.addEventListener("click", async () => {
  console.log("first");
  const barcode = document.querySelector(".barcode").value.trim().toLowerCase();
  const namePro = document.querySelector(".name").value.trim().toLowerCase();
  const price = document.querySelector(".price").value.trim().toLowerCase();
  const number = document.querySelector(".number").value.trim().toLowerCase();
  if (!barcode || !namePro || !price || !number) {
    alert("All fields are required.");
    return;
  }
  const formData = new FormData();
  formData.append("barcode", barcode);
  formData.append("name", namePro);
  formData.append("price", price);
  formData.append("number", number);

  const createdItem = await createItem(formData);
  console.log("Created Item:", createdItem);
});

// PUT Update Item
async function updateItem(barcode, formData) {
  try {
    const response = await fetch(`${api}/${barcode}`, {
      method: "PUT",
      body: formData,
      redirect: "follow",
    });
    const data = await response.text();
    console.log(data);
    return data;
  } catch (error) {
    console.log("Error updating item:", error);
  }
}

function handleUpdate(event) {
  const barcode = event.target.dataset.barcode;
  const newBar=prompt("Enter new barcode")
  const namePro = prompt("Enter new name:");
  const price = prompt("Enter new price:");
  const number = prompt("Enter new number:");

  if (!newBar |!namePro || !price || !number) {
    alert("All fields are required.");
    return;
  }

  const formData = new FormData();
formData.append("barcode",newBar)
  formData.append("name", namePro);
  formData.append("price", price);
  formData.append("number", number);

  updateItem(barcode, formData).then((updatedItem) => {
    console.log("Updated Item:", updatedItem);
    // Refresh the data
    fetch(api)
      .then((response) => response.json())
      .then((data) => {
        renderData(data);
      });
  });
}

// DELETE Item
async function deleteItem(barcode) {
  try {
    const response = await fetch(`${api}/${barcode}`, {
      method: "DELETE",
      redirect: "follow",
    });
    const data = await response.text();
    console.log(data);
    return data;
  } catch (error) {
    console.log("Error deleting item:", error);
  }
}

function handleDelete(event) {
  const barcode = event.target.dataset.barcode;

  if (confirm("Are you sure you want to delete this item?")) {
    deleteItem(barcode).then((deletedItem) => {
      console.log("Deleted Item:", deletedItem);
      // Refresh the data
      fetch(api)
        .then((response) => response.json())
        .then((data) => {
          renderData(data);
        });
    });
  }
}
