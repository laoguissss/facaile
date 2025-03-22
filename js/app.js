// 全局状态管理
let isRunning = false;
let timer = null;
let startTime = 0;
let totalEarned = 0;
let lastHundred = 0;

function init() {
    document.getElementById('currency').addEventListener('change', updateCurrencyUnit);
    
    const savedBg = localStorage.getItem('background');
    if(savedBg) {
        document.getElementById('background-container').style.backgroundImage = `url(${savedBg})`;
    }

    document.getElementById('bg-upload').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(e) {
            localStorage.setItem('background', e.target.result);
            document.getElementById('background-container').style.backgroundImage = `url(${e.target.result})`;
        }
        reader.readAsDataURL(file);
    });
}

function startTimer() {
    if (!isRunning) {
        isRunning = true;
        startTime = Date.now();
        totalEarned = 0;
        lastHundred = 0;
        timer = setInterval(updateDisplay, 1000);
        document.getElementById('start-btn').disabled = true;
    }
}

function updateDisplay() {
    const currentTime = Date.now();
    const elapsed = currentTime - startTime;
    
    const hours = Math.floor(elapsed / 3600000);
    const minutes = Math.floor((elapsed % 3600000) / 60000);
    const seconds = Math.floor((elapsed % 60000) / 1000);
    document.getElementById('time-display').textContent = 
        `计时：${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    const salary = document.getElementById('salary').value || 0;
    const workdays = Math.max(1, Math.min(31, document.getElementById('workdays').value || 22));
    const dailyHours = Math.max(1, Math.min(24, document.getElementById('dailyHours').value || 8));
    const hourly = salary / workdays / dailyHours;
    const perSecond = hourly / 3600;
    totalEarned += perSecond;

    const converted = convertCurrency(totalEarned);
    document.getElementById('money-display').innerHTML = 
        `${converted.toFixed(2)} <small id="currency-unit">${document.getElementById('currency').value === 'CNY' ? '元' : '美元'}</small>`;
}

function updateCurrencyUnit() {
    document.getElementById('currency-unit').textContent = 
        document.getElementById('currency').value === 'CNY' ? '元' : '美元';
    if(isRunning) updateDisplay();
}

function convertCurrency(amount) {
    return document.getElementById('currency').value === 'CNY' ? 
        amount : 
        amount / 6.5;
}

// 应用初始化
init();