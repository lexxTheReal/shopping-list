const BACKEND_URL = "http://172.0.0.1:5432";


function updateContainerHeight() {
    const COUNT = document.querySelectorAll('#item-container .item').length;
    const CONTAINER = document.getElementById('item-container');
    const USER_INDICATOR = document.getElementById('userIndicator');

    CONTAINER.style.display = COUNT === 0 ? 'none' : 'flex';
    USER_INDICATOR.style.display = COUNT === 0 ? 'block' : 'none';
}

let counter = 0;

function addItem() {
    counter += 1;
    const container = document.getElementById('item-container');
    const userInputField = document.getElementById('userInput');
    const userInput = userInputField.value;

    

    if (counter % 2 != 0) { //wenn zum ersten mal im zweier cyrcle geclicked wird
        userInputField.style.display = 'flex';
    }
    else{ //wenn zum zweiten mal im zweier cyrcle geclicked wurde
        userInputField.style.display = 'none';
        
        const item = document.createElement('div');
        item.className = 'item';
        item.tabIndex = 0;
        if(userInput != "") {
            item.textContent = userInput;
        }
        else{
            item.textContent = 'NED SO NICE BRO';
        }

        item.addEventListener('click', () => {
            item.style.textDecoration = 'line-through';
            setTimeout(() => {
                item.remove();
                updateContainerHeight();
            }, 750)
        });
        container.appendChild(item);
        updateContainerHeight();
        userInputField.value = "";
    }
}
updateContainerHeight();