function startTimer(duration, displayElement) {
    let timer = duration, minutes, seconds;
    
    const interval = setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        // Raqamlarni 01, 02 ko'rinishiga keltirish
        let minStr = minutes < 10 ? "0" + minutes : minutes.toString();
        let secStr = seconds < 10 ? "0" + seconds : seconds.toString();

        // Har bir raqamni span ichiga alohida joylashtirish
        displayElement.innerHTML = `
            <span>${minStr[0]}</span><span>${minStr[1]}</span>:<span>${secStr[0]}</span><span>${secStr[1]}</span>
        `;

        if (--timer < 0) {
            clearInterval(interval);
            // Taymer tugaganda nima bo'lishini shu yerga yozish mumkin
            displayElement.innerHTML = `<span>0</span><span>0</span>:<span>0</span><span>0</span>`;
        }
    }, 1000);
}

// Sahifa yuklanganda taymerni ishga tushirish
document.addEventListener('DOMContentLoaded', () => {
    const display = document.querySelector('.timer__text');
    const twoMinutes = 60 * 1 + 59; // 01:59 vaqtni soniyaga aylantirish
    startTimer(twoMinutes, display);
});