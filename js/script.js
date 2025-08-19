// Enhanced Calculator with Advanced Features
class AdvancedCalculator {
    constructor() {
        this.display = document.getElementById('display');
        this.currentInput = '';
        this.previousInput = '';
        this.operator = null;
        this.shouldResetDisplay = false;
        this.history = [];
        
        this.initializeCalculator();
        this.addEventListeners();
        this.createSoundEffects();
        this.startBootAnimation();
    }

    initializeCalculator() {
        this.display.value = '0';
        this.addKeyboardSupport();
        this.createRippleEffect();
    }

    startBootAnimation() {
        const calculator = document.querySelector('.calculator');
        calculator.classList.add('loading');
        
        // Boot sequence animation
        setTimeout(() => {
            calculator.classList.remove('loading');
            this.typeWriterEffect('CALCULATOR PRO', document.querySelector('.brand'));
        }, 1000);

        // Startup sound
        this.playStartupSound();
    }

    typeWriterEffect(text, element) {
        element.innerHTML = '';
        let i = 0;
        
        const timer = setInterval(() => {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
            } else {
                clearInterval(timer);
            }
        }, 100);
    }

    createSoundEffects() {
        // Create AudioContext for sound effects
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.soundEnabled = true;
        } catch (e) {
            this.soundEnabled = false;
        }
    }

    playSound(frequency = 440, duration = 100, type = 'sine') {
        if (!this.soundEnabled) return;
        
        try {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.value = frequency;
            oscillator.type = type;
            
            gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration / 1000);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + duration / 1000);
        } catch (e) {
            // Silently fail if audio context is not available
        }
    }

    playStartupSound() {
        if (!this.soundEnabled) return;
        
        const notes = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5
        notes.forEach((freq, index) => {
            setTimeout(() => this.playSound(freq, 200), index * 150);
        });
    }

    addEventListeners() {
        // Number buttons
        document.querySelectorAll('[data-number]').forEach(button => {
            button.addEventListener('click', (e) => {
                this.handleNumber(e.target.dataset.number);
                this.playSound(800, 50);
                this.animateButton(e.target);
            });
        });

        // Operator buttons
        document.querySelectorAll('[data-action="operator"]').forEach(button => {
            button.addEventListener('click', (e) => {
                this.handleOperator(e.target.textContent);
                this.playSound(600, 80);
                this.animateButton(e.target);
            });
        });

        // Equals button
        document.querySelector('[data-action="equals"]').addEventListener('click', (e) => {
            this.handleEquals();
            this.playSound(1000, 150, 'square');
            this.animateButton(e.target);
        });

        // Clear button
        document.querySelector('[data-action="clear"]').addEventListener('click', (e) => {
            this.handleClear();
            this.playSound(400, 100, 'sawtooth');
            this.animateButton(e.target);
        });

        // Delete button
        document.querySelector('[data-action="delete"]').addEventListener('click', (e) => {
            this.handleDelete();
            this.playSound(500, 80);
            this.animateButton(e.target);
        });

        // Decimal button
        document.querySelector('[data-action="decimal"]').addEventListener('click', (e) => {
            this.handleDecimal();
            this.playSound(700, 60);
            this.animateButton(e.target);
        });
    }

    addKeyboardSupport() {
        document.addEventListener('keydown', (e) => {
            e.preventDefault();
            
            if (e.key >= '0' && e.key <= '9') {
                this.handleNumber(e.key);
                this.playSound(800, 50);
                this.highlightButton(`[data-number="${e.key}"]`);
            } else if (['+', '-', '*', '/'].includes(e.key)) {
                let operator = e.key;
                if (operator === '*') operator = '×';
                if (operator === '/') operator = '÷';
                this.handleOperator(operator);
                this.playSound(600, 80);
                this.highlightButton(`[data-action="operator"]`);
            } else if (e.key === 'Enter' || e.key === '=') {
                this.handleEquals();
                this.playSound(1000, 150, 'square');
                this.highlightButton(`[data-action="equals"]`);
            } else if (e.key === 'Escape' || e.key.toLowerCase() === 'c') {
                this.handleClear();
                this.playSound(400, 100, 'sawtooth');
                this.highlightButton(`[data-action="clear"]`);
            } else if (e.key === 'Backspace') {
                this.handleDelete();
                this.playSound(500, 80);
                this.highlightButton(`[data-action="delete"]`);
            } else if (e.key === '.') {
                this.handleDecimal();
                this.playSound(700, 60);
                this.highlightButton(`[data-action="decimal"]`);
            }
        });
    }

    highlightButton(selector) {
        const button = document.querySelector(selector);
        if (button) {
            button.style.transform = 'scale(0.95)';
            button.style.boxShadow = 'inset 0 3px 10px rgba(0, 0, 0, 0.3)';
            setTimeout(() => {
                button.style.transform = '';
                button.style.boxShadow = '';
            }, 150);
        }
    }

    animateButton(button) {
        button.style.transform = 'scale(0.95)';
        button.style.boxShadow = 'inset 0 3px 10px rgba(0, 0, 0, 0.3)';
        
        setTimeout(() => {
            button.style.transform = '';
            button.style.boxShadow = '';
        }, 150);

        // Add ripple effect
        this.createRipple(button);
    }

    createRipple(button) {
        const ripple = document.createElement('span');
        const diameter = Math.max(button.clientWidth, button.clientHeight);
        const radius = diameter / 2;

        ripple.style.width = ripple.style.height = `${diameter}px`;
        ripple.style.left = `${-radius}px`;
        ripple.style.top = `${-radius}px`;
        ripple.classList.add('ripple');

        const rippleStyle = document.createElement('style');
        rippleStyle.innerHTML = `
            .ripple {
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.6);
                transform: scale(0);
                animation: ripple-animation 0.6s linear;
                pointer-events: none;
            }
            @keyframes ripple-animation {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        
        if (!document.querySelector('#ripple-style')) {
            rippleStyle.id = 'ripple-style';
            document.head.appendChild(rippleStyle);
        }

        const existingRipple = button.getElementsByClassName('ripple')[0];
        if (existingRipple) {
            existingRipple.remove();
        }

        button.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    createRippleEffect() {
        // Already implemented in createRipple method
    }

    handleNumber(number) {
        if (this.shouldResetDisplay) {
            this.display.value = '';
            this.shouldResetDisplay = false;
        }

        if (this.display.value === '0') {
            this.display.value = number;
        } else {
            this.display.value += number;
        }

        this.animateDisplay();
    }

    handleOperator(nextOperator) {
        const inputValue = parseFloat(this.display.value);

        if (this.previousInput === '') {
            this.previousInput = inputValue;
        } else if (this.operator) {
            const currentValue = this.previousInput || 0;
            const result = this.calculate(currentValue, inputValue, this.operator);

            this.display.value = String(result);
            this.previousInput = result;
        }

        this.shouldResetDisplay = true;
        this.operator = nextOperator;
    }

    handleEquals() {
        const inputValue = parseFloat(this.display.value);

        if (this.previousInput !== '' && this.operator) {
            const result = this.calculate(this.previousInput, inputValue, this.operator);
            
            // Add to history
            this.addToHistory(`${this.previousInput} ${this.operator} ${inputValue} = ${result}`);
            
            this.display.value = String(result);
            this.previousInput = '';
            this.operator = null;
            this.shouldResetDisplay = true;

            // Victory animation
            this.playVictoryAnimation();
        }
    }

    calculate(firstOperand, secondOperand, operator) {
        switch (operator) {
            case '+':
                return firstOperand + secondOperand;
            case '-':
                return firstOperand - secondOperand;
            case '×':
                return firstOperand * secondOperand;
            case '÷':
                if (secondOperand === 0) {
                    this.showError('لا يمكن القسمة على صفر!');
                    return 0;
                }
                return firstOperand / secondOperand;
            default:
                return secondOperand;
        }
    }

    handleClear() {
        this.display.value = '0';
        this.currentInput = '';
        this.previousInput = '';
        this.operator = null;
        this.shouldResetDisplay = false;
        
        // Clear animation
        this.animateDisplay();
    }

    handleDelete() {
        if (this.display.value.length > 1) {
            this.display.value = this.display.value.slice(0, -1);
        } else {
            this.display.value = '0';
        }
        
        this.animateDisplay();
    }

    handleDecimal() {
        if (this.shouldResetDisplay) {
            this.display.value = '0';
            this.shouldResetDisplay = false;
        }

        if (this.display.value.indexOf('.') === -1) {
            this.display.value += '.';
        }
    }

    animateDisplay() {
        this.display.style.transform = 'scale(1.05)';
        this.display.style.textShadow = '0 0 25px rgba(64, 224, 255, 1)';
        
        setTimeout(() => {
            this.display.style.transform = 'scale(1)';
            this.display.style.textShadow = '0 0 15px rgba(64, 224, 255, 0.6)';
        }, 200);
    }

    playVictoryAnimation() {
        const calculator = document.querySelector('.calculator');
        calculator.style.animation = 'none';
        
        setTimeout(() => {
            calculator.style.animation = 'victoryPulse 0.5s ease-in-out';
        }, 10);

        // Add victory style
        if (!document.querySelector('#victory-style')) {
            const victoryStyle = document.createElement('style');
            victoryStyle.id = 'victory-style';
            victoryStyle.innerHTML = `
                @keyframes victoryPulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.05); box-shadow: 0 0 40px rgba(0, 255, 136, 0.6); }
                    100% { transform: scale(1); }
                }
            `;
            document.head.appendChild(victoryStyle);
        }

        // Create celebration particles
        this.createCelebrationParticles();
    }

    createCelebrationParticles() {
        for (let i = 0; i < 10; i++) {
            const particle = document.createElement('div');
            particle.className = 'celebration-particle';
            particle.style.cssText = `
                position: absolute;
                width: 6px;
                height: 6px;
                background: ${this.getRandomColor()};
                border-radius: 50%;
                pointer-events: none;
                z-index: 1000;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: celebrate 1s ease-out forwards;
            `;

            document.body.appendChild(particle);

            setTimeout(() => {
                particle.remove();
            }, 1000);
        }

        // Add celebration animation
        if (!document.querySelector('#celebration-style')) {
            const celebrationStyle = document.createElement('style');
            celebrationStyle.id = 'celebration-style';
            celebrationStyle.innerHTML = `
                @keyframes celebrate {
                    0% {
                        transform: translateY(0) scale(0);
                        opacity: 1;
                    }
                    50% {
                        transform: translateY(-50px) scale(1);
                        opacity: 1;
                    }
                    100% {
                        transform: translateY(-100px) scale(0);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(celebrationStyle);
        }
    }

    getRandomColor() {
        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    showError(message) {
        const originalValue = this.display.value;
        this.display.value = message;
        this.display.style.color = '#ff6b6b';
        
        setTimeout(() => {
            this.display.value = originalValue;
            this.display.style.color = '#40e0ff';
        }, 2000);

        // Error animation
        const calculator = document.querySelector('.calculator');
        calculator.style.animation = 'shake 0.5s ease-in-out';
        
        setTimeout(() => {
            calculator.style.animation = '';
        }, 500);

        // Add shake animation
        if (!document.querySelector('#shake-style')) {
            const shakeStyle = document.createElement('style');
            shakeStyle.id = 'shake-style';
            shakeStyle.innerHTML = `
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                    20%, 40%, 60%, 80% { transform: translateX(5px); }
                }
            `;
            document.head.appendChild(shakeStyle);
        }
    }

    addToHistory(calculation) {
        this.history.push({
            calculation,
            timestamp: new Date().toLocaleString('ar-EG')
        });

        // Keep only last 10 calculations
        if (this.history.length > 10) {
            this.history.shift();
        }

        console.log('History:', this.history);
    }

    // Easter Egg: Konami Code
    initializeEasterEgg() {
        const konamiCode = [
            'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
            'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
            'KeyB', 'KeyA'
        ];
        let konamiIndex = 0;

        document.addEventListener('keydown', (e) => {
            if (e.code === konamiCode[konamiIndex]) {
                konamiIndex++;
                if (konamiIndex === konamiCode.length) {
                    this.activateEasterEgg();
                    konamiIndex = 0;
                }
            } else {
                konamiIndex = 0;
            }
        });
    }

    activateEasterEgg() {
        // Matrix effect
        this.createMatrixRain();
        
        // Change calculator theme temporarily
        const calculator = document.querySelector('.calculator');
        calculator.style.background = 'linear-gradient(145deg, #000000, #001100)';
        calculator.style.boxShadow = '0 25px 50px rgba(0, 255, 0, 0.3)';
        
        this.display.style.color = '#00ff00';
        this.display.value = 'MATRIX MODE ACTIVATED';

        setTimeout(() => {
            // Reset after 5 seconds
            calculator.style.background = '';
            calculator.style.boxShadow = '';
            this.display.style.color = '#40e0ff';
            this.display.value = '0';
            document.querySelectorAll('.matrix-char').forEach(char => char.remove());
        }, 5000);
    }

    createMatrixRain() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()';
        
        for (let i = 0; i < 50; i++) {
            const char = document.createElement('div');
            char.className = 'matrix-char';
            char.textContent = chars[Math.floor(Math.random() * chars.length)];
            char.style.cssText = `
                position: fixed;
                color: #00ff00;
                font-family: 'Courier New', monospace;
                font-size: 14px;
                left: ${Math.random() * 100}vw;
                top: -20px;
                z-index: 1000;
                pointer-events: none;
                animation: matrixFall ${3 + Math.random() * 3}s linear infinite;
            `;

            document.body.appendChild(char);
        }

        // Add matrix animation
        if (!document.querySelector('#matrix-style')) {
            const matrixStyle = document.createElement('style');
            matrixStyle.id = 'matrix-style';
            matrixStyle.innerHTML = `
                @keyframes matrixFall {
                    0% { transform: translateY(-20px); opacity: 1; }
                    100% { transform: translateY(100vh); opacity: 0; }
                }
            `;
            document.head.appendChild(matrixStyle);
        }
    }

    // Advanced features
    enableAdvancedMode() {
        // Add scientific calculator functions
        this.addScientificFunctions();
        
        // Add memory functions
        this.memory = 0;
        this.addMemoryFunctions();
    }

    addScientificFunctions() {
        // This would add sin, cos, tan, log, etc.
        // Implementation would require expanding the UI
    }

    addMemoryFunctions() {
        // Memory store, recall, clear functions
        this.memoryStore = () => {
            this.memory = parseFloat(this.display.value) || 0;
        };

        this.memoryRecall = () => {
            this.display.value = String(this.memory);
        };

        this.memoryClear = () => {
            this.memory = 0;
        };
    }
}

// Initialize calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const calculator = new AdvancedCalculator();
    
    // Enable easter egg
    calculator.initializeEasterEgg();
    
    // Add welcome message
    setTimeout(() => {
        console.log(`
╔══════════════════════════════════╗
║        CALCULATOR PRO v2.0       ║
║     المطور: Claude Assistant     ║
║   تم التطوير بتقنيات متطورة       ║
╚══════════════════════════════════╝

المميزات:
✓ تصميم ثلاثي الأبعاد
✓ تأثيرات صوتية
✓ دعم لوحة المفاتيح
✓ رسوم متحركة متقدمة
✓ أكواد سرية (جرب Konami Code!)

استمتع بالحاسبة! 🚀
        `);
    }, 2000);
});

// Service Worker registration for PWA capabilities
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Add touch gestures for mobile
class TouchGestureHandler {
    constructor() {
        this.startX = 0;
        this.startY = 0;
        this.endX = 0;
        this.endY = 0;
        
        this.addTouchListeners();
    }

    addTouchListeners() {
        const calculator = document.querySelector('.calculator');
        
        calculator.addEventListener('touchstart', (e) => {
            this.startX = e.touches[0].clientX;
            this.startY = e.touches[0].clientY;
        });

        calculator.addEventListener('touchend', (e) => {
            this.endX = e.changedTouches[0].clientX;
            this.endY = e.changedTouches[0].clientY;
            this.handleGesture();
        });
    }

    handleGesture() {
        const deltaX = this.endX - this.startX;
        const deltaY = this.endY - this.startY;

        // Swipe right to clear
        if (deltaX > 50 && Math.abs(deltaY) < 50) {
            document.querySelector('[data-action="clear"]').click();
        }
        
        // Swipe left to delete
        if (deltaX < -50 && Math.abs(deltaY) < 50) {
            document.querySelector('[data-action="delete"]').click();
        }
    }
}

// Initialize touch gestures on mobile
if ('ontouchstart' in window) {
    new TouchGestureHandler();
}