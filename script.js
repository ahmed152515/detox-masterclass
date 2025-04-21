document.addEventListener('DOMContentLoaded', function() {
    // Countdown Timer
    const classDate = new Date('May 3, 2025 20:00:00').getTime();
    
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = classDate - now;
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        document.getElementById('days').textContent = days.toString().padStart(2, '0');
        document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
        document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
        document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
        
        if (distance < 0) {
            clearInterval(countdownInterval);
            document.querySelector('.countdown-timer').innerHTML = '<h3>Class has started!</h3>';
        }
    }
    
    // Update countdown every second
    const countdownInterval = setInterval(updateCountdown, 1000);
    updateCountdown(); // Initial call

    // Form handling
    const form = document.getElementById('registrationForm');
    const thankYouMessage = document.getElementById('thankYouMessage');
    const whatsappLink = document.getElementById('whatsappLink');

    // Replace with your actual WhatsApp group link
    const WHATSAPP_GROUP_LINK = 'https://chat.whatsapp.com/your-group-link';

    // Handle form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Collect form data
        const formData = new FormData(form);
        const data = {};
        formData.forEach((value, key) => {
            if (key === 'healthIssues') {
                if (!data[key]) {
                    data[key] = [];
                }
                data[key].push(value);
            } else {
                data[key] = value;
            }
        });

        // Store form data in localStorage for after payment
        localStorage.setItem('registrationData', JSON.stringify(data));

        // Show payment section
        document.getElementById('paymentSection').scrollIntoView({ behavior: 'smooth' });
    });

    // Check for payment completion
    function checkPaymentStatus() {
        // In a real implementation, you would check with your backend
        // For now, we'll assume payment is successful when user returns to the page
        const registrationData = localStorage.getItem('registrationData');
        if (registrationData) {
            showThankYouMessage();
            localStorage.removeItem('registrationData');
        }
    }

    // Check payment status when page loads
    checkPaymentStatus();

    function showThankYouMessage() {
        form.style.display = 'none';
        thankYouMessage.style.display = 'block';
        whatsappLink.href = WHATSAPP_GROUP_LINK;
    }
}); 