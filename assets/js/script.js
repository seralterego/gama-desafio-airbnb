const apiUrl = "https://api.sheety.co/30b6e400-9023-4a15-8e6c-16aa4e3b1e72"; //url da API
const cardsContainer = document.querySelector('#cardsItem'); //query selector busca a div pelo ID
let data = []; //array de dados

/* fetch que irá buscar os dados da API */
async function fetchCards() {
  return await fetch(apiUrl)
    .then(async (r) => await r.json())
}

/* essa função pega e renderiza os cartões */
function renderCards(cards) {
  cardsContainer.innerHTML = "";
  cards.map(renderCard);
  //let i = 0;
  //setInterval(() => {
  //  renderCard(cards[i])
  // i++
  //}, 1000)
}

/* renderiza cada cartão */
function renderCard(card) {
  const div = document.createElement("div");
  /* div.style.width = "20rem"; */
  /* div.style.margin = "2rem"; */
  div.className = "card";
  div.id = "cardsItens";
  div.innerHTML = `
  <a href="#" class="cardLink" aria-hidden="true" aria-label="${card.name}">
    <img src="${card.photo}" class="card-img-top" id="img-card" alt="${card.name}">
    <div class="card-body">
      <div id="cardText1">
        <p class="cardTxtSpan">
          <span class="badge" id="cardBdg">Destaque</span>
          ${card.property_type} <span aria-hidden="true"> · </span> 1 cama
        </p>
        <span class="cardTxtClf">
          <i class="fa fa-star" aria-hidden="true"></i>
          <span class="cardTxtSpan">4,88</span>
        </span>
      </div>
      <div id="cardText2">
        <p class="card-text">${card.name}</p>
      </div>
      <div id="cardText3">
        <p class="card-text"><b>R$</b><span><b>&nbsp;${card.price},00</b></span>/<span>mês</span></p>
      </div>
      <span class="badge" id="cardNewLP"><i class="fa fa-tag" aria-hidden="true"></i>&nbsp;Novo preço mais
        baixo</span>
    </div>
  </a>
  `;
  cardsContainer.appendChild(div);
}

/* pega a resposta do array data e aguarda a resposta de fetchCards */
async function main() {
  data = await fetchCards();
  if (data[0]) {
    renderCards(data);
  }
}

main();

// ===============================================================

/* números aleatórios para as avaliações e quartos */
function randomNumber(){
  var random = Math.floor(Math.random() * 10) + 1;
  return random;
}

randomNumber();