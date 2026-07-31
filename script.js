function updateContainerHeight() {
    const count = document.querySelectorAll('#item-container .item').length;
    const container = document.getElementById('item-container');
    const userIndicator = document.getElementById('userIndicator');

    container.style.display = count === 0 ? 'none' : 'flex';
    userIndicator.style.display = count === 0 ? 'block' : 'none';
}

function addItem() {
    const container = document.getElementById('item-container');

    const item = document.createElement('div');
    item.className = 'item';
    item.tabIndex = 0;
    item.textContent = 'Neues Item';

    item.addEventListener('click', () => {
        item.style.textDecoration = 'line-through';
        setTimeout(() => {
            item.remove();
            updateContainerHeight();
            alert(item.textContent + " has been removed!")
        }, 750)
    });
    container.appendChild(item);
    updateContainerHeight();
}

updateContainerHeight()