const inputSlider = document.querySelector('[data-lenghtSlider]');
const lengthDisplay = document.querySelector('[data-lengthNumer]');

const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = "!@#$%^&*(){}[]=<>/.";

let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();

// set strength circle color to grey
setindicator("#ccc");


// set password Length 
function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    // inputSlider.style.backgroundSize = ((passwordLength - min) * 100 / (max - min)) + "% 100%"; 
}

function setindicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`
}

function getRndInteger(min,max) {
    return Math.floor(Math.random() * (max - min)) + min; 
}

function generateRandomdNumber() {
    return getRndInteger(0, 9);
}

function generateLowerCase() {

    // ASCII value of a is 97 and z is 123;
    return String.fromCharCode(getRndInteger(97, 123));

}

function generateUppercase() {
    // ASCII value of A is 65 and Z is 91
    return String.fromCharCode(getRndInteger(65, 91));
}

function generateSymbol() {
    // const rndNum = getRndInteger(0, 5);
    // return symbolss.charAt[rndNum]; 
    let result = "";
    for ( var i = 0; i < length; i++ ) {
      result += symbols.charAt(Math.floor(Math.random() * symbols.length));
    }
    return result;
}

function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSymbol = false;
    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSymbol = true;

    if (hasUpper && hasLower && (hasNum || hasSymbol) && passwordLength >= 8) {
        setindicator("#0f0");
    } else if (
        (hasUpper||hasLower) && (hasNum||hasSymbol) && passwordLength >=6
    ) {
        setindicator("#ff0");
    } else {
        setindicator("#f00");
    }
}

async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "Copied"

    } catch (error) {
        copyMsg.innerText = "Failed";
    }

    // copy wale span visible
    copyMsg.classList.add("active");

    setTimeout(()=> {
        copyMsg.classList.remove("active")
    },2000)
}

function handleCheckBoxChange() {
    checkCount = 0;
    allCheckBox.forEach((checkbox) => {
        if (checkbox.checked) {
            checkCount++;
        }

        // special Condition
        if (passwordLength < checkCount) {
            passwordLength = checkCount;
            handleSlider();
        }
    })
}

function shufflePassword(array) {
    // Fisher Yates Method
    for (let i = array.length - 1; i > 0; i--){
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((e) => {
        str += e;
    })

    return str;
}


allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
})

inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click', () => {
    if (passwordDisplay.value) {
        copyContent();
    }
})

generateBtn.addEventListener('click', () => {
    // none of the checkbox selected
    if (checkCount <= 0) return;

    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }

    // let's start the journey to find new password

    // remove old password
    password = "";
    // let's put the stuff mentioned in the checkbox
    
    let funArr = [];
    if (uppercaseCheck.checked) {
        funArr.push(generateUppercase)
    }

    if (lowercaseCheck.checked) {
        funArr.push(generateLowerCase)
    }

    if (numbersCheck.checked) {
        funArr.push(generateRandomdNumber)
    }

    if (symbolsCheck.checked) {
        funArr.push(generateSymbol)
    }

    // Complusary Addition
    for (let i = 0; i < funArr.length; i++){
        password += funArr[i]();
    }

    // remaining addition
    for (let i = 0; i < passwordLength - funArr.length; i++){
        let randIndex = getRndInteger(0, funArr.length);
        console.log("randindex"+ randIndex);
        password += funArr[randIndex]();
    }

    // Shuffle the password
    password = shufflePassword(Array.from(password));

    // show in UI
    passwordDisplay.value = password;

    // calculate Strength
    calcStrength(); 


})