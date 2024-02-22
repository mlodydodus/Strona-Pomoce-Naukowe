// Pobierz elementy formularza i grayboxa
var form = document.getElementById("materialForm");
var graybox = document.getElementById("graybox");
var openBtn = document.getElementById("openFormBtn");
var closeBtn = document.getElementById("closeFormBtn");

// Funkcja otwierająca graybox i formularz
function openForm() {
  graybox.style.display = "block";
  form.style.display = "block";
}

// Funkcja zamykająca graybox i formularz
function closeForm() {
  graybox.style.display = "none";
  form.style.display = "none";
}

// Przycisk otwierajacy formularz
openBtn.addEventListener("click", openForm);

// zamykajacy formularz
closeBtn.addEventListener("click", closeForm);

// Funkcja aktualizująca nazwę wybranego pliku
function updateFileName(input) {
  var fileNameElement = document.getElementById("fileName");
  fileNameElement.textContent = input.files[0].name;
}


document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('materialForm');

  form.addEventListener('submit', function(event) {
    event.preventDefault(); 

    // Pobieramy dane z formularza
    const materialType = document.getElementById('materialType').value;
    const materialTitle = document.getElementById('materialTitle').value;
    const materialLink = document.getElementById('materialURL').value;
    const classId = getClassIdFromPageName(); // classID z nazwy br. strony 
    let sectionId;

    if (materialType === 'pdf') {
      sectionId = 'materials';
    } else if (materialType === 'video') {
      sectionId = 'videos';
    } else if (materialType === 'test') {
      sectionId = 'tests';
    }

    addMaterial(materialTitle, materialLink, sectionId, classId);

    // Reset formularza
    form.reset();
  });

  function addMaterial(title, link, sectionId, classId) {
    // Wywołanie endpointu /materials na serwerze, aby zapisać dane w pliku material.json
    fetch('/materials', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title, link, classId, sectionId })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Wystąpił problem podczas dodawania materiału.');
      }
      console.log('Materiał został dodany pomyślnie.');
      // Po dodaniu materiału pobiera ponownie dane i renderuje je na stronie
      fetchMaterials();
    })
    .catch(error => {
      console.error('Błąd podczas dodawania materiału:', error);
    });
  }

// Funkcja do pobierania classId z pełnej nazwy pliku HTML
function getClassIdFromPageName() {
  const pageName = window.location.pathname;
  const regex = /(\w+)_klasa_(\d+)/;
  const match = pageName.match(regex);
  if (match && match[1] && match[2]) {
    return match[1] + '_klasa_' + match[2];
  } else {
    console.error('Nie można uzyskać classId z nazwy bieżącej strony.');
    return null;
  }
}


  // Pobranie danych z serwera przy załadowaniu strony
  fetchMaterials();

  // Funkcja do pobierania danych z serwera i aktualizacji sekcji
  function fetchMaterials() {
    fetch('/materials')
      .then(response => response.json())
      .then(data => {
        renderMaterials(data);
      })
      .catch(error => {
        console.error('Błąd podczas pobierania danych:', error);
      });
  }

  // Funkcja do renderowania materiałów w odpowiednich sekcjach
  function renderMaterials(data) {
    const classId = getClassIdFromPageName();
    if (!classId) {
      console.error('Nie można uzyskać classId z nazwy bieżącej strony.');
      return;
    }

    const materials = data[classId];
    if (!materials) {
      console.error('Brak materiałów dla klasy ' + classId);
      return;
    }

    for (const sectionId in materials) {
      const section = document.getElementById(sectionId);
      if (section) {
        section.innerHTML = ''; // Wyczyść zawartość sekcji
        const materialsList = materials[sectionId];
        if (materialsList.length > 0) {
          // Utwórz nagłówek h2 z odpowiednim tytułem dla sekcji
          const header = document.createElement('h2');
          header.textContent = getSectionTitle(sectionId);
          section.appendChild(header);
          materialsList.forEach(material => {
            const materialElement = createMaterialElement(material.title, material.link);
            section.appendChild(materialElement);
          });
        }
      }
    }
  }

  // Funkcja do uzyskiwania tytułu sekcji na podstawie identyfikatora
  function getSectionTitle(sectionId) {
    switch (sectionId) {
      case 'materials':
        return 'Materiały';
      case 'videos':
        return 'Filmy';
      case 'tests':
        return 'Testy';
      default:
        return 'Inne';
    }
  }

  // Funkcja do tworzenia nowego elementu materiału
  function createMaterialElement(title, link) {
    const materialElement = document.createElement('div');
    const linkElement = document.createElement('a');

    linkElement.textContent = title;
    linkElement.href = link;
    linkElement.target = '_blank';

    materialElement.appendChild(linkElement);

    return materialElement;
  }
});