const form = document.getElementById("expense-form");
const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const categoryInput = document.getElementById("category");
const dateInput = document.getElementById("date");
const list = document.getElementById("expense-list");
const totalElement = document.getElementById("total");
const countElement = document.getElementById("count");
const emptyMessage = document.getElementById("empty-message");
const clearButton = document.getElementById("clear-button");

let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

dateInput.value = new Date().toISOString().slice(0, 10);

function saveExpenses() {
  localStorage.setItem("expenses", JSON.stringify(expenses));
}

function formatMoney(value) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

function formatDate(date) {
  return new Date(date + "T00:00:00").toLocaleDateString("pt-BR");
}

function renderExpenses() {
  list.innerHTML = "";
  let total = 0;

  expenses.forEach((expense) => {
    total += expense.amount;

    const item = document.createElement("li");
    item.className = "expense";

    const info = document.createElement("div");
    info.className = "expense-info";

    const title = document.createElement("strong");
    title.textContent = expense.description;

    const details = document.createElement("small");
    details.textContent = `${expense.category} • ${formatDate(expense.date)}`;

    info.append(title, details);

    const right = document.createElement("div");
    right.className = "expense-right";

    const value = document.createElement("strong");
    value.textContent = formatMoney(expense.amount);

    const removeButton = document.createElement("button");
    removeButton.className = "delete";
    removeButton.textContent = "Excluir";
    removeButton.type = "button";
    removeButton.addEventListener("click", () => {
      expenses = expenses.filter((entry) => entry.id !== expense.id);
      saveExpenses();
      renderExpenses();
    });

    right.append(value, removeButton);
    item.append(info, right);
    list.appendChild(item);
  });

  totalElement.textContent = formatMoney(total);
  countElement.textContent = expenses.length;
  emptyMessage.hidden = expenses.length > 0;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const description = descriptionInput.value.trim();
  const amount = Number(amountInput.value);

  if (!description || !Number.isFinite(amount) || amount <= 0 || !dateInput.value) {
    alert("Preencha os campos corretamente.");
    return;
  }

  expenses.push({
    id: Date.now(),
    description,
    amount,
    category: categoryInput.value,
    date: dateInput.value
  });

  saveExpenses();
  renderExpenses();
  form.reset();
  dateInput.value = new Date().toISOString().slice(0, 10);
  descriptionInput.focus();
});

clearButton.addEventListener("click", () => {
  if (expenses.length === 0) return;

  if (confirm("Tem certeza de que deseja excluir todas as despesas?")) {
    expenses = [];
    saveExpenses();
    renderExpenses();
  }
});

renderExpenses();
