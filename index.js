// Expense tracker

/* Expense class */ 
class Expense {
  constructor(name, date, amount) {
    this.name = name;
    this.date = date;
    this.amount = amount;
  }
}

/* DOM Elements */
const form = document.getElementById("expense-input");
const table = document.getElementById("expense-list");
const clearBtn = document.querySelector('.clear-btn');

/* Variables */
let myExpenses = [];
const expensesfromStorage = JSON.parse( localStorage.getItem('expenseData') );

/* Survive refresh event */
if (expensesfromStorage) {
  // render expenses
  myExpenses = expensesfromStorage;
  renderExpenses(myExpenses);
} else {
  table.innerHTML = `<tr id="initial-table-msg"><td colspan="4">No expenses yet!</td></tr>`;
}

/* Event listeners */
form.addEventListener('submit', addExpense, false);
table.addEventListener('click', deleteExpense, false);
clearBtn.addEventListener('click', clearList, false);

/* functions */
// Add expense function
function addExpense(e) {
  e.preventDefault();

  // grab input values from form and store in array and localStorage
  const name = document.getElementById('expense-name').value; 
  const date = document.getElementById('expense-date').value;
  const amount = parseFloat(document.getElementById('expense-amt').value).toFixed(2);

  if (!validateForm(name, date, amount)) {
    return;
  }
  
  // store in object array and localStorage
  const newExpense = new Expense(name, date, amount);
  myExpenses.push(newExpense);
  localStorage.setItem("expenseData", JSON.stringify(myExpenses));

  // Empty input box
  form.reset();

  // Render new expense
  renderExpenses(myExpenses);
}

function renderExpenses(expenses) {
  // Show "no expenses" message when array is empty
  if (expenses.length === 0) {
    table.innerHTML = `<tr id="initial-table-msg"><td colspan="4">No expenses yet!</td></tr>`;
  } else {
    // Sort array
    let sortedExpenses = expenses.sort( (a, b) => new Date(b.date) - new Date(a.date));
    
    // concatenate each expense item html
    let expenseItems = "";
    sortedExpenses.forEach( expense => {
      expenseItems += 
        `<tr class="expense-row">
            <td>${expense.name}</td>
            <td>${expense.date}</td>
            <td>$ ${expense.amount}</td>
            <td><button type="button" class="delete-btn">X</button></td>
        </tr>`;
    });
    
    // render items
    table.innerHTML = expenseItems;
  }    
}

// delete expense function
function deleteExpense(e) {
  // make sure delete button is only thing that fires off event
  if (e.target.classList.contains('delete-btn')) {
    // grab expense name from event and find index in array
    const expenseName = e.target.parentNode.parentNode.firstElementChild.textContent;
    const expenseIdx = myExpenses.findIndex(expense => expense.name === expenseName);

    // remove expense from array and from localstorage
    myExpenses.splice(expenseIdx, 1);
    localStorage.setItem("expenseData", JSON.stringify(myExpenses));

    // render updated array
    renderExpenses(myExpenses);
  }
}

// clear list function
function clearList() {
  myExpenses = [];
  localStorage.clear();
  renderExpenses(myExpenses);
}

// form validation
function validateForm(name, date, amount) {
  if (name === '' || date === '' || isNaN(amount)) {
    // Create error message
    const errorMessage = document.createElement('div');
    errorMessage.className = 'error';
    errorMessage.appendChild(document.createTextNode('Please fill out all fields.'));
    form.insertBefore(errorMessage, form.firstChild);
    setTimeout( () => errorMessage.remove(), 5000);
    return false;
  } else {
    return true;
  }
}
