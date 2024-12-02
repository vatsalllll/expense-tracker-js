const form = document.getElementById("expense-form");
const tableBody = document.querySelector("#expense-table tbody");
const categoryTotals = document.getElementById("category-totals");
const ctx = document.getElementById("expense-chart").getContext("2d");

let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

function updateChart() {
  const totals = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});

  const chartData = {
    labels: Object.keys(totals),
    datasets: [
      {
        data: Object.values(totals),
        backgroundColor: [
          "#007bff",
          "#ffc107",
          "#28a745",
          "#dc3545",
          "#6c757d",
        ],
      },
    ],
  };

  if (window.myChart) {
    window.myChart.destroy();
  }

  window.myChart = new Chart(ctx, {
    type: "pie",
    data: chartData,
  });
}

//update expense table
function updateTable() {
  tableBody.innerHTML = "";
  expenses.forEach((expense, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${expense.description}</td>
      <td>${expense.amount}</td>
      <td>${expense.category}</td>
      <td>
        <button class="edit-btn" data-index="${index}">Edit</button>
        <button class="delete-btn" data-index="${index}">Delete</button>
      </td>
    `;
    tableBody.appendChild(row);
  });

  const deleteButtons = document.querySelectorAll(".delete-btn");
  deleteButtons.forEach((button) =>
    button.addEventListener("click", deleteExpense)
  );

  const editButtons = document.querySelectorAll(".edit-btn");
  editButtons.forEach((button) =>
    button.addEventListener("click", editExpense)
  );
}

function updateTotals() {
  const totals = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});

  categoryTotals.innerHTML = "";
  Object.entries(totals).forEach(([category, total]) => {
    const li = document.createElement("li");
    li.textContent = `${category}: ₹${total.toFixed(2)}`;
    categoryTotals.appendChild(li);
  });
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const description = document.getElementById("description").value;
  const amount = parseFloat(document.getElementById("amount").value);
  const category = document.getElementById("category").value;

  expenses.push({ description, amount, category });
  localStorage.setItem("expenses", JSON.stringify(expenses));

  form.reset();
  updateTable();
  updateTotals();
  updateChart();
});

function deleteExpense(e) {
  const index = e.target.dataset.index;
  expenses.splice(index, 1);
  localStorage.setItem("expenses", JSON.stringify(expenses));

  updateTable();
  updateTotals();
  updateChart();
}

function editExpense(e) {
  const index = e.target.dataset.index;
  const expense = expenses[index];

  document.getElementById("description").value = expense.description;
  document.getElementById("amount").value = expense.amount;
  document.getElementById("category").value = expense.category;

  deleteExpense(e);
}

updateTable();
updateTotals();
updateChart();
