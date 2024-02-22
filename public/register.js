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
                // Wyświetl komunikat o pomyślnym zarejestrowaniu
                successMessage.innerText = 'Zarejestrowano pomyślnie!';
                // Wyśrodkuj komunikat
                successMessage.style.display = 'block';
                // Opóźnij przekierowanie na stronę logowania po wyświetleniu komunikatu
                setTimeout(() => {
                    window.location.href = '/login';
                }, 2000); // Opóźnienie przekierowania wynosi 2000 milisekund (2 sekundy)
            } else {
                throw new Error('Wystąpił błąd podczas rejestracji.');
            }
        })
        .catch(error => {
            console.error('Wystąpił błąd:', error);
            // Wyświetl komunikat o błędzie
            successMessage.innerText = 'Wystąpił błąd podczas rejestracji.';
        });
    });
});
