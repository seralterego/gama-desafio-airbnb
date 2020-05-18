const API_URL = "https://api.sheety.co/30b6e400-9023-4a15-8e6c-16aa4e3b1e72"; //url da API

// definição da página atual para a função da paginação
let currentPage = 1;

// quantidade de itens que serão apresentados por página
const ITEMS_PER_PAGE = 8;

// método de filtro para busca na página
const filterPlaces = (input, places) => {
  return places.filter(place => place.name.toLowerCase().includes(input.value.toLowerCase()))
}

// método de paginação dos itens trazidos da API
const paginateData = (data) => {
  return data.reduce((total, current, index) => {
    const belongArrayIndex = Math.ceil((index + 1) / ITEMS_PER_PAGE) - 1;
    total[belongArrayIndex]
      ? total[belongArrayIndex].push(current)
      : total.push([current]);
    return total;
  }, []);
};

// método de chamada assíncrona (fetch) para a URL da API, que retorna os dados parseados
const fetchAPI = async (url) => {
  let response = await fetch(url);
  const textResponse = await response.text();
  return JSON.parse(textResponse);
};

//método que irá mudar a página
const changePage = (pageToBeRendered) => {
  currentPage = pageToBeRendered;
  renderPage();
};

// método que irá criar o menu para trocar as páginas
const renderPaginationMenu = (paginatedData) => {
  const paginationContainer = document.querySelector('.pagination');

  while (paginationContainer.firstChild) {
    paginationContainer.removeChild(paginationContainer.firstChild);
  }

  const previousPage = document.createElement('span');
  previousPage.className = 'page-changer';
  previousPage.innerHTML = '<';
  previousPage.addEventListener('click', () =>
    currentPage <= 1 ? () => {} : changePage(currentPage - 1)
  );
  paginationContainer.appendChild(previousPage);

  paginatedData.forEach((_, index) => {
    const pageButton = document.createElement('span');
    pageButton.innerHTML = index + 1;
    pageButton.addEventListener('click', () => changePage(index + 1));
    if (currentPage === index + 1) {
      pageButton.className = 'active';
    }
    paginationContainer.appendChild(pageButton);
  });

  const nextPage = document.createElement('span');
  nextPage.className = 'page-changer';
  nextPage.innerHTML = '>';
  nextPage.addEventListener('click', () =>
    currentPage >= paginatedData.length ? () => {} : changePage(currentPage + 1)
  );
  paginationContainer.appendChild(nextPage);
};

// método que renderiza a página e implementa os métodos, de acordo com o retorno da API, cria os elementos e classes no HTML
const renderPage = async () => {
  const apiData = await fetchAPI(API_URL);

  // chamada do método de filtro (filterPlaces) e criação do elemento no HTML
  const searchInput = document.querySelector('#inputLocalizacao')
  let filteredApiData = filterPlaces(searchInput, apiData)

  const searchButton = document.querySelector('#formBtnItem')
  searchButton.addEventListener('click', () => {
    filteredApiData = filterPlaces(searchInput, apiData)
    renderPage();
  })

  // chamada do método de paginação (paginateData) e o filtro de dados (filteredApiData)
  const paginatedData = paginateData(filteredApiData);
  renderPaginationMenu(paginatedData);

  // link com o elemento HTML criado no index
  cardContainer = document.querySelector('.card-container');

  // retira os elementos da página atual para o carregamento dos novos na nova página!
  while(cardContainer.firstChild) {
    cardContainer.removeChild(cardContainer.firstChild);
  }

  // Desconstrução dos itens da API para criação dos elementos HTML de cada item da API
  paginatedData[currentPage - 1].forEach((property) => {
    const { name, photo, price, property_type } = property;

    cardInfo = document.createElement('div');
    cardInfo.className = 'card-info';

    card = document.createElement('div');
    card.className = 'card';

    cardImg = document.createElement('img');
    cardImg.className = 'card-img';
    cardImg.src = photo;

    propertyType = document.createElement('div');
    propertyType.className = 'property-type';
    propertyType.innerHTML = property_type;

    propertyPrice = document.createElement('div');
    propertyPrice.className = 'property-price';
    propertyPrice.innerHTML = `R$ ${price.toFixed(2)}/noite`; // 'R$ ' + price.toFixed(2) + '/noite'

    propertyName = document.createElement('div');
    propertyName.className = 'property-name';
    propertyName.innerHTML = name;

    cardContainer.appendChild(card);
    card.appendChild(cardImg);
    card.appendChild(cardInfo);
    cardInfo.appendChild(propertyName);
    cardInfo.appendChild(propertyType);
    cardInfo.appendChild(propertyPrice);
  });
};

// método que chama o serviço do Google Maps
function initMap() {
  const locations = [
    ['Avenida Paulista', -23.563311, -46.654275, 6],
    ['Gama Academy', -23.567427, -46.684607, 5],
    ['Centro de Itapevi', -23.545428, -46.935272, 4],
    ['Centro de Barueri', -23.512609, -46.875542, 3],
    ['Centro de Osasco', -23.527524, -46.775949, 2],
    ['Largo da Matriz', -23.501507, -46.698905, 1]
  ];

  const map = new google.maps.Map(document.getElementById('map'), {
    zoom: 10,
    center: new google.maps.LatLng(-23.567427, -46.684607),
    mapTypeId: google.maps.MapTypeId.ROADMAP
  });

  const infowindow = new google.maps.InfoWindow();

  let marker, i;

  for (i = 0; i < locations.length; i++) {
    marker = new google.maps.Marker({
      position: new google.maps.LatLng(locations[i][1], locations[i][2]),
      map: map
    });

    google.maps.event.addListener(marker, 'click', (function (marker, i) {
      return function () {
        infowindow.setContent(locations[i][0]);
        infowindow.open(map, marker);
      }
    })(marker, i));
  }
}

renderPage();
