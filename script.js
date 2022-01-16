"use strict";
// Data
const account1 = {
    owner: "Jonas Schmedtmann",
    movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
    interestRate: 1.2, // %
    pin: 1111,

    movementsDates: [
        "2020-11-18T21:31:17.178Z",
        "2020-12-23T07:42:02.383Z",
        "2021-01-28T09:15:04.904Z",
        "2021-04-01T10:17:24.185Z",
        "2021-05-08T14:11:59.604Z",
        "2021-05-27T17:01:17.194Z",
        "2022-01-10T23:36:17.929Z",
        "2022-01-14T10:51:36.790Z",
    ],
    currency: "EUR",
    locale: "pt-PT", // de-DE
};
const account2 = {
    owner: "Jessica Davis",
    movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
    interestRate: 1.5,
    pin: 2222,

    movementsDates: [
        "2020-11-01T13:15:33.035Z",
        "2020-11-30T09:48:16.867Z",
        "2020-12-25T06:04:23.907Z",
        "2021-01-25T14:18:46.235Z",
        "2021-02-05T16:33:06.386Z",
        "2021-04-10T14:43:26.374Z",
        "2021-06-25T18:49:59.371Z",
        "2021-07-26T12:01:20.894Z",
    ],
    currency: "USD",
    locale: "en-US",
};
const account3 = {
    owner: "Steven Thomas",
    movements: [200, -200, 340, -300, -20, 50, 400, -460],
    interestRate: 0.7,
    pin: 3333,

    movementsDates: [
        "2020-11-18T21:31:17.178Z",
        "2020-12-23T07:42:02.383Z",
        "2021-01-28T09:15:04.904Z",
        "2021-04-01T10:17:24.185Z",
        "2021-05-08T14:11:59.604Z",
        "2021-05-27T17:01:17.194Z",
        "2022-01-10T23:36:17.929Z",
        "2022-01-14T10:51:36.790Z",
    ],
    currency: "EUR",
    locale: "en-UK",
};
const account4 = {
    owner: "Sarah Andrew",
    movements: [430, 1000, 700, 50, 90],
    interestRate: 1,
    pin: 4444,

    movementsDates: [
        "2020-11-01T13:15:33.035Z",
        "2020-11-30T09:48:16.867Z",
        "2020-12-25T06:04:23.907Z",
        "2021-01-25T14:18:46.235Z",
        "2021-02-05T16:33:06.386Z",
        "2021-04-10T14:43:26.374Z",
        "2021-06-25T18:49:59.371Z",
        "2021-07-26T12:01:20.894Z",
    ],
    currency: "EGP",
    locale: "en-us",
};
const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");
// generate username for each account
function generateUsername(accounts) {
    accounts.forEach((account) => {
        account.username = account.owner
            .toLowerCase()
            .split(" ")
            .map((word) => word[0])
            .join("");
    });
}
generateUsername(accounts);
// date handler
function calcDate(dateM, locale) {
    const calcDays = (date1, date2) =>
        Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
    let daysPassed = calcDays(new Date(), dateM);
    if (daysPassed === 0) {
        return `Today`;
    }
    if (daysPassed === 1) {
        return `Yesterday`;
    }
    if (daysPassed <= 7) {
        return `${daysPassed} Days ago`;
    }
    return new Intl.DateTimeFormat(locale).format(dateM);
}
// logout timer
function startTimer() {
    let time = 600;
    function tick() {
        let minutes = `${Math.trunc(time / 60)}`.padStart(2, 0);
        let seconds = `${time % 60}`.padStart(2, 0);
        labelTimer.textContent = `${minutes}:${seconds}`;
        if (time === 0) {
            clearInterval(timer);
            location.reload();
        }
        time--;
    }
    tick();
    let timer = setInterval(tick, 1000);
    return timer;
}
// currency formater
function formatCurrency(value, locale, curr) {
    return new Intl.NumberFormat(locale, {
        style: "currency",
        currency: curr,
    }).format(value);
}
// display movements from data
function displayMovements(acc, sort = false) {
    let sortedMovements;
    sort
        ? (sortedMovements = acc.movements.slice().sort((a, b) => a - b))
        : (sortedMovements = acc.movements);
    containerMovements.innerHTML = "";
    sortedMovements.forEach((movement, i) => {
        const type = movement < 0 ? `withdrawal` : `deposit`;
        const date = new Date(acc.movementsDates[i]);
        const displayDate = calcDate(date, acc.locale);
        const formattedMov = formatCurrency(
            Math.abs(movement),
            acc.locale,
            acc.currency
        );
        const htmlContent = `
        <div class="movements__row">
            <div class="movements__type movements__type--${type}">${
            i + 1
        } ${type}</div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formattedMov}</div>
        </div>
        `;
        containerMovements.insertAdjacentHTML("afterbegin", htmlContent);
    });
}
// calc and display balance
function calcAndDisplayBalance(account) {
    account.balance = account.movements.reduce((mov, cur) => mov + cur, 0);
    labelBalance.textContent = `${formatCurrency(
        account.balance,
        account.locale,
        account.currency
    )}`;
}
// get deposits & withdrawals for each account
function depositOrWithdrawal(accounts) {
    accounts.forEach((account) => {
        account.deposits = account.movements.filter((mov) => mov > 0);
        account.withdrawals = account.movements.filter((mov) => mov < 0);
    });
}
depositOrWithdrawal(accounts);
// display summary
// 1 --> display total deposits
// 2 --> display total withdrawals
/* 3 --> calc and display interest = 1.2% for each deposit 
& the interest should be more than 1 euro */
function displaySumary(account) {
    const totalDeposits = account.deposits.reduce((acc, cur) => acc + cur, 0);
    const totalWithdrawals = account.withdrawals.reduce(
        (acc, cur) => acc + Math.abs(cur),
        0
    );
    const totalInterest = account.deposits
        .map((deposit) => deposit * (account.interestRate / 100))
        .filter((interest) => interest >= 1)
        .reduce((acc, interest) => acc + interest, 0);
    labelSumIn.textContent = `${formatCurrency(
        totalDeposits,
        account.locale,
        account.currency
    )}`;
    labelSumOut.textContent = `${formatCurrency(
        totalWithdrawals,
        account.locale,
        account.currency
    )}`;
    labelSumInterest.textContent = `${formatCurrency(
        totalInterest,
        account.locale,
        account.currency
    )}`;
}
function updateUI(currentAccount) {
    // show movements
    displayMovements(currentAccount);
    // show balance
    calcAndDisplayBalance(currentAccount);
    depositOrWithdrawal(accounts);
    // show summary
    displaySumary(currentAccount);
}
// onclick -> login
let currentAccount, timer;
btnLogin.addEventListener("click", (e) => {
    // prevent the default behavoir
    e.preventDefault();
    // find the current account
    currentAccount = accounts.find(
        (acc) => acc.username === inputLoginUsername.value
    );
    // check account user name && pin
    if (currentAccount?.pin === parseInt(inputLoginPin.value)) {
        // set inputs value to empty
        inputLoginUsername.value = inputLoginPin.value = "";
        inputLoginPin.blur();
        // set logout timer
        if (timer) clearInterval(timer);
        timer = startTimer();
        // change opacity
        containerApp.style.opacity = "1";
        // show welcome message "welcome back, first name"
        labelWelcome.textContent = `Welcome back, ${
            currentAccount.owner.split(" ")[0]
        }`;
        updateUI(currentAccount);
        // show current date
        const now = new Date();
        const options = {
            hour: "numeric",
            minute: "numeric",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        };
        labelDate.textContent = new Intl.DateTimeFormat(
            currentAccount.locale,
            options
        ).format(now);
    }
});
// transfering handler
btnTransfer.addEventListener("click", (e) => {
    e.preventDefault();
    // reset logout timer
    clearInterval(timer);
    timer = startTimer();
    const amount = parseInt(inputTransferAmount.value);
    const recieverAccount = accounts.find(
        (account) => account.username === inputTransferTo.value
    );
    inputTransferTo.value = inputTransferAmount.value = "";
    inputTransferAmount.blur();
    if (
        amount > 0 &&
        recieverAccount &&
        currentAccount.balance >= amount &&
        recieverAccount.username !== currentAccount.username
    ) {
        currentAccount.movements.push(-amount);
        currentAccount.withdrawals.push(amount);
        recieverAccount.movements.push(amount);
        recieverAccount.deposits.push(amount);
        currentAccount.movementsDates.push(new Date().toISOString());
        recieverAccount.movementsDates.push(new Date().toISOString());
        updateUI(currentAccount);
    }
});
// close account handler
btnClose.addEventListener("click", (e) => {
    e.preventDefault();
    if (
        inputCloseUsername.value === currentAccount.username &&
        parseInt(inputClosePin.value) === currentAccount.pin
    ) {
        const accountToClose = accounts.findIndex(
            (acc) => acc.username === currentAccount.username
        );
        // delete account
        accounts.splice(accountToClose, 1);
        // hide UI
        containerApp.style.opacity = "0";
        // change the welcome message
        labelWelcome.textContent = "Log in to get started";
    }
    // empty the input fields
    inputCloseUsername.value = "";
    inputClosePin.value = "";
    inputClosePin.blur();
});
// loan handler
btnLoan.addEventListener("click", (e) => {
    e.preventDefault();
    // reset logout timer
    clearInterval(timer);
    timer = startTimer();
    const getLoan = currentAccount.movements.some(
        (mov) => mov >= parseFloat(inputLoanAmount.value) / 10
    );
    if (getLoan) {
        currentAccount.movementsDates.push(new Date().toISOString());
        currentAccount.movements.push(parseFloat(inputLoanAmount.value));
        setTimeout(() => {
            updateUI(currentAccount);
        }, 3000);
    }
    inputLoanAmount.value = "";
    inputLoanAmount.blur();
});
// sort handler
let sortStauts = false;
btnSort.addEventListener("click", (e) => {
    e.preventDefault();
    displayMovements(currentAccount, !sortStauts);
    sortStauts = !sortStauts;
});
