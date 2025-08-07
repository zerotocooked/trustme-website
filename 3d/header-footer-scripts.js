// Header scroll effect
function initHeaderScroll() {
    const header = document.querySelector('header');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }
    });
}

// Mobile menu toggle
function initMobileMenu() {
    const menuBtn = document.getElementById('menuBtn');
    const closeMenu = document.getElementById('closeMenu');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuLinks = mobileMenu.querySelectorAll('a');

    menuBtn.addEventListener('click', () => {
        mobileMenu.style.display = 'block';
        setTimeout(() => {
            mobileMenu.classList.add('active');
        }, 10);
    });

    closeMenu.addEventListener('click', closeMobileMenu);

    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    function closeMobileMenu() {
        mobileMenu.classList.remove('active');
        setTimeout(() => {
            mobileMenu.style.display = 'none';
        }, 500);
    }
}

// Promo banner
function initPromoBanner() {
    const promoPopup = document.getElementById('promoPopup');
    const closePromo = document.getElementById('closePromo');

    // Show promo banner after 3 seconds
    setTimeout(() => {
        promoPopup.classList.add('active');
    }, 1500);

    closePromo.addEventListener('click', () => {
        promoPopup.classList.remove('active');
        promoPopup.classList.add('hidden');
    });
}

// Add smooth scrolling for anchor links
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();

            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80, // Adjust for header height
                    behavior: 'smooth'
                });
            }
        });
    });
}
// Live chat functionality
function initLiveChat() {
    const liveChatBtn = document.getElementById('liveChatBtn');
    const closeChat = document.getElementById('closeChat');
    const chatPopup = document.getElementById('chatPopup');
    const chatInput = document.getElementById('chatInput');
    const sendChat = document.getElementById('sendChat');
    const chatMessages = document.getElementById('chatMessages');

    liveChatBtn.addEventListener('click', () => {
        chatPopup.style.display = 'block';
        setTimeout(() => {
            chatPopup.classList.add('active');
        }, 10);
    });

    closeChat.addEventListener('click', () => {
        chatPopup.classList.remove('active');
        setTimeout(() => {
            chatPopup.style.display = 'none';
        }, 300);
    });

    sendChat.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    function sendMessage() {
        const message = chatInput.value.trim();
        if (message) {
            // Add user message
            chatMessages.innerHTML += `
            <div class="chat-message mb-4 flex justify-end">
                <div class="bg-pink-500 text-white p-3 rounded-lg inline-block max-w-[80%]">
                    <p>${message}</p>
                </div>
            </div>
        `;

            chatInput.value = '';
            chatMessages.scrollTop = chatMessages.scrollHeight;

            // Simulate response after a short delay
            setTimeout(() => {
                chatMessages.innerHTML += `
                <div class="chat-message mb-4">
                    <div class="bg-pink-100 p-3 rounded-lg inline-block max-w-[80%]">
                        <p class="text-gray-800">Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất có thể.</p>
                    </div>
                </div>
            `;
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }, 1000);
        }
    }
}
// Initialize header and footer functionality
document.addEventListener('DOMContentLoaded', function() {
    initHeaderScroll();
    initMobileMenu();
    initPromoBanner();
    initSmoothScroll();
    initLiveChat();
});