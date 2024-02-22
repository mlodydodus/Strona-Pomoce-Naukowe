document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registrationForm');
    const successMessage = document.getElementById('successMessage');
    
    form.addEventListener('submit', function(event) {
        event.preventDefault();

        // Pobierz dane z formularza
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Wysyłanie danych na serwer za pomocą fetch
        fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password }),
        })
        .then(response => {
            if (response.ok) {
                // Przekieruj użytkownika na stronę logowania po pomyślnym zarejestrowaniu
                window.location.href = '/login';
            } else {
                throw new Error('Wystąpił błąd podczas rejestracji.');
            }
        })
        .then(data => {
            // Wyświetl komunikat o pomyślnym zarejestrowaniu
            successMessage.innerText = 'Zarejestrowano pomyślnie!';
        })
        .catch(error => {
            console.error('Wystąpił błąd:', error);
            // Wyświetl komunikat o błędzie
            successMessage.innerText = 'Wystąpił błąd podczas rejestracji.';
        });
    });
});
