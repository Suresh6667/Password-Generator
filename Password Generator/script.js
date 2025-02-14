const inputSlider = document.querySelector('[data-lengthSlider]');
const lengthDisplay = document.querySelector('[data-lengthNumber]');
const passwordDisplay = document.querySelector('[data-passwordDisplay]');
const copyBtn = document.querySelector('[data-copy]');
const copyMsg = document.querySelector('[data-copyMsg]');
const uppercaseCheck = document.querySelector('#uppercase');
const lowercaseCheck = document.querySelector('#lowercase');
const numberCheck = document.querySelector('#number');
const symbolCheck = document.querySelector('#symbol');
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateBtn");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
console.log("allcheckbox is working")
const symbols = "~!@#$%^&*()_+={}[<>]/?";

let password = "";
let passwordLength = 10;
let checkCount = 0;   
handleSlider()

function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordLength - min)*100/(max - min)) + "% 100%"
}

function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRandomInteger(min,max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumber() {
    return getRandomInteger(0,9)
}

function generateLowercase() {
    return String.fromCharCode(getRandomInteger(97,123));
}

function generateUppercase() {
    return String.fromCharCode(getRandomInteger(65,91));
}

function generateSymbol() {
    const rndNum = getRandomInteger(0, symbols.length);
    return symbols.charAt(rndNum);
}


function calStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numberCheck.checked) hasNum = true;
    if (symbolCheck.checked) hasSym = true;

    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >=8) {
        setIndicator("#0f0");
    } else if (
        (hasUpper || hasLower) && (hasNum || hasSym) && passwordLength >=6
    ) {
        setIndicator("#ff0");
    } else {
        setIndicator("#f00");
    }
    
}


async function copyContent(){
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "Copied";
        
    } catch (e) {
        copyMsg.innerText = "Failed";
    }
    copyMsg.classList.add("active");

    setTimeout(() => {
       copyMsg.classList.remove("active");
    }, 2000);
}

function shufflePassword(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str ="";
    array.forEach((el) => (str += el));
    return str;
} 

function handleCheckBoxChange() {
    checkCount = 0;
    allCheckBox.forEach( (checkbox) => {
        if(checkbox.checked)
            checkCount++;
    });

    if(passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }
} 


allCheckBox.forEach( (checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
})
console.log("win")



inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
})    


copyBtn.addEventListener('click', () => {
    if(passwordDisplay.value)
        copyContent();
})
console.log("Copy")

generateBtn.addEventListener('click', () => {
    if(checkCount == 0) 
        return;

    if(passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }

    password = "";

    let funcArr = [];

    if(uppercaseCheck.checked)
        funcArr.push(generateUppercase);

    if(lowercaseCheck.checked)
        funcArr.push(generateLowercase);

    if(numberCheck.checked)
        funcArr.push(generateRandomNumber);

    if(symbolCheck.checked)
        funcArr.push(generateSymbol);

    for(let i=0; i<funcArr.length; i++) {
        password += funcArr[i]();
    }
    console.log("Compulsary addition done")
    for (let i=0; i<passwordLength-funcArr.length; i++) {
        let randIndex = getRandomInteger(0 , funcArr.length);
        password += funcArr[randIndex]();
    }
    console.log("Remaining addition done")

    password = shufflePassword(Array.from(password ));
    console.log("Shuffling done")
    passwordDisplay.value = password;
    console.log("UI addition done")
    calStrength();
 
});