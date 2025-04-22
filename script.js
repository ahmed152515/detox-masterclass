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
    const submitBtn = document.getElementById('submitBtn');

    // WhatsApp Configuration
    const ADMIN_WHATSAPP = '919519931355'; // Admin number with country code
    const WHATSAPP_GROUP_LINK = 'https://chat.whatsapp.com/G1l9QpTXXmr9jWdrYi9w5v';

    // Format form data for WhatsApp
    function formatDataForWhatsApp(data) {
        let message = '🌿 *New Registration Details*\n\n';
        message += '------------------------\n';
        message += `*Name:* ${data.fullName}\n`;
        message += `*Mobile:* ${data.mobile}\n`;
        message += `*City:* ${data.city}\n`;
        message += `*Gender:* ${data.gender}\n`;
        message += `*Age Group:* ${data.ageGroup}\n\n`;
        
        message += '*Health Issues:*\n';
        if (Array.isArray(data.healthIssues)) {
            data.healthIssues.forEach(issue => {
                message += `- ${issue}\n`;
            });
        }
        
        if (data.otherIssues) {
            message += `\n*Other Issues:*\n${data.otherIssues}\n`;
        }
        
        message += `\n*Source:* ${data.source}\n`;
        message += '------------------------\n';
        message += '✅ Payment Completed\n';
        message += '✅ Added to WhatsApp Group';

        return encodeURIComponent(message);
    }

    // Handle form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Check if payment is completed
        if (!localStorage.getItem('paymentCompleted')) {
            // Show payment section
            document.getElementById('paymentSection').scrollIntoView({ behavior: 'smooth' });
            
            // Show payment required message
            const paymentMessage = document.createElement('div');
            paymentMessage.className = 'payment-required-message';
            paymentMessage.innerHTML = '<p style="color: #e74c3c; text-align: center; margin-top: 10px;">Please complete the payment to proceed with registration.</p>';
            
            // Remove any existing message
            const existingMessage = document.querySelector('.payment-required-message');
            if (existingMessage) {
                existingMessage.remove();
            }
            
            // Add the message after payment section
            document.getElementById('paymentSection').appendChild(paymentMessage);
            return;
        }

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

        // Show thank you message and group link
        showThankYouMessage();
    });

    // Handle payment completion
    function handlePaymentCompletion() {
        // Mark payment as completed
        localStorage.setItem('paymentCompleted', 'true');
        
        const registrationData = localStorage.getItem('registrationData');
        if (registrationData) {
            const data = JSON.parse(registrationData);
            
            // Send data to admin's WhatsApp
            const formattedMessage = formatDataForWhatsApp(data);
            const adminWhatsAppLink = `https://wa.me/${ADMIN_WHATSAPP}?text=${formattedMessage}`;
            
            // Open WhatsApp in new tab
            window.open(adminWhatsAppLink, '_blank');
            
            // Show thank you message and group link
            showThankYouMessage();
            
            // Clear stored data
            localStorage.removeItem('registrationData');
            localStorage.removeItem('paymentCompleted');
        }
    }

    // Add click handlers for payment buttons
    document.querySelectorAll('.pay-button').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Store payment method in localStorage
            localStorage.setItem('paymentMethod', this.textContent);
            
            // Store the current URL to return after payment
            localStorage.setItem('returnUrl', window.location.href);
            
            // Open payment link in new tab
            const paymentWindow = window.open(this.href, '_blank');
            
            // Check for payment completion every 2 seconds
            const paymentCheck = setInterval(() => {
                if (paymentWindow.closed) {
                    clearInterval(paymentCheck);
                    // Assume payment is completed when payment window is closed
                    handlePaymentCompletion();
                }
            }, 2000);
        });
    });

    function showThankYouMessage() {
        form.style.display = 'none';
        thankYouMessage.style.display = 'block';
        whatsappLink.href = WHATSAPP_GROUP_LINK;
        
        // Scroll to thank you message
        thankYouMessage.scrollIntoView({ behavior: 'smooth' });
    }

    // Check for payment completion when page loads
    if (localStorage.getItem('registrationData') && localStorage.getItem('paymentCompleted')) {
        handlePaymentCompletion();
    }
}); 