'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Kapish Sharma',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2021-11-20T17:01:17.194Z',
    '2021-11-29T23:36:17.929Z',
    '2021-11-30T10:51:36.790Z',
  ],
  currency: 'INR',
  locale: 'hi-IN',
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};
const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [2000, -200, 3540, -300, -20, 650, 4050, -460],
  interestRate: 0.7,
  pin: 3333,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],

  currency: 'EUR',
  locale: 'en-US',
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [4330, 1000, 1700, 5000, 900],
  interestRate: 1,
  pin: 4444,

  movementsDates: [
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2021-11-29T23:36:17.929Z',
    '2021-11-30T10:51:36.790Z',
  ],
  currency: 'GBP',
  locale: 'en-GB',
};

const accounts = [account1, account2, account3, account4];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// Functions

const formatMovementDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date1 - date2) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);
  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed < 7) return `${daysPassed} Days ago`;
  else {
    return new Intl.DateTimeFormat(locale).format(date)
  }
};

const formatCur = (value, locale, currency) => new Intl.NumberFormat(locale, {
  style: 'currency',
  currency: currency,
}).format(value)

// displays depoits and withdrwals
const displayMovments = function (acc, sort) {
  containerMovements.innerHTML = ''
  const movs = sort ? acc.movements.slice().sort((a, b) => a - b) : acc.movements

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date, acc.locale);
    const formattedMov = formatCur(mov, acc.locale, acc.currency);
    const html = `
    <div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__date">${displayDate}</div>
    <div class="movements__value">${formattedMov}</div>
    </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html)
  })
}

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements.filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency);

  const out = acc.movements.filter(mov => mov < 0).reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatCur(out, acc.locale, acc.currency);

  const interest = acc.movements.filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate / 100))
    .filter(int => int > 1)
    .reduce((acc, int) => acc + int, 0);
  // labelSumInterest.textContent = `${interest.toFixed(2)}₹`;
  labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency);
}

const calcDisplayBalance = acc => {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0)
  labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency);
};

// creating username
const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner.toLowerCase().split(' ').map(name => name[0]).join('')
  })
};
createUsernames(accounts);


const updateUI = (acc) => {
  // display balance
  calcDisplayBalance(acc)
  // display summery
  calcDisplaySummary(acc)
  // display movements
  displayMovments(acc)
}


const startLogOutTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0)
    labelTimer.textContent = `${min}:${sec}`;
    if (time === 0) {
      clearTimeout(timer);
      labelWelcome.textContent = `Log in to get started`;
      containerApp.style.opacity = 0;
    };
    time--
  }
  let time = 420;
  tick();
  const timer = setInterval(tick, 1000);
  return timer
}

//////////////////////////////////////
/////////////////////////////////////
/// Event HAndler
//////////////////////////////////////
//////////////////////////////////////

let currentAccount, timer
// // FAKE LOGGED IN
// currentAccount = account1;
// updateUI(currentAccount)
// containerApp.style.opacity = 100;

/////////////////////
//////button login
////////////////////



btnLogin.addEventListener('click', function (e) {

  e.preventDefault();

  // Display time
  const now = new Date();
  const options = {
    hour: 'numeric',
    minute: 'numeric',
    year: 'numeric',
    day: 'numeric',
    month: 'long',
    weekday: 'long'
  };

  currentAccount = accounts.find(acc => acc?.username === inputLoginUsername.value);

  if (+(inputLoginPin.value) === currentAccount.pin) {
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`
    containerApp.style.opacity = 100;
  }
  inputLoginUsername.value = inputLoginPin.value = ''
  inputLoginPin.blur()


  const locale = navigator.language;
  labelDate.textContent = new Intl
    .DateTimeFormat(currentAccount.locale, options).format(now);

  // Timer
  if (timer) clearInterval(timer)
  timer = startLogOutTimer();
  updateUI(currentAccount)

});
////////////////////////
//////button transfer
////////////////////////

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault()
  const amount = +(inputTransferAmount.value)
  const receiverAcc = accounts.find((acc) => acc.username === inputTransferTo.value)
  inputTransferTo.value = inputTransferAmount.value = ''

  if (amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username) {

    // deducting amt from current ac
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // add date and time
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

  }
  // update UI
  updateUI(currentAccount)
  // Rest timer
  clearInterval(timer);
  timer = startLogOutTimer();
});

/////////////////////
//////button loan
////////////////////

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Math.floor(inputLoanAmount.value);
  inputLoanAmount.value = ''
  if (amount > 0 && currentAccount?.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(function () {
      // add amt to movemts array
      currentAccount.movements.push(amount);
      currentAccount.movementsDates.push(new Date().toISOString());
      updateUI(currentAccount)
    }, 2500)
  }
  // Rest timer
  clearInterval(timer);
  timer = startLogOutTimer();
});

/////////////////////
//////button close
////////////////////
btnClose.addEventListener('click', function (e) {
  e.preventDefault()
  if (currentAccount.username === inputCloseUsername.value && currentAccount.pin === +(inputClosePin.value)) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    accounts.splice(index, 1)
  }
  containerApp.style.opacity = 0;
});

/////////////////////
//////button short
////////////////////
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovments(currentAccount, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES   


const calcDaysPassed = (date1, date2) =>
  Math.abs(date1 - date2) / (1000 * 60 * 60 * 24);


// setInterval(function () {
//   const now = new Date();
//   console.log(now);
// }, 1000);

// let time = new Date();
// setInterval(function () {
//   labelTimer.textContent = time;
//   time--
// }, 1000);

// clock 
// setInterval(e => function (d = new Date()) {
//   labelTimer.textContent = `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
// }(), 1000);