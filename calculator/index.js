// Element Map
const elementMap = new Map();

function getElement(id) {
    if (!elementMap.has(id)) {
        elementMap.set(id, document.getElementById(id));
    }
    return elementMap.get(id);
}

function getElements(...ids) {
    return ids.map((id) => document.getElementById(id));
}
const getValue = (id) => getElement(id).value;
const setValue = (id) => (value) => (getElement(id).value = value);

// Date Calculations
const today = new Date();
const [currentYear, currentMonth] = [today.getFullYear(), today.getMonth() + 1];

function calcTotalMonths() {
    const yearDifference = currentYear - getValue('yearInput');
    const monthDifference = Math.abs(currentMonth - getValue('monthInput'));
    if (yearDifference < 0 || monthDifference < 0) {
        return undefined;
    } else {
        return yearDifference * 12 + monthDifference;
    }
}

// Average Milage
const avgMileagePerMonth = 1666;

function calcAverageMileage() {
    return calcTotalMonths() * avgMileagePerMonth;
}

// Display
const numberFormat = new Intl.NumberFormat('en-US', {
    style: 'decimal',
});

function format(number) {
    return numberFormat.format(number);
}

const [green, red, yellow] = ["#26A65B", "#D24D57", "#F4D03F"];

// function changeBodyBg(color) {
//     document.getElementById("resultColored").style.background = color;
// }

function displayResult(averageMileage, inputMileage) {
    function getDifference() {
        const difference = Math.abs(averageMileage - inputMileage);
        if (averageMileage > inputMileage) {
            resultOutput.style.background = green;
            // changeBodyBg(green);
            return `This vehicle is ${format(difference)}km under average.`;
        } else {
            resultOutput.style.background = red;
            // changeBodyBg(red);
            return `This vehicle is ${format(difference)}km over average.`;
        }
    }

    resultOutput.style.background = yellow;
    resultOutput.innerHTML = averageMileage != inputMileage ? `${getDifference()}`
        : "This vehicle's average mileage and current mileage match.";
}

function displayWarning(message) {
    resultOutput.style.background = yellow;
    // changeBodyBg(yellow);
    getElement('resultOutput').innerHTML = message;
}

// Input Handling
function isValidYear(year = getValue('yearInput')) {
    return year >= 1900 && year <= currentYear;
}

function isValidMonth(month = getValue('monthInput')) {
    if (getValue('yearInput') == currentYear)
        return month >= 1 && month <= currentMonth;
    else
        return month >= 1 && month <= 12;
}

function resetData() {
    document.getElementById('form-group').reset();
}

function handleInput() {
    if (getValue('mileageInput') < 0) setValue('mileageInput')(0);
    if (getValue('monthInput') !== '') {
        if (getValue('monthInput') < 1) setValue('monthInput')(1);
        if (getValue('monthInput') > 12) setValue('monthInput')(12);
    }
    if (!isValidYear()) {
        displayWarning(`The year value must be between 1900 and ${currentYear}.`);
    } else if (!isValidMonth()) {
        if (getValue('yearInput') == currentYear)
            displayWarning(`The month value must be less than or equal to ${currentMonth}.`);
        else
            displayWarning(`The month value must be between 1 and 12`)
    } else {
        displayResult(calcAverageMileage(), getValue('mileageInput'));
    }
}

handleInput();

getElements('yearInput', 'monthInput', 'mileageInput').forEach((input) => input.addEventListener('input', (inputEvent) => handleInput()));