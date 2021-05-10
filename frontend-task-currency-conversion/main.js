let sourceCurrency = 'EUR';
let destCurrency = 'USD';

let previousValues = [];

//Function to set Local storage for history access
function setLocalStorage() {
    if (localStorage.getItem('currencyHistory')) {
        previousValues = JSON.parse(localStorage.getItem('currencyHistory'));
    }
    localStorage.setItem('currencyHistory', JSON.stringify(previousValues));
}

setLocalStorage();

//Function to clear Local Storage
function clearStorage() {
    empty = []
    localStorage.setItem('currencyHistory', JSON.stringify(empty));
    if (document.querySelector("thead")) {
        document.querySelector("thead").remove();
        document.getElementById('clear').style.display = 'none'
    }
}

//Function to convert the amount
const performAPICall = async (source, to) => {
    const sourceAmount = document.getElementById('sourceAmount').value;
    const destValue = document.getElementById('destCurrency').value;
    const sourceValue = document.getElementById('sourceCurrency').value;

    if(sourceValue === destValue){
        alert("Souce/Destination cannot be the same");
    }

    else if (sourceAmount !== 0) {
        const response = await fetch(`https://free.currconv.com/api/v7/convert?q=${source}_${to}&compact=ultra&apiKey=db31ca7b0d98f03fe558`);
        const myJson = await response.json();
        const result = (Object.values(myJson)[0] * sourceAmount).toFixed(2);
        document.getElementById("result").value = result;
        const resObj = { "Source Amount": sourceAmount + " " + sourceValue, "Converted Amount": result + " " + destValue }
        previousValues = JSON.parse(localStorage.getItem('currencyHistory'))
        previousValues.push(resObj)
        localStorage.setItem('currencyHistory', JSON.stringify(previousValues));
        createHistory();
    }

}

//On change listener to listen for change in source dropdown
document.getElementById("sourceCurrency").onchange = function () {
    sourceCurrency = this.value;
    setCurrencySymbol(sourceCurrency, "sourceCurrencySymbol");
    processChange();
};

//On change listener to listen for change in destination dropdown
document.getElementById("destCurrency").onchange = function () {
    destCurrency = this.value;
    setCurrencySymbol(destCurrency, "destCurrencySymbol");
    processChange();
};


//To set the currency symbol depending on the dropdown selection
function setCurrencySymbol(currency_selected, elementId) {

    if (currency_selected == 'USD') {
        document.getElementById(elementId).innerHTML = '&#36;';
    }
    else if (currency_selected == 'EUR') {
        document.getElementById(elementId).innerHTML = '&euro;';
    }
    else if (currency_selected == 'JPY') {
        document.getElementById(elementId).innerHTML = '&#165;';
    }

}


//delay the request
function debounce(func, timeout = 500) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => { func.apply(this, args); }, timeout);
    };
}

//call the api
const processChange = debounce(() => performAPICall(sourceCurrency, destCurrency));

function rotateImage() {
    const element = document.getElementById('rotate-icon');

    if (element.className === "reverse" || element.className === "normal") {
        element.className = "rotate";
    }
    else if (element.className === "rotate") {
        element.className = 'reverse';
    }
    let source = document.getElementById('sourceCurrency').value;
    let dest = document.getElementById('destCurrency').value;

    document.getElementById('sourceCurrency').value = dest;
    document.getElementById('destCurrency').value = source;
    document.getElementById('sourceAmount').value = document.getElementById('result').value
    let event = new Event('change');
    document.getElementById('sourceCurrency').dispatchEvent(event);
    document.getElementById('destCurrency').dispatchEvent(event);
}

document.getElementById('result').removeAttribute('title');

function generateTableHead(table, data) {
    let thead = table.createTHead();
    let row = thead.insertRow();
    for (let key of data) {
        let th = document.createElement("th");
        let text = document.createTextNode(key);
        th.appendChild(text);
        row.appendChild(th);
    }
}

function generateTable(table, data) {
    for (let element of data) {
        let row = table.insertRow();
        for (key in element) {
            let cell = row.insertCell();
            let text = document.createTextNode(element[key]);
            cell.appendChild(text);
        }
    }
}

//Create the history table
function createHistory() {
    if (localStorage.getItem('currencyHistory').length) {
        let clearButton = document.getElementById('clear');
        clearButton.style.display = 'block';
        let table = document.querySelector("table");
        if (document.querySelector("thead")) {
            document.querySelector("thead").remove();
        }
        let values = JSON.parse(localStorage.getItem('currencyHistory'))
        let data = Object.keys(values[0]);
        generateTableHead(table, data);
        generateTable(table, values);
    }
}

createHistory()

