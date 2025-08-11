const form = document.querySelector("form")
const start = document.getElementById("start-number")
const end = document.getElementById("end-number")
const quantity = document.getElementById("quantity")
const repeat = document.getElementById("repeat")

const raffle = document.getElementById("raffle")
const result = document.getElementById("result")
const btnRestart = document.getElementById("btn-restart")

const numberList = document.querySelector(".number-list")

const inputs = document.querySelectorAll(".input-wrapper .border-gradient input")

for (let input of inputs) {
    input.addEventListener("input", () => {
        input.value = input.value.replace(/\D+/g, "")
    })
}

form.onsubmit = (event) => {
    event.preventDefault()

    const params = {
        quantity: Number(quantity.value),
        start: Number(start.value),
        end: Number(end.value),
        allowRepeats: repeat.checked,
    }

    try {
        if (params.allowRepeats && params.quantity > (params.end - params.start + 1)) {
            throw new RangeError("Quantidade solicitada excede o número de valores únicos disponíveis.")
        }

        if (!params.quantity || !params.end || !params.start) {
            throw new RangeError("Preencha todos os campos")
        }

        raffle.classList.add("hidden")
        result.style.display = "grid"

        let resultNumbers = randomNumber(params)

        addResult(resultNumbers)
        
    } catch (error) {
        if (error instanceof RangeError) {
            alert("Quantidade solicitada excede o número de valores únicos disponíveis.")
        } else {
            alert("Não possível gerar os números!")
            console.log(error)
        }
    }
}

function randomNumber(params) {
    try {
        let randomResult = []

        while(randomResult.length < params.quantity){
            let randomNumber = Math.floor(Math.random() * (params.end - params.start + 1)) + params.start;

            if (params.allowRepeats) {
                if (!randomResult.includes(randomNumber)) {
                    randomResult.push(randomNumber)
                }
            } else {
                randomResult.push(randomNumber)
            }
        }

        return randomResult

    } catch (error) {
        console.log(error)
        alert("Não foi possível gerar os números")
    }
}

function addResult(resultNumbers) {
    
    const APPEAR_DURATION = 1000;
    const APPEAR_DELAY = 1900;
    
    const SCALE_DURATION = 1900;
    const SCALE_DELAY = 1000;
    
    const ROTATE_DURATION = 900;
    const ROTATE_DELAY = 1300;
    
    const TOTAL_ANIMATION_TIME = Math.max(
        APPEAR_DELAY + APPEAR_DURATION,
        SCALE_DELAY + SCALE_DURATION,
        ROTATE_DELAY + ROTATE_DURATION
    );
    
    let cumulativeDelay = 0

    numberList.innerHTML = ""
    for(let i = 0; i < resultNumbers.length; i++) {

        const numberItem = document.createElement("li");
        numberItem.classList.add("number-content");
        
        const number = document.createElement("span");
        number.textContent = resultNumbers[i];

        cumulativeDelay = i * TOTAL_ANIMATION_TIME;

        number.style.animation = `
            ${APPEAR_DURATION}ms ${APPEAR_DELAY + cumulativeDelay}ms appear_number linear both
        `;

        const rectangle = document.createElement("div");
        rectangle.classList.add('rectangle');

        rectangle.style.animation = `
            ${SCALE_DURATION}ms ${SCALE_DELAY + cumulativeDelay}ms scale_shape linear both, 
            ${ROTATE_DURATION}ms ${ROTATE_DELAY + cumulativeDelay}ms rotate_shape linear both
        `;

        number.append(rectangle);
        numberItem.append(number);
        numberList.append(numberItem);
    }

    btnRestart.style.animation = `500ms ${cumulativeDelay + TOTAL_ANIMATION_TIME}ms appear_button linear both`
}

btnRestart.onclick = () => {
    raffle.classList.remove("hidden")
    result.style.display = "none"
}
