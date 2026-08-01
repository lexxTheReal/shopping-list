const BACKEND_URL = "http://192.168.1.79:3000";

async function fetchItems() {
    try {
        const response = await fetch(`${BACKEND_URL}/api/items`);
        if (!response.ok) {
            throw new Error('Failed to fetch items');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching items:', error);
        return [];
    }
}

async function addItemToBackend(itemText) {
    try {
        const response = await fetch(`${BACKEND_URL}/api/items`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text: itemText }),
        });
        if (!response.ok) {
            throw new Error('Failed to add item');
        }
        return await response.json();
    } catch (error) {
        console.error('Error adding item:', error);
        throw error;
    }
}

async function deleteItemFromBackend(itemId) {
    try {
        const response = await fetch(`${BACKEND_URL}/api/items/${itemId}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('Failed to delete item');
        }
    } catch (error) {
        console.error('Error deleting item:', error);
        throw error;
    }
}

function updateContainerHeight() {
    const COUNT = document.querySelectorAll('#item-container .item').length;
    const CONTAINER = document.getElementById('item-container');
    const USER_INDICATOR = document.getElementById('userIndicator');

    CONTAINER.style.display = COUNT === 0 ? 'none' : 'flex';
    USER_INDICATOR.style.display = COUNT === 0 ? 'block' : 'none';
}

function renderItem(item) {
    const container = document.getElementById('item-container');
    const itemElement = document.createElement('div');
    itemElement.className = 'item';
    itemElement.tabIndex = 0;
    itemElement.textContent = item.text;
    itemElement.dataset.id = item.id;

    itemElement.addEventListener('click', async () => {
        itemElement.style.transition = 'all 0.3s ease';
        itemElement.style.textDecoration = 'line-through';
        itemElement.style.opacity = '0';
        itemElement.style.transform = 'translateX(-20px)';
        setTimeout(async () => {
            itemElement.remove();
            await deleteItemFromBackend(item.id);
            updateContainerHeight();
        }, 300);
    });
    container.appendChild(itemElement);
}

async function addItem() {
    const userInputField = document.getElementById('userInput');
    const userInput = userInputField.value.trim();

    if (userInput !== "") {
        try {
            const newItem = await addItemToBackend(userInput);
            renderItem(newItem);
            userInputField.value = "";
        } catch (error) {
            console.error('Failed to add item:', error);
            alert('Failed to add item. Please try again.');
        }
    } else {
        try {
            const newItem = await addItemToBackend('NED SO NICE BRO');
            renderItem(newItem);
        } catch (error) {
            console.error('Failed to add item:', error);
            alert('Failed to add item. Please try again.');
        }
    }

    updateContainerHeight();
}

function setupInputField() {
    const userInputField = document.getElementById('userInput');
    userInputField.addEventListener('keydown', async (event) => {
        if (event.key === 'Enter' && userInputField.value.trim()) {
            event.preventDefault();
            await addItem();
        }
    });
}

async function initApp() {
    try {
        const items = await fetchItems();
        items.forEach(item => renderItem(item));
        updateContainerHeight();
        setupInputField();
    } catch (error) {
        console.error('Failed to initialize app:', error);
        alert('Failed to load shopping list. Please refresh the page.');
    }
}

initApp();