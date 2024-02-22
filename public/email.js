document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contact-form');
  
    form.addEventListener('submit', function(event) {
      event.preventDefault(); // Zapobiegamy domyślnej akcji formularza
  
      const formData = new FormData(form);
  
      // Wysłanie danych formularza do serwera za pomocą fetch
      fetch('/send-email', {
        method: 'POST',
        body: formData
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Wystąpił problem podczas wysyłania wiadomości.');
        }
        console.log('Wiadomość została pomyślnie wysłana.');
        // Tutaj możesz dodać kod do obsługi komunikatu po pomyślnym wysłaniu wiadomości
      })
      .catch(error => {
        console.error('Błąd podczas wysyłania wiadomości:', error);
        // Tutaj możesz dodać kod do obsługi błędu
      });
    });
  });