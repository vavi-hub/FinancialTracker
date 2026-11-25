// DOM ELEMENTS

const dialog = document.getElementById("expenseDialog");
const expenseForm = document.getElementById("expenseForm");
const expenseRows = document.getElementById("expenseRows");

const modalTitle = document.getElementById("expenseModalTitle");
const submitButton = document.getElementById("submitExpenseButton");

// Stores the ID of the expense currently being edited.
// null means we are adding a new expense.
let editingExpenseId = null;

// CATEGORY COLORS

const categoryColors = {
    Food: "#ef8d75",
    Transport: "#4779ed",
    Shopping: "#a987ef",
    Bills: "#f1b45f",
    Health: "#f5d45c",
    Entertainment: "#78b9a5",
    Miscellaneous: "#8a9bb8"
};

// EXPENSE DATA

let expenses = [];

// CREATE EXPENSE CHART

const chart = new Chart(
    document.getElementById("expenseChart"),
    {
        type: "doughnut",

        data: {
            labels: [],
            datasets: [{
                data: [],
                backgroundColor: [],
                borderWidth: 0,
                hoverOffset: 7
            }]
        },

        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: "0%",

            plugins: {
                legend: {
                    display: false
                },

                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return ` ₹${Number(context.raw).toLocaleString("en-IN")}`;
                        }
                    }
                }
            }
        }
    }
);

// FETCH EXPENSES FROM DATABASE

async function loadExpenses() {

    try {

        const response = await fetch("/api/expenses");

        if (!response.ok) {
            throw new Error("Unable to fetch expenses");
        }

        expenses = await response.json();

        renderExpenses();

        updateChart();

    }

    catch (error) {

        console.error("Error loading expenses:", error);

    }

}

// DISPLAY EXPENSES IN TABLE

function renderExpenses() {

    expenseRows.innerHTML = "";

    expenses.forEach((expense, index) => {

        const row = document.createElement("tr");

        // Serial Number
        const serialCell = document.createElement("td");
        serialCell.textContent = index + 1;

        // Date and Time
        const dateCell = document.createElement("td");
        dateCell.textContent = expense.expense_date;

        // Category
        const categoryCell = document.createElement("td");
        categoryCell.textContent = expense.category;

        // Amount
        const amountCell = document.createElement("td");
        amountCell.textContent =
            `₹${Number(expense.amount).toLocaleString("en-IN")}`;

        // Notes
        const notesCell = document.createElement("td");
        notesCell.textContent = expense.notes || "—";

        // Actions
        const actionCell = document.createElement("td");
        actionCell.className = "action-buttons";


        // UPDATE BUTTON

        const updateButton = document.createElement("button");

        updateButton.type = "button";
        updateButton.textContent = "Update";
        updateButton.className = "update-button";

        updateButton.addEventListener("click", () => {
            openEditModal(expense);
        });


        // DELETE BUTTON

        const deleteButton = document.createElement("button");

        deleteButton.type = "button";
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-button";

        deleteButton.addEventListener("click", () => {
            deleteExpense(expense.expense_id);
        });


        actionCell.appendChild(updateButton);
        actionCell.appendChild(deleteButton);

        row.appendChild(serialCell);
        row.appendChild(dateCell);
        row.appendChild(categoryCell);
        row.appendChild(amountCell);
        row.appendChild(notesCell);
        row.appendChild(actionCell);

        expenseRows.appendChild(row);

    });


    // Calculate Total Expenses

    const total = expenses.reduce(
        (sum, expense) => sum + Number(expense.amount),
        0
    );

    document.getElementById("totalSpent").textContent =
        `₹${total.toLocaleString("en-IN")}`;

}

// UPDATE EXPENSE CHART

function updateChart() {

    const totals = {};

    expenses.forEach(expense => {

        const category = expense.category;

        totals[category] =
            (totals[category] || 0) + Number(expense.amount);

    });

    const labels = Object.keys(totals);

    const values = labels.map(category => totals[category]);

    const colors = labels.map(
        category => categoryColors[category] || categoryColors.Miscellaneous
    );

    chart.data.labels = labels;

    chart.data.datasets[0].data = values;

    chart.data.datasets[0].backgroundColor = colors;

    chart.update();

}

// OPEN MODAL FOR ADDING EXPENSE

function openAddModal() {

    editingExpenseId = null;

    expenseForm.reset();

    modalTitle.textContent = "Add an expense";

    submitButton.textContent = "Save expense";

    dialog.showModal();

}

// OPEN MODAL FOR UPDATING EXPENSE

function openEditModal(expense) {

    // Store the ID of the selected expense
    editingExpenseId = expense.expense_id;

    // Fill the form with existing values
    expenseForm.elements["amount"].value = expense.amount;

    expenseForm.elements["category_id"].value = expense.category_id;

    expenseForm.elements["notes"].value = expense.notes || "";

    // Change modal heading and button text
    modalTitle.textContent = "Update expense";

    submitButton.textContent = "Save changes";

    // Open modal
    dialog.showModal();

}

// SAVE EXPENSE (ADD OR UPDATE)

async function saveExpense(data) {

    try {

        let url = "/api/expenses";

        let method = "POST";


        // If editingExpenseId exists, update the expense.
        // Otherwise, create a new expense.

        if (editingExpenseId !== null) {

            url = `/api/expenses/${editingExpenseId}`;

            method = "PUT";

        }


        const response = await fetch(url, {

            method: method,

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(data)

        });


        const result = await response.json();

        if (!response.ok) {

            throw new Error(result.error || "Unable to save expense");

        }


        // Reset form and modal state
        expenseForm.reset();

        editingExpenseId = null;

        dialog.close();


        // Refresh table, total and chart
        await loadExpenses();

    }

    catch (error) {

        console.error("Error saving expense:", error);

        alert(error.message);

    }

}

// DELETE EXPENSE

async function deleteExpense(id) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this expense?"
    );

    if (!confirmDelete) {
        return;
    }

    try {

        const response = await fetch(`/api/expenses/${id}`, {

            method: "DELETE"

        });

        const result = await response.json();

        if (!response.ok) {

            throw new Error(result.error || "Unable to delete expense");

        }

        await loadExpenses();

    }

    catch (error) {

        console.error("Error deleting expense:", error);

        alert(error.message);

    }

}

// MODAL FUNCTIONALITY


// Open Add Expense Modal

document.getElementById("openModal").addEventListener(
    "click",
    openAddModal
);


// Close Modal

document.getElementById("closeModal").addEventListener(
    "click",
    () => {

        dialog.close();

    }
);


// Reset editing state whenever the modal closes.
// This also handles closing with the Escape key.

dialog.addEventListener("close", () => {

    editingExpenseId = null;

    expenseForm.reset();

    modalTitle.textContent = "Add an expense";

    submitButton.textContent = "Save expense";

});

// EXPENSE FORM SUBMISSION

expenseForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const formData = new FormData(this);

    const data = {

        amount: formData.get("amount"),

        category_id: formData.get("category_id"),

        notes: formData.get("notes")

    };


    saveExpense(data);

});

// FINANCIAL TIPS

let tip_no = 0;

const tips = [

    "Small savings today can make a big difference tomorrow.",

    "Before buying something, ask yourself: Do I need it or just want it?",

    "Try setting a simple spending limit for each day.",

    "Review your expenses at the end of the week to spot patterns."

];


document.getElementById("newTip").addEventListener(
    "click",
    function() {

        tip_no = (tip_no + 1) % tips.length;

        document.getElementById("tipText").textContent =
            tips[tip_no];

    }
);

//  LEARN MORE BUTTON

document.getElementById("learnMore").addEventListener(
    "click",
    function() {

        document.querySelector(".expenses-section")
            .scrollIntoView({
                behavior: "smooth"
            });

    }
);

// INITIALIZE APPLICATION

loadExpenses();
