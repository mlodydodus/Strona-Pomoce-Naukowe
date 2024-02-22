const express = require('express');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const bodyParser = require('body-parser');
const userData = require('./public/data.json');
const session = require('express-session');
const fsExtra = require('fs-extra');
const nodemailer = require('nodemailer');


const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  // Wysyłanie pliku index.html z głównego katalogu
  res.sendFile(path.join(__dirname, 'index.html'));
});

//REJESTRACJA!!!

// Trasa dla strony rejestracji (GET)
app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

// Trasa dla przetwarzania danych rejestracji (POST)
app.post('/register', (req, res) => {
  const { name, email, password } = req.body;

  // Generowanie unikalnego ID
  const id = uuidv4();

  // Pobierz aktualne dane z pliku data.json
  fs.readFile(path.join(__dirname, 'public', 'data.json'), (err, data) => {
    if (err) {
      console.error('Błąd podczas odczytu danych:', err);
      return res.status(500).send('Wystąpił błąd podczas rejestracji.');
    }

    // Parsowanie danych z pliku JSON
    const users = JSON.parse(data);

    // Dodaj nowego użytkownika do tablicy
    users.push({ id, name, email, password });

    // Zapisz zaktualizowane dane do pliku data.json
    fs.writeFile(path.join(__dirname, 'public', 'data.json'), JSON.stringify(users), err => {
      if (err) {
        console.error('Błąd podczas zapisywania danych:', err);
        return res.status(500).send('Wystąpił błąd podczas rejestracji.');
      }
      console.log('Dane zapisane pomyślnie.');
      res.status(200).json({ message: 'Zarejestrowano pomyślnie!', userId: id });
    });
  });
});


//LOGOWANIE!!!

// Ustawienia middleware dla sesji
app.use(session({
  secret: 'mojeTajneHasło',
  resave: false,
  saveUninitialized: true
}));

// Middleware do obsługi danych z formularzy
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Trasa dla strony logowania (GET)
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Trasa dla przetwarzania danych logowania (POST)
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const filePath = path.join(__dirname, 'public', 'data.json');

  // Odczytaj dane z pliku data.json
  fs.readFile(filePath, (err, data) => {
      if (err) {
          console.error('Błąd podczas odczytu danych:', err);
          return res.status(500).send('Wystąpił błąd podczas logowania.');
      }

      // Parsowanie danych z pliku JSON
      const users = JSON.parse(data);

      // Sprawdzenie, czy istnieje użytkownik o podanym emailu i haśle
      const user = users.find(user => user.email === email && user.password === password);

      if (user) {
          // Zapisz informacje o zalogowanym użytkowniku w sesji
          req.session.user = user;

          // Jeśli użytkownik istnieje, wysyłamy komunikat o poprawnym logowaniu
          res.status(200).send('Zalogowano pomyślnie!');
      } else {
          // Jeśli użytkownik nie istnieje, wysyłamy komunikat o błędnych danych logowania
          res.status(401).send('Nieprawidłowy email lub hasło.');
      }
  });
});

// Trasa dla pobrania danych zalogowanego użytkownika
app.get('/userData', (req, res) => {
  // Sprawdź, czy użytkownik jest zalogowany
  if (req.session && req.session.user) {
    // Jeśli zalogowany, zwróć dane użytkownika z sesji
    res.json(req.session.user);
  } else {
    // Jeśli niezalogowany, zwróć odpowiedni status i komunikat
    res.status(401).send('Nie jesteś zalogowany');
  }
});

// WYLOGOWYWANIE 
// Trasa dla wylogowywania (POST)
app.post('/logout', (req, res) => {
  // Usunięcie danych sesji
  req.session.destroy(err => {
      if (err) {
          console.error('Błąd podczas wylogowywania:', err);
          res.status(500).send('Błąd podczas wylogowywania');
      } else {
          res.redirect('/'); // Przekierowanie na stronę główną po wylogowaniu
      }
  });
});


// ZABEZPIECZENIE MODUŁÓW

// Obsługa trasy /checkLogin

app.get('/checkLogin', (req, res) => {
  // Sprawdzenie, czy użytkownik jest zalogowany na podstawie danych sesji
  if (req.session.user) {
    // Jeśli użytkownik jest zalogowany, zwracamy odpowiedź zalogowany: true
    res.json({ loggedIn: true });
  } else {
    // Jeśli użytkownik nie jest zalogowany, zwracamy odpowiedź zalogowany: false
    res.json({ loggedIn: false });
  }
});

// Middleware do sprawdzania stanu logowania
function requireLogin(req, res, next) {
  // Wykonaj zapytanie do /checkLogin, aby sprawdzić, czy użytkownik jest zalogowany
  fetch('/checkLogin')
      .then(response => {
          if (!response.ok) {
              throw new Error('Nie udało się sprawdzić stanu logowania');
          }
          return response.json();
      })
      .then(data => {
          // Sprawdź, czy użytkownik jest zalogowany
          if (data.loggedIn) {
              // Jeśli użytkownik jest zalogowany, kontynuuj
              next();
          } else {
              // Jeśli użytkownik nie jest zalogowany, przekieruj go do strony logowania
              res.redirect('/login');
          }
      })
      .catch(error => {
          console.error('Wystąpił błąd:', error);
          // Jeśli wystąpił błąd, przekieruj użytkownika do strony logowania
          res.redirect('/login');
      });
}

// Lista przedmiotów i klas
const subjects = ['Matematyka', 'Nauki_przyrodnicze', 'Jezyk_polski']; 
const classes = ['4', '5', '6', '7', '8']; 

// Zabezpieczanie tras dla wszystkich kombinacji przedmiotów i klas
subjects.forEach(subject => {
classes.forEach(klass => {
    const path = `/${subject}_klasa_${klass}.html`;
    app.get(path, requireLogin, (req, res) => {
        // Obsługa trasy
        res.sendFile(path.join(__dirname, 'public', path)); 
    });
});
});

// DODAWANIE MATERIAŁU !!!

app.use(express.static('public'));
app.use(express.json());

// Endpoint dla pobierania materiałów
app.get('/materials', (req, res) => {
  fs.readFile('./public/material.json', (err, data) => {
    if (err) {
      console.error('Błąd odczytu pliku material.json:', err);
      res.status(500).send('Wystąpił błąd podczas odczytu pliku material.json');
      return;
    }
    res.json(JSON.parse(data));
  });
});

// Endpoint dla dodawania materiałów
app.post('/materials', (req, res) => {
  const { title, link, classId, sectionId } = req.body;
  const filePath = './public/material.json';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      console.error('Błąd odczytu pliku material.json:', err);
      res.status(500).send('Wystąpił błąd podczas odczytu pliku material.json');
      return;
    }

    let materials = JSON.parse(data);

    // Sprawdzenie czy istnieje sekcja dla danej klasy
    if (!materials[classId]) {
      materials[classId] = { materials: [], videos: [], tests: [] };
    }

    // Dodanie nowego materiału do odpowiedniej sekcji
    materials[classId][sectionId].push({ title, link });

    fs.writeFile(filePath, JSON.stringify(materials), (err) => {
      if (err) {
        console.error('Błąd zapisu do pliku material.json:', err);
        res.status(500).send('Wystąpił błąd podczas zapisu do pliku material.json');
        return;
      }
      console.log('Materiał został dodany pomyślnie.');
      res.status(200).send('Materiał został dodany pomyślnie.');
    });
  });
});


// IMEJL !!!

// Middleware do parsowania danych z formularza
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Endpoint do obsługi formularza kontaktowego (GET)
app.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Endpoint do obsługi wysyłki e-maila
app.post('/send-email', (req, res) => {
  const { name, email, message } = req.body;

  // Konfiguracja transportera e-mail
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'formularztestowy@gmail.com', 
      pass: 'dominik00' //
    }
  });

  // Tworzenie wiadomości e-mail
  const mailOptions = {
    from: email,
    to: 'formularztestowy@gmail.com', // Adres e-mail, na który ma być wysłana wiadomość
    subject: 'Wiadomość z formularza kontaktowego',
    text: `Imię: ${name}\nEmail: ${email}\nWiadomość: ${message}`
  };

  // Wysłanie wiadomości e-mail
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Błąd podczas wysyłania e-maila:', error);
      res.status(500).send('Wystąpił błąd podczas wysyłania wiadomości.');
    } else {
      console.log('Wiadomość e-mail została pomyślnie wysłana:', info.response);
      res.status(200).send('Wiadomość została pomyślnie wysłana.');
    }
  });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serwer nasłuchuje na porcie ${PORT}`);
});


