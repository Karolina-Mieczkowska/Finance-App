const historyIcons = document.querySelectorAll('.history_icon');
const subnavItems = document.querySelectorAll('.subnav_item');
const history = document.querySelector('.history');
const sectionTitleHistory = document.querySelector('.section_title-history');

const toggleHistoryActivation = function() {
    history.classList.toggle('history-active');
}

historyIcons.forEach(function(icon) {
    icon.addEventListener('click', toggleHistoryActivation);
})

// SUBNAV ROUTER

let prevItems = [];
let prevItemIndex;

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
    })
})

