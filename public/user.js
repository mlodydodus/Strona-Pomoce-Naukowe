document.addEventListener('DOMContentLoaded', function() {
  const welcomeDiv = document.getElementById('welcome1');
  const loggedInUserName = document.getElementById('loggedInUserName');
  const logoutIcon = document.getElementById('logoutIcon');
  const authButtons = document.querySelector('.auth-buttons');

  // Funkcja sprawdzająca, czy użytkownik jest zalogowany
  function checkLoggedIn() {
      fetch('/userData') // Zapytanie o dane zalogowanego użytkownika
          .then(response => {
              if (!response.ok) {
                  throw new Error('Nie jesteś zalogowany');
              }
              return response.json();
          })
          .then(user => {
              // Wyświetlanie witaj i nazwy zalogowanego użytkownika
              loggedInUserName.textContent = 'Witaj, ' + user.name;
              welcomeDiv.style.display = 'block';
              logoutIcon.style.display = 'inline';
              
              // Ukrywanie przycisków zaloguj i zarejestruj
              authButtons.style.display = 'none';
          })
          .catch(error => {
              console.error('Wystąpił błąd:', error);
              
              // Wyświetlenie przycisków zaloguj i zarejestruj, jeśli użytkownik nie jest zalogowany
              authButtons.style.display = 'block';
          });
  }

  // Wywołanie funkcji sprawdzającej zalogowanie
  checkLoggedIn();

  // Obsługa wylogowywania
  logoutIcon.addEventListener('click', function() {
      fetch('/logout', {
          method: 'POST'
      })
      .then(response => {
          if (response.redirected) {
              window.location.href = response.url; // Przekierowanie na stronę główną po wylogowaniu
          }
      })
      .catch(error => {
          console.error('Wystąpił błąd:', error);
      });
  });
});
