
window.addEventListener('scroll', function() {
  var nav = document.querySelector('nav');
  if (window.scrollY > 0) {
    nav.classList.add('fixed');
  } else {
    nav.classList.remove('fixed');
  }
});



document.addEventListener("DOMContentLoaded", function() {
  if (window.location.hash === "#strona-glowna") {
    // Pobierz element <body>
    var body = document.querySelector("body");
    // Przewiń stronę do góry
    body.scrollIntoView();
  }
});



document.addEventListener("DOMContentLoaded", function() {
  // element select
  var classSelect = document.getElementById("class-select");

  // zmiany wartości w elemencie select
  classSelect.addEventListener("change", function() {
    // Pobierz wartość wybranej klasy
    var selectedClass = classSelect.value;
    
    // Utwórz identyfikator dla wybranej klasy
    var classId = "Klasa-" + selectedClass;
    
    // Sprawdź, czy element z danym identyfikatorem istnieje
    var classElement = document.getElementById(classId);
    
    // Jeśli istnieje, przenieś do tego elementu
    if (classElement) {
      window.location.href = "#" + classId; // Przenieś do elementu za pomocą identyfikatora
    }
  });
});

document.addEventListener('DOMContentLoaded', function() {
  const subjectTiles = document.querySelectorAll('.subject-tile');
  const classSelect = document.getElementById('class-select');
  
  subjectTiles.forEach(function(tile) {
    tile.addEventListener('click', function(event) {
      event.preventDefault();
      const selectedClass = classSelect.value;
      const subject = this.dataset.subject;
      window.location.href = `${subject}_klasa_${selectedClass}.html`;
    });
  });
});

