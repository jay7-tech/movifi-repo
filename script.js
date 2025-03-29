// Seat booking
function toggleSeat(seat) {
    seat.classList.toggle('selected');
}

function proceedToPayment() {
    alert("Redirecting to payment...");
    window.location.href = "payment.html";
}

// Payment
document.getElementById('paymentForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    alert("Payment successful! 🎉");
    window.location.href = "ticket.html";
});
