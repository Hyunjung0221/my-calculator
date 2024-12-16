// 전역 변수 선언
let firstOperand = null; // 첫 번째 피연산자 (계산의 시작 숫자)
let operator = null; // 현재 선택된 연산자 (+, -, *, / 중 하나)
let isNewOperand = false; // 새로운 피연산자를 입력해야 하는 상태 여부 (연산자 누른 직후에 true)

// HTML 요소 선택
const display = document.querySelector('.display'); // 계산기의 출력 화면
const buttons = document.querySelectorAll('.button'); // 모든 버튼을 가져옴
const redButton = document.querySelector('.red')

redButton.addEventListener('click', () => {
    if (confirm('창을 닫으시겠습니까?')) {
        window.close();
    }
});

// 모든 버튼에 클릭 이벤트 리스너 추가
buttons.forEach(button => {
    button.addEventListener('click', () => {
        const value = button.textContent; // 버튼의 텍스트(숫자, 연산자, 기능)를 가져옴

        // 📘 숫자 버튼을 눌렀을 때의 동작
        if (button.classList.contains('number')) {
            // 디스플레이에 0이 있거나 새 피연산자를 입력해야 하는 경우, 새로 입력한 값으로 덮어씌움
            if (display.textContent === '0' || isNewOperand) {
                display.textContent = value;
            } else {
                // 소수점(.)이 이미 존재하면 추가 입력을 막음
                if (value === '.' && display.textContent.includes('.')) return;
                display.textContent += value; // 현재 디스플레이에 새 값을 추가
            }
            isNewOperand = false; // 새 피연산자 입력이 끝났음을 표시
        }

        // 📘 기능 버튼 (C, ±, %)을 눌렀을 때의 동작
        if (button.classList.contains('function')) {
            if (value === 'C') { 
                // 'C' 버튼: 디스플레이와 모든 변수 초기화
                display.textContent = '0';
                firstOperand = null;
                operator = null;
            }
            if (value === '±') {
                // '±' 버튼: 현재 디스플레이에 표시된 숫자의 부호를 반전
                display.textContent = (parseFloat(display.textContent) * -1).toString();
            }
            if (value === '%') {
                // '%' 버튼: 현재 디스플레이에 표시된 숫자를 백분율로 변환
                display.textContent = (parseFloat(display.textContent) / 100).toString();
            }
        }

        // 📘 연산자 버튼 (+, -, *, /, =)을 눌렀을 때의 동작
        if (button.classList.contains('operator')) {
            if (value === '=') {
                // '=' 버튼: 연산을 수행하고 결과를 출력
                if (firstOperand !== null && operator) { 
                    const secondOperand = parseFloat(display.textContent); // 두 번째 피연산자를 가져옴
                    const result = calculate(firstOperand, operator, secondOperand); // 연산 실행
                    display.textContent = result.toString(); // 결과를 디스플레이에 출력
                    firstOperand = result; // 결과를 첫 번째 피연산자로 저장
                    operator = null; // 연산자 초기화
                }
            } else {
                // 연산자 버튼 (+, -, *, /)을 누르면
                if (firstOperand === null) {
                    // 첫 번째 피연산자가 아직 없으면, 현재 디스플레이 값을 첫 번째 피연산자로 저장
                    firstOperand = parseFloat(display.textContent);
                } else if (!isNewOperand) {
                    // 첫 번째 피연산자가 존재하면 두 번째 피연산자를 가져와 연산을 수행
                    const secondOperand = parseFloat(display.textContent);
                    const result = calculate(firstOperand, operator, secondOperand);
                    display.textContent = result.toString(); // 결과를 디스플레이에 출력
                    firstOperand = result; // 결과를 첫 번째 피연산자로 설정
                }
                operator = value; // 누른 연산자를 저장 (+, -, *, / 중 하나)
            }
            isNewOperand = true; // 새 피연산자를 입력해야 함을 표시 (다음 숫자 입력 시 새로 입력)
        }

        // 현재 상태를 콘솔에 출력 (디버깅 용도)
        console.log(`${firstOperand}, ${operator}`);
    });
});

// 📘 연산을 수행하는 함수 (calculate)
function calculate(operand1, operator, operand2) {
    let result;
    switch (operator) {
        case '+':
            result = operand1 + operand2;
            break;
        case '-':
            result = operand1 - operand2;
            break;
        case '*':
            result = operand1 * operand2;
            break;
        case '/':
            if (operand2 === 0) {
                alert('0으로는 못 나눈다!');
                return operand1;
            }
            result = operand1 / operand2;
            break;
        default:
            result = operand1;
    }

    // 소수점 이하 2자리로 제한
    return parseFloat(result.toFixed(3));
}