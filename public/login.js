document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('loginForm');
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');
    const emailInput = document.getElementById('loginEmail');
    const passwordInput = document.getElementById('loginPassword');

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        // Pobierz dane z formularza
        const email = emailInput.value;
        const password = passwordInput.value;

        // Wysyłanie danych na serwer za pomocą fetch
        fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        })
        .then(response => {
            if (response.ok) {
                // Przekierowanie na stronę główną po zalogowaniu
                setTimeout(function() {
                    window.location.href = '/#home';
                }, 1000); // Opóźnienie ustawione na 1 sekundę

                // Pokaż komunikat o pomyślnym zalogowaniu
                successMessage.innerText = 'Zalogowano pomyślnie!';
                successMessage.style.color = 'green';
                successMessage.style.display = 'block'; // Pokazujemy komunikat

                // Wyczyść pole email i hasło po zalogowaniu
                emailInput.value = '';
                passwordInput.value = '';
            } else {
                // Wyświetl komunikat o błędzie logowania
                errorMessage.innerText = 'Nieprawidłowy email lub hasło';
                errorMessage.style.color = 'red';
                errorMessage.style.display = 'block';

                // Ukryj komunikat o błędzie po 2 sekundach
                setTimeout(function() {
                    errorMessage.style.display = 'none';
                }, 2000);

                // Wyczyść pole hasła po błędnym logowaniu
                passwordInput.value = '';
            }
        })
        .catch(error => {
            console.error('Wystąpił błąd:', error);
            // Wyświetl komunikat o błędzie podczas logowania
            errorMessage.innerText = 'Wystąpił błąd podczas logowania.';
            errorMessage.style.color = 'red';
            errorMessage.style.display = 'block';

            // Ukryj komunikat o błędzie po 2 sekundach
            setTimeout(function() {
                errorMessage.style.display = 'none';
            }, 2000);
        });
    });
});


