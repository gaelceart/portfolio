"use strict";
//START DATA REQUEST
const requestData = async () => {
    const req = await fetch("data");
    const data = await req.json();
    return data;
}
const pendingData = requestData();
//END DATA REQUEST

const language = localStorage.getItem("lang") || "en";
document.querySelector(".lang").textContent = language.toUpperCase();

// START LANGUAGE MENU EVENTS
const langBox = document.querySelector(".lang-box");
const langMenu = document.querySelector(".lang-menu");
const langES = document.getElementById("lang-es");
const langEN = document.getElementById("lang-en");

langBox.addEventListener("mouseover",()=>{
    langMenu.classList.toggle("appear",true);
})

langBox.addEventListener("mouseleave",()=>{
    langMenu.classList.toggle("appear",false);
})

langES.addEventListener("click",()=>{
    localStorage.setItem("lang", "es");
    window.location.reload();
})

langEN.addEventListener("click",()=>{
    localStorage.setItem("lang", "en");
    window.location.reload();
})
// END LANGUAGE MENU EVENTS

// START INFO
const position = document.getElementById("position");
const msgIntro = document.getElementById("msg-intro");
const changingMsgEl = document.getElementById("changing-msg");
const aboutMe = document.getElementById("about");


const setInfo = async ()=> {
    let data = await pendingData; 
    console.log(data)
    let pos = (language == "en") ? data.info.position.en :
                                   data.info.position.es;
    position.textContent = pos;

    let dynMsg = (language == "en") ? data.info.msgIntro.en :
                                   data.info.msgIntro.es;
    msgIntro.textContent = dynMsg;

    let about = (language == "en") ? data.info.about.en :
                                   data.info.about.es;
    aboutMe.innerHTML = about;
}

setInfo();
// END INFO

// START JS dynamic msg

let phrases = [];
const setPhrases = async () => {
    let data = await pendingData;
    phrases = (language == "en") ? data.phrases.en : data.phrases.es; 
}
setPhrases()
let isTyping = changingMsgEl.getAttribute("animation") == "typing"; 
let indexMsg = 0;
let msg = changingMsgEl.textContent;

function resolveAfterSeconds(funct,x) {
    setTimeout(()=> {
        // console.log(`done ${funct.name} in ${x} ms`);
        funct()
    }, x)
}

const changeAnim = () => {
    let chooseAnim = isTyping? "typing" : "deleting";
    isTyping = !isTyping
    changingMsgEl.style.animation = `${chooseAnim} 1s steps(${msg.length}) forwards, blink .5s infinite step-end alternate`
}

const changeMsg = () => {
    indexMsg = (indexMsg > phrases.length -1) ? 0 : indexMsg;
    msg = phrases[indexMsg]
    indexMsg++
    changingMsgEl.textContent = msg;
    changingMsgEl.style.width = `${msg.length}ch`
}

// first animation for 010101010
resolveAfterSeconds(changeAnim, 0)
resolveAfterSeconds(changeAnim, 2000)
resolveAfterSeconds(changeMsg, 3000)
// end animation

setInterval(() => {
    resolveAfterSeconds(changeAnim, 0)
    resolveAfterSeconds(changeAnim, 2000)
    resolveAfterSeconds(changeMsg, 3500)
}, 4000);

// END JS dynamic msg

// START BUTTON THEME 
const btnTheme = document.getElementById("btn-theme");
let canLightTheme = true;
const changeMode = () => {
    if (canLightTheme){
        document.documentElement.style.setProperty('--color-background', '#fcfcfc');
        document.documentElement.style.setProperty('--color-primary', '#aaccff');
        document.documentElement.style.setProperty('--color-secondary', '#5c80bc');
        document.documentElement.style.setProperty('--color-accent', '#2c1c66');
        document.documentElement.style.setProperty('--color-light', '#233021');
        canLightTheme = false;
        document.querySelector("#btn-theme > i").classList.replace("fa-moon","fa-sun")
    } else {
        document.documentElement.style.setProperty('--color-accent', '#e8c547');
        document.documentElement.style.setProperty('--color-background', '#30323d');
        document.documentElement.style.setProperty('--color-light', '#cdd1c4');
        document.documentElement.style.setProperty('--color-primary', '#4d5061');
        document.documentElement.style.setProperty('--color-secondary', '#5c80bc');
        canLightTheme = true;
        document.querySelector("#btn-theme > i").classList.replace("fa-sun","fa-moon")
    }
}
btnTheme.addEventListener('click',changeMode)
// END BUTTON THEME 

const cardsContainer = document.querySelector(".cards-container");
// START CREATE PROJECT CARD ELEMENT
const createCard = (title, description, image, className, link, repo) => {
    const card = document.createElement("ARTICLE");
    const cardInfo = document.createElement("DIV");
    const cardTitle = document.createElement("H4");
    const cardDescription = document.createElement("P");
    const cardBtnContainer = document.createElement("DIV");
    const cardBtnLink = document.createElement("A");
    const cardBtnRepo = document.createElement("A");
    const img = document.createElement("IMG");

    card.classList.add("projects--card",`${className}`);
    cardInfo.classList.add("card--info");
    cardTitle.classList.add("card--title");
    cardDescription.classList.add("card--description");
    cardBtnContainer.classList.add("btn-container");
    cardBtnLink.classList.add("btn", "btn-site", "fas", "fa-external-link-alt");
    cardBtnRepo.classList.add("btn", "btn-repo", "fab", "fa-github");
    img.classList.add("img");
    img.setAttribute("src",`${image}`);
    img.setAttribute("alt",`${title}`);

    cardTitle.textContent = `${title}`;
    cardDescription.textContent = `${description}`;
    cardBtnLink.setAttribute("href",link);
    cardBtnLink.setAttribute("target", "_blank");
    cardBtnRepo.setAttribute("href",repo);
    cardBtnRepo.setAttribute("target", "_blank");

    cardBtnContainer.appendChild(cardBtnLink);
    cardBtnContainer.appendChild(cardBtnRepo);
    cardInfo.appendChild(cardTitle);
    cardInfo.appendChild(cardDescription);
    cardInfo.appendChild(cardBtnContainer)
    card.appendChild(cardInfo);
    card.appendChild(img);
    return card;
}
// END CREATE PROJECT CARD ELEMENT


const loadCards = async () => {
    const docFragment = new DocumentFragment;
    let data = await pendingData;
    for(let i = 0; i < data.projects.length; i++){
        const description = (language == "en") ? data.projects[i].description.en : data.projects[i].description.es; 
        const newCard = createCard(data.projects[i].name, description, data.projects[i].image, data.projects[i].class, data.projects[i].link, data.projects[i].repo);
        docFragment.appendChild(newCard);
    }
    cardsContainer.appendChild(docFragment);
    cardsContainer.classList.add("loaded");
}

loadCards();

// START CARDS MOUSE EVENTS
cardsContainer.addEventListener("mouseover", (e) =>{
    if (cardsContainer.classList.contains("loaded")){
        const cards = document.querySelectorAll(".projects--card");
        cards.forEach(card => {
            card.addEventListener("mouseenter", (e)=>{
                e.target.querySelector(".card--info").style.opacity= '1'
                e.target.querySelector("img").style.opacity = ".05"
            })
            card.addEventListener("mouseleave", (e)=>{
                e.target.querySelector(".card--info").style.opacity= '0'
                e.target.style.backgroundColor = "transparent"
                e.target.querySelector("img").style.opacity = "1"
            })
        })
    }
})
// END CARDS MOUSE EVENTS