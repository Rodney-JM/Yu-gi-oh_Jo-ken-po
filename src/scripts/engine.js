const state = { /* Objeto de objetos */
    score:{
        playerScore:0,
        computerScore:0,
        scoreBox: document.getElementById("score_points"),
    },
    cardSprites:{
        avatar: document.getElementById("card-image"),
        name: document.getElementById("card-name"),
        type: document.getElementById("card-type"),
    },
    fieldCards:{
        player: document.getElementById("player-field-card"),
        computer: document.getElementById("computer-field-card"),
    },
    action:{
        button:document.getElementById("next-duel")
    }
};

const playersSides = {
    player1: "player-cards",
    computer: "computer-cards"
}

const pathImages = "./src/assets/icons/";

/* Mapeamento das cartas */
const cardData = [
    {
        id:0,
        name: "Blue Eyes White Dragon",
        type: "Paper",
        img: `${pathImages}dragon.png`,
        WinOf: [1],
        LoseOf: [2],
    },
    {
        id:1,
        name: "Dark Magician",
        type: "Rock",
        img: `${pathImages}magician.png`,
        WinOf: [2],
        LoseOf: [0],
    },
    {
        id:2,
        name: "Exodia",
        type: "Scissors",
        img: `${pathImages}exodia.png`,
        WinOf: [0],
        LoseOf: [1],
    }
];

async function getRandomCardId(){
    const randomIndex = Math.floor(Math.random() * cardData.length); /* Math floor arredonda o número, o math random dá um número aleatório por meio de uma expressão, o cardData.length é o limite do embaralhamento */
    return cardData[randomIndex].id;
}

async function createCardImage(IdCard, fieldSide){
    const cardImage = document.createElement("img"); /* Cria a tag img */
    cardImage.setAttribute("height", "100px");/* Adiciona o atributo e o valor */
    cardImage.setAttribute("src", "./src/assets/icons/card-back.png");
    cardImage.setAttribute("data-id", IdCard);
    cardImage.classList.add("card");

    if(fieldSide === playersSides.player1){
        cardImage.addEventListener('click', ()=>{
            setCardsField(cardImage.getAttribute("data-id"));
        })
        cardImage.addEventListener("mouseover", ()=>{/* Evento de passar o mouse */
        drawSelectCard(IdCard);
    }); 
    }
  
    return cardImage;
}

async function setCardsField(cardId){
    await removeAllCardsImages(); /* remove as cartas */

    let computerCardId = await getRandomCardId(); /* Dá uma carta aleatória pro computador */

    showHiddenCardFieldsImages(true);

    await hiddenCardDetails();

    await drawCardsInField(cardId, computerCardId);
    let duelResults = await checkDuelResults(cardId, computerCardId);
 
    await updateScore();
    await drawButton(duelResults);/* Verifica quem venceu */
}

async function drawCardsInField(cardId, computerCardId){
    state.fieldCards.player.src = cardData[cardId].img;
    state.fieldCards.computer.src = cardData[computerCardId].img;
}

async function showHiddenCardFieldsImages(value){
    if(value===true){
        state.fieldCards.player.style.display = "block"; 
        state.fieldCards.computer.style.display = "block";
    }

    if(value ===false){
        state.fieldCards.player.style.display = "none";
        state.fieldCards.computer.style.display = "none";    
    }
}

async function hiddenCardDetails(){
    state.cardSprites.name.innerText = "";
    state.cardSprites.type.innerText = "";
    state.cardSprites.avatar.src = "";
}

async function drawButton(text){
    state.action.button.innerText = text.toUpperCase();
    state.action.button.style.display = "block";
}

async function updateScore(){
    state.score.scoreBox.innerText = `Win : ${state.score.playerScore} | Lose: ${state.score.computerScore}`;
}

async function checkDuelResults(playerCardId, computerCardId){
    let duelResults = "draw"; /* Caso nada aconteça */
    let playerCard = cardData[playerCardId];

    if(playerCard.WinOf.includes(computerCardId)){
        duelResults = "win";
        state.score.playerScore++;
    }

    if(playerCard.LoseOf.includes(computerCardId)){
        duelResults = "lose";
        state.score.computerScore++;
    }
    await playAudio(duelResults, ".wav", 1);
    return duelResults;
}

async function removeAllCardsImages(){
    let cards = document.querySelector("#computer-cards");
    let imgElements = cards.querySelectorAll("img");
    imgElements.forEach((img)=> img.remove());

    cards = document.querySelector("#player-cards");
    imgElements = cards.querySelectorAll("img");
    imgElements.forEach((img)=> img.remove());
}

async function drawSelectCard(index){
    state.cardSprites.avatar.src = cardData[index].img;
    state.cardSprites.name.innerText = cardData[index].name;
    state.cardSprites.type.innerText = "Attribute: "+ cardData[index].type;
}

/* Embaralhamento de cartas */
async function drawCards(cardNumbers, fieldSide){
    for(let i=0; i < cardNumbers; i++){
        const randomIdCard = await getRandomCardId();
        const cardImage = await createCardImage(randomIdCard, fieldSide);

        document.getElementById(fieldSide).appendChild(cardImage);
    }
}

async function resetDuel(){
    state.cardSprites.avatar.src = "";
    state.action.button.style.display = "none";
    
    state.fieldCards.player.style.display = "none";
    state.fieldCards.computer.style.display = "none";

    init();
}

async function playAudio(status, extension, audioVol){
    const audio = new Audio(`./src/assets/audios/${status}${extension}`);
    audio.volume = audioVol;
    try{
        audio.play();
    }catch{}
}

function init(){/* Função de chamar o estado do game */
    showHiddenCardFieldsImages(false);

    drawCards(5, playersSides.player1);
    drawCards(5, playersSides.computer);

    const bgm = document.getElementById("bgm");
    bgm.play();
}
init();