document.addEventListener('DOMContentLoaded', function() {
    // Pobierz element messageDiv
    const messageDiv = document.getElementById('messageDiv');

    // Sprawdź stan logowania użytkownika
    fetch('/checkLogin')
        .then(response => {
            if (!response.ok) {
                throw new Error('Nie można sprawdzić stanu logowania użytkownika');
            }
            return response.json();
        })
        .then(data => {
            // Jeśli użytkownik jest zalogowany, wyświetl komunikat
            if (data.loggedIn) {
                messageDiv.textContent = 'Jesteś zalogowany. Możesz teraz przejść do modułu.';
            } else {
                // Jeśli użytkownik nie jest zalogowany, wyświetl komunikat o konieczności zalogowania
                messageDiv.textContent = 'Aby przejść do modułu, musisz być zalogowany.';
            }
        })
        .catch(error => {
            console.error('Wystąpił błąd:', error);
        });
});
