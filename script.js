const daysData = [
    {
        name: 'Rose Day',
        image: 'images/1.jpg',
        message: 'Happy Rose Day, my love! 🌹 A little surprise is waiting for you… something small, something red, something hidden where you least expect but always carry. 😉 Find it and know that just like this rose, my love for you is always there, even when you’re not looking! ❤️'  
    },
    {
        name: 'Propose Day',
        image: 'images/2.jpg',
        message: 'Will you be my girlfriend? ❤️',
        isProposal: true
    },
    {
        name: 'Chocolate Day',
        image: 'images/3.jpg',
        message: 'Thanks for the confirmation, chocolate is on the way. <br>Ayyadaaaa<br>Daily gift thannale my GF, baaki you know right. 😏<br><br>But Ichayan have another puzzle for you - <a href="choco.html" style="color: #ff4081; text-decoration: underline;">Click here!</a>'
    },
    {
        name: 'Teddy Day',
        image: 'images/4.jpg',
        message: 'The cutest girl with the darkest dark circles and the most expressive eyes—there couldn’t be a better Teddy Day surprise for you. But to unwrap it, you’ve got to solve a little puzzle first. <a href="walk/index.html" style="color: #ff4081; text-decoration: underline;">Click here!</a>'
    },
    {
        name: 'Promise Day',
        image: 'images/5.jpg',
        message: 'I, Mohammed Aslam, hereby solemnly promise to:\n\n1. Love you unconditionally\n2. Always make you smile\n3. Be your strength in tough times\n4. Never give up on us\n5. Keep you happy forever\n\nSigned with love ❤️'
    },
    {
        name: 'Hug Day',
        image: 'images/6.jpg',
        message: 'Your warmth is worth the wait, and no words can ever express how much comfort I find in your embrace. Can\'t wait to hug you tight! 🤗'
    },
    {
    name: 'Kiss Day',
    image: 'images/7.jpg',
    message: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d560.3157030558277!2d72.90082917353578!3d19.13660074197894!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7b96d7342853b%3A0x8f9b53237b3212ed!2sIIM%20Mumbai%20Campus%20Entry%20Gate!5e0!3m2!1sen!2sin!4v1738887225051!5m2!1sen!2sin" width="400" height="300" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>'
    },
    {
        name: 'Valentine\'s Day',
        image: 'images/8.jpg',
        message: 'My dearest Deeputy,\n\nWords fall short when I try to express how much you mean to me. Every moment spent with you is a treasure, every smile of yours lights up my world. You\'re not just my love, you\'re my best friend, my strength, my inspiration.\n\nI want to spend eternity with you, growing old together, creating countless memories, and falling in love with you more each day. You make my life complete, and I promise to always be there for you, through thick and thin.\n\nI love you more than words can express.\n\nForever yours,\nAslam ❤️'
    }
];

const DEV_MODE = false;  // Set this to false when you want to enable timer/locks

function createDayCards() {
    const grid = document.querySelector('.days-grid');
    const today = new Date();
    
    daysData.forEach((day, index) => {
        const cardDate = new Date(2025, 1, 7 + index); // Feb 7-14, 2025
        const isActive = DEV_MODE ? true : today >= cardDate;
        
        const card = document.createElement('div');
        card.className = `day-card ${isActive ? 'active' : ''}`;
        card.innerHTML = `
            <h3>${day.name}</h3>
            <img src="${day.image}" alt="${day.name}">
        `;

        if (!DEV_MODE && !isActive) {
            const timeUntil = getTimeUntil(cardDate);
            const lockOverlay = document.createElement('div');
            lockOverlay.className = 'lock-overlay';
            lockOverlay.innerHTML = `
                <i class="fas fa-lock"></i>
                <div>Locked</div>
                <div class="countdown">${timeUntil}</div>
            `;
            card.appendChild(lockOverlay);

            // Update countdown every second
            setInterval(() => {
                const newTimeUntil = getTimeUntil(cardDate);
                lockOverlay.querySelector('.countdown').textContent = newTimeUntil;
            }, 1000);
        } else {
            card.addEventListener('click', () => showMessage(day));
        }

        grid.appendChild(card);
    });
}

function getTimeUntil(date) {
    const now = new Date();
    const diff = date - now;

    if (diff <= 0) return 'Available now!';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return `Unlocks in: ${days}d ${hours}h ${minutes}m ${seconds}s`;
}

function showMessage(day) {
    const modal = document.getElementById('modal');
    const modalText = document.getElementById('modal-text');
    const buttonContainer = document.getElementById('button-container');

    let yesStages = [
        "Are you sure? 🧐",
        "Are you suuuure? 🤨",
        "Are you sure sure? 😏",
        "Final answer? Locking it in forever! 🔒💕",
        "YAAAAAY! I LOVE YOUUUU BABYYYY! UMMAAAAAAAA! 🎉💖"
    ];
    
    let yesIndex = 0;

    function handleYesClick() {
        if (yesIndex < yesStages.length - 1) {
            modalText.innerHTML = yesStages[yesIndex];
            yesIndex++;
        } else {
            showCelebration(yesStages[yesIndex]);
            launchConfetti();
        }
    }

    modalText.innerHTML = day.message;
    buttonContainer.innerHTML = '';

    if (day.isProposal) {
        const yesBtn = document.createElement('button');
        yesBtn.className = 'choice-btn yes-btn';
        yesBtn.textContent = 'Yes';
        let hoverTries = 0;

        yesBtn.onmouseover = function () {
            if (hoverTries < 3) {
                let randomX = Math.random() * 200 - 100;
                let randomY = Math.random() * 100 - 50;
                yesBtn.style.transform = `translate(${randomX}px, ${randomY}px)`;
                hoverTries++;
            } else {
                yesBtn.onmouseover = null;  // Stop running away after 3 hovers
            }
        };

        yesBtn.onclick = handleYesClick;

        const noBtn = document.createElement('button');
        noBtn.className = 'choice-btn no-btn';
        noBtn.textContent = 'No';
        let noStages = [
            "Wait, think again... Sure? 🤨",
            "Really sure? Last chance to escape... 😏",
            "Too bad, you’re stuck! Muah 😘"
        ];
        
        let noIndex = 0;
        
        noBtn.onclick = () => {
            if (noIndex < noStages.length - 1) {
                modalText.innerHTML = noStages[noIndex];
                noIndex++;
            } else {
                showCelebration(noStages[noIndex]);
                launchConfetti();
            }
        };
        

        buttonContainer.appendChild(yesBtn);
        buttonContainer.appendChild(noBtn);
    }

    modal.style.display = 'flex';
}

// Confetti Effect on Final Yes
function launchConfetti() {
    const duration = 2 * 1000;
    const end = Date.now() + duration;
    const colors = ['#ff6b6b', '#f06292', '#ff4081', '#ff1744'];

    (function frame() {
        confetti({
            particleCount: 5,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: colors
        });
        confetti({
            particleCount: 5,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: colors
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    })();
}


function showCelebration(text) {
    const celebration = document.getElementById('celebration');
    celebration.textContent = text;
    setTimeout(() => {
        celebration.textContent = "Wait… don’t you want your surprise? 🤔";
        setTimeout(() => {
            celebration.textContent = "Ayyada! Daily gift kodtha, the kollamkari in my GF will vadhikal me! 😂";

                setTimeout(() => {
                    celebration.innerHTML = 'But still… Ichayan always surprises no? 😏 <a href="jigsaw.html" style="color: #ff4081; text-decoration: underline; cursor: pointer;">Click here!</a>';
                }, 5000);  // Increased delay to 2s
            }, 5000);  // Increased delay to 2s
        }, 3000);  // Increased delay to 2s

    
    
    
    
    celebration.style.display = 'block';
    
   
}



document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("jigsaw-container").classList.add("hidden");
});


// Close modal when clicking the close button
document.querySelector('.close-modal').addEventListener('click', () => {
    document.getElementById('modal').style.display = 'none';
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    const modal = document.getElementById('modal');
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

// Create floating hearts animation
function createHeart() {
    const heart = document.createElement('div');
    heart.className = 'heart';
    heart.innerHTML = '❤️';
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.animationDuration = Math.random() * 3 + 2 + 's';
    document.querySelector('.floating-hearts').appendChild(heart);

    setTimeout(() => {
        heart.remove();
    }, 5000);
}

// Create hearts frequently
setInterval(createHeart, 100);


const names = [
"Deeeeepuuuuuuseeeee",
"deeeeeeeeepuutty",
"deeeepthiiiii",
"Deeeeeepuuuu",
"kunjaaaaaaa",
"cutieeee",
"deeepthijiiiiii",
"kutti deeepuuu"
];

let currentNameIndex = 0;
const textElement = document.getElementById('dynamic-text');
let interval = 2000; // 1.5 seconds

function scrambleText(finalText) {
const chars = '!@#$%^&*ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
let iterations = 0;
const maxIterations = 10;

const scramble = setInterval(() => {
textElement.innerText = finalText
    .split('')
    .map((letter, index) => {
        if(index < iterations) {
            return finalText[index];
        }
        return chars[Math.floor(Math.random() * chars.length)];
    })
    .join('');

iterations += 1/3;

if(iterations >= maxIterations) {
    clearInterval(scramble);
    textElement.innerText = finalText;
}
}, 30);
}

function updateText() {
scrambleText(names[currentNameIndex]);
currentNameIndex = (currentNameIndex + 1) % names.length;
}

updateText();
setInterval(updateText, interval);

// Initialize the cards
createDayCards();