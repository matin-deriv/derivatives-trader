// [AI]
import React, { useState } from 'react';
import classNames from 'classnames';
import Button from '../button';

type TCalculatorProps = {
    className?: string;
};

const Calculator = ({ className }: TCalculatorProps) => {
    const [display, setDisplay] = useState('0');
    const [firstOperand, setFirstOperand] = useState<number | null>(null);
    const [operator, setOperator] = useState<string | null>(null);
    const [waitingForSecondOperand, setWaitingForSecondOperand] = useState(false);

    const clearDisplay = () => {
        setDisplay('0');
        setFirstOperand(null);
        setOperator(null);
        setWaitingForSecondOperand(false);
    };

    const inputDigit = (digit: string) => {
        if (waitingForSecondOperand) {
            setDisplay(digit);
            setWaitingForSecondOperand(false);
        } else {
            setDisplay(display === '0' ? digit : `${display}${digit}`);
        }
    };

    const inputDecimal = () => {
        if (waitingForSecondOperand) {
            setDisplay('0.');
            setWaitingForSecondOperand(false);
            return;
        }

        if (!display.includes('.')) {
            setDisplay(`${display}.`);
        }
    };

    const performOperation = (nextOperator: string) => {
        const inputValue = parseFloat(display);

        if (firstOperand === null) {
            setFirstOperand(inputValue);
        } else if (operator) {
            const result = calculate(firstOperand, inputValue, operator);
            setDisplay(String(result));
            setFirstOperand(result);
        }

        setWaitingForSecondOperand(true);
        setOperator(nextOperator);
    };

    const calculate = (firstOperand: number, secondOperand: number, operator: string) => {
        switch (operator) {
            case '+':
                return firstOperand + secondOperand;
            case '-':
                return firstOperand - secondOperand;
            case '*':
                return firstOperand * secondOperand;
            case '/':
                return firstOperand / secondOperand;
            default:
                return secondOperand;
        }
    };

    return (
        <div className={classNames('dc-calculator', className)}>
            <div className='dc-calculator__display'>{display}</div>
            <div className='dc-calculator__keypad'>
                <div className='dc-calculator__keypad-row'>
                    <Button onClick={() => clearDisplay()} className='dc-calculator__key dc-calculator__key--clear'>
                        C
                    </Button>
                    <Button
                        onClick={() => performOperation('/')}
                        className='dc-calculator__key dc-calculator__key--operator'
                    >
                        ÷
                    </Button>
                </div>
                <div className='dc-calculator__keypad-row'>
                    <Button onClick={() => inputDigit('7')} className='dc-calculator__key'>
                        7
                    </Button>
                    <Button onClick={() => inputDigit('8')} className='dc-calculator__key'>
                        8
                    </Button>
                    <Button onClick={() => inputDigit('9')} className='dc-calculator__key'>
                        9
                    </Button>
                    <Button
                        onClick={() => performOperation('*')}
                        className='dc-calculator__key dc-calculator__key--operator'
                    >
                        ×
                    </Button>
                </div>
                <div className='dc-calculator__keypad-row'>
                    <Button onClick={() => inputDigit('4')} className='dc-calculator__key'>
                        4
                    </Button>
                    <Button onClick={() => inputDigit('5')} className='dc-calculator__key'>
                        5
                    </Button>
                    <Button onClick={() => inputDigit('6')} className='dc-calculator__key'>
                        6
                    </Button>
                    <Button
                        onClick={() => performOperation('-')}
                        className='dc-calculator__key dc-calculator__key--operator'
                    >
                        −
                    </Button>
                </div>
                <div className='dc-calculator__keypad-row'>
                    <Button onClick={() => inputDigit('1')} className='dc-calculator__key'>
                        1
                    </Button>
                    <Button onClick={() => inputDigit('2')} className='dc-calculator__key'>
                        2
                    </Button>
                    <Button onClick={() => inputDigit('3')} className='dc-calculator__key'>
                        3
                    </Button>
                    <Button
                        onClick={() => performOperation('+')}
                        className='dc-calculator__key dc-calculator__key--operator'
                    >
                        +
                    </Button>
                </div>
                <div className='dc-calculator__keypad-row'>
                    <Button onClick={() => inputDigit('0')} className='dc-calculator__key dc-calculator__key--zero'>
                        0
                    </Button>
                    <Button onClick={() => inputDecimal()} className='dc-calculator__key'>
                        .
                    </Button>
                    <Button
                        onClick={() => performOperation('=')}
                        className='dc-calculator__key dc-calculator__key--operator dc-calculator__key--equals'
                    >
                        =
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Calculator;
// [/AI]
