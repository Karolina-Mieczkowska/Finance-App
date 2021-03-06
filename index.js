const historyIcons = document.querySelectorAll('.history_icon');
const subnavItems = document.querySelectorAll('.subnav_item');
const history = document.querySelector('.history');
const sectionTitleHistory = document.querySelector('.section_title-history');
const historyMovements = document.querySelector('.history_movements');

const incomeLabel = document.querySelector('.summary_value-in');
const outcomeLabel = document.querySelector('.summary_value-out');
const numberLabel = Array.from(document.querySelectorAll('.accounts_element_card_number'));
const accountBalanceLabel = Array.from(document.querySelectorAll('.accounts_element_card_amount'));
const currentYearLabel = document.querySelector('.current_year');

const btnSort = document.querySelector('.btn-sort');
const btnTransfer = document.querySelector('.btn-transfer');

const transferSelectSend = document.querySelector('.transfer_select-send');
const transferSelectReceive = document.querySelector('.transfer_select-receive');
const transferInputNumber = document.querySelector('.transfer_input-number');

const transferSection = document.querySelector('.transfer');
const transferSwipe = document.querySelector('.transfer-swipe');
const transferIcon = document.querySelector('.transfer-swipe svg')

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

// SWIPE TRANSFER LAYER

let transferIsDragging = false;

const toggleTransferLayer = function() {
    transferSection.classList.toggle('transfer-active');
};

const transferTouchStart = function() {
    transferIsDragging = false;
};

const transferTouchEnd = function() {
    if (transferIsDragging) {
        toggleTransferLayer();
    }
};

const transferTouchMove = function() {
    transferIsDragging = true;
};

transferIcon.addEventListener('click', toggleTransferLayer);

transferSection.addEventListener('touchstart', transferTouchStart);
transferSection.addEventListener('touchend', transferTouchEnd);
transferSection.addEventListener('touchmove', transferTouchMove);

// DISABLE HISTORY WHILE TRANSFERING

if (screen.width < 1025) {
    transferInputNumber.addEventListener('focus', function() {
        
        history.style.display = 'none';
        transferSection.classList.add('transfer_on-focus');
    });
    
    transferInputNumber.addEventListener('blur', function() {
        
        history.style.display = 'block';
        transferSection.classList.remove('transfer_on-focus');
    });
}

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
    number: '1234 1234 1234 1234',
    currency: 'GBP',
    movements: [200, -100, -300, 400, 500]
};

const savingAccount = {
    type: 'saving',
    number: '5678 5678 5678 5678',
    currency: 'GBP',
    movements: [30, 30, 30, -10]
};

const currencyAccount = {
    type: 'currency',
    number: '3456 3456 3456 3456',
    currency: 'PLN',
    movements: [200, 300, 1000, -300, 200]
};

const accounts = [currentAccount, savingAccount, currencyAccount];

// CURRENCY

const zlotyExchangeRate = 5.2;

const currencyConversion = function(account) {

    account.movements = account.movements.map(function(mov) {
        return mov * zlotyExchangeRate;
    })

    account.balance = account.balance * zlotyExchangeRate;
}

currencyConversion(currencyAccount);

// HISTORY

const displayMovements = function(acc, sort = false) {
    
    historyMovements.innerHTML = '';

    acc.movs = sort ? acc.movements.slice().sort((a, b) => a - b) : acc.movements;

    acc.movs.forEach(function(movement) {

        const type = movement > 0 ? 'deposit' : 'withdrawal';

        const historyMovement = `
                <div class="movement">
                    <div class="movement_type movement_type-${type}">${type}</div>
                    <div class="movement_value movement_type-${type}">${movement.toFixed(2)}<span class="movement_value-currency">${acc.currency}</span></div>
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
    incomeLabel.textContent = incomes.toFixed(2);

    const outcomes = acc.movements
        .filter(function(mov) {
            return mov < 0;
        })
        .reduce(function(acc, curr)  {
            return acc + curr;
        }, 0)
    outcomeLabel.textContent = Math.abs(outcomes).toFixed(2);
}

displaySummary(accounts[0])

// SORT 

let sorted = false;

btnSort.addEventListener('click', function() {

    if (selectedAccount === undefined) {
        displayMovements(accounts[0], !sorted);
        sorted = !sorted;
    } else {
        displayMovements(selectedAccount, !sorted);
        sorted = !sorted;
    }
})

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
        acc.balance = acc.movements.reduce(function(accumulator, current) {
            return accumulator + current;
        }, 0);
        accountBalanceLabel.find(function(label) {
            return label.classList.contains(`balance-${acc.type}`)
        }).textContent = acc.balance.toFixed(2) + ' ' + acc.currency;
    })
};

calcDisplayBalance(accounts);

// TRANSFER

btnTransfer.addEventListener('click', function(ev) {
    ev.preventDefault();

    const senderAccount = accounts.find(function(account) {
        return account.type === transferSelectSend.value;
    })

    const receiverAccount = accounts.find(function(account) {
        return account.type === transferSelectReceive.value;
    })

    let transferAmount = Number(transferInputNumber.value);

    if (transferAmount > 0 && senderAccount.balance >= transferAmount && receiverAccount !== senderAccount) {


        if (receiverAccount !== currencyAccount && senderAccount !== currencyAccount) {
            
            senderAccount.movements.push(-transferAmount);
            receiverAccount.movements.push(transferAmount);

        } 
        
        if (receiverAccount === currencyAccount) {

            receiverAccount.movements.push(transferAmount * zlotyExchangeRate);
            senderAccount.movements.push(-transferAmount);

        } 
        
        if (senderAccount === currencyAccount) {
            
            senderAccount.movements.push(-transferAmount);
            receiverAccount.movements.push(transferAmount / zlotyExchangeRate);
            
        }

        calcDisplayBalance(accounts);

        if (selectedAccount === undefined) {

            displayMovements(accounts[0]);
            displaySummary(accounts[0]);
        } else {

            displayMovements(selectedAccount);
            displaySummary(selectedAccount);
        }
    }

    transferInputNumber.value = '';
    if (screen.width < 1025) {

        history.style.display = 'block';
        transferSection.classList.remove('transfer_on-focus');
        transferInputNumber.blur();
    }
})

// DATE

const date = new Date().getFullYear();

currentYearLabel.textContent = date;


