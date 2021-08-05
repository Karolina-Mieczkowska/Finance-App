const historyIcons = document.querySelectorAll('.history_icon');
const subnavItems = document.querySelectorAll('.subnav_item');
const history = document.querySelector('.history');
const sectionTitleHistory = document.querySelector('.section_title-history');
const historyMovements = document.querySelector('.history_movements');
const incomeLabel = document.querySelector('.summary_value-in');
const outcomeLabel = document.querySelector('.summary_value-out');
const numberLabel = Array.from(document.querySelectorAll('.accounts_element_card_number'));
const accountBalanceLabel = Array.from(document.querySelectorAll('.accounts_element_card_amount'));
const btnSort = document.querySelector('.btn-sort');

// SWIPE FRONT HISTORY LAYER

const toggleHistoryActivation = function() {
    history.classList.toggle('history-active');
}

historyIcons.forEach(function(icon) {
    icon.addEventListener('click', toggleHistoryActivation);
})

let isDragging = false;

const touchStart = function() {
    isDragging = false;
};

const touchEnd = function() {
    if (isDragging) {
        toggleHistoryActivation();
    }
};

const touchMove = function() {
    isDragging = true;
};

sectionTitleHistory.addEventListener('touchstart', touchStart);
sectionTitleHistory.addEventListener('touchend', touchEnd);
sectionTitleHistory.addEventListener('touchmove', touchMove);

// SUBNAV ROUTER

let prevItems = [];
let prevItemIndex;
let selectedAccount;

subnavItems.forEach(function(item, ind) {
    item.addEventListener('click', function() {
        
        item.classList.add('subnav_item-active');
        prevItems.push(ind);

        if (prevItems.length > 1) {
            prevItemIndex = prevItems[prevItems.length - 2];
        } else {
            prevItemIndex = 0;
        }

        if (item !== subnavItems[prevItemIndex]) {
            subnavItems[prevItemIndex].classList.remove('subnav_item-active')
        }

        selectedAccount = accounts[ind];

        displayMovements(selectedAccount)

        displaySummary(selectedAccount);
    })
})

// ACCOUNTS 

const currentAccount = {
    type: 'current',
    number: '1111 1111 1111 1111',
    currency: 'GBP',
    movements: [200, -100, -300, 400, 500]
};

const savingAccount = {
    type: 'saving',
    number: '2222 2222 2222 2222',
    currency: 'GBP',
    movements: [30, 30, 30, -10]
};

const currencyAccount = {
    type: 'currency',
    number: '3333 3333 3333 3333',
    currency: 'PLN',
    movements: [200, 300, 1000, -300]
};

const accounts = [currentAccount, savingAccount, currencyAccount];

// CURRENCY

const zlotyExchangeRate = 5.2;

currencyAccount.movements = currencyAccount.movements.map(function(mov) {
    return mov * zlotyExchangeRate;
})

// HISTORY

const displayMovements = function(acc) {
    
    historyMovements.innerHTML = '';

    acc.movements.forEach(function(movement) {

        const type = movement > 0 ? 'deposit' : 'withdrawal';

        const historyMovement = `
                <div class="movement">
                    <div class="movement_type movement_type-${type}">${type}</div>
                    <div class="movement_value movement_type-${type}">${movement}<span class="movement_value-currency">${acc.currency}</span></div>
                </div>
                `;
        historyMovements.insertAdjacentHTML('afterbegin', historyMovement)
    });
};

displayMovements(accounts[0]);

// SUMMARY 

const displaySummary = function(acc) {

    const incomes = acc.movements
        .filter(function(mov) {
            return mov > 0;
        })
        .reduce(function(acc, curr) {
            return acc + curr;
        }, 0)
    incomeLabel.textContent = incomes;

    const outcomes = acc.movements
        .filter(function(mov) {
            return mov < 0;
        })
        .reduce(function(acc, curr)  {
            return acc + curr;
        }, 0)
    outcomeLabel.textContent = Math.abs(outcomes);
}

displaySummary(accounts[0])

// NUMBER

const displayAccountNumber = function(acc) {
    acc.forEach(function(ac) {
        numberLabel.find(function(label) {
            return label.classList.contains(`card_number-${ac.type}`)
        }).textContent = ac.number;
    })
}

displayAccountNumber(accounts)

// BALANCE

const calcDisplayBalance = function(accs) {
    
    accs.forEach(function(acc) {
        const balance = acc.movements.reduce(function(accumulator, current) {
            return accumulator + current;
        }, 0);
        accountBalanceLabel.find(function(label) {
            return label.classList.contains(`balance-${acc.type}`)
        }).textContent = balance + ' ' + acc.currency;
    })
};

calcDisplayBalance(accounts);




