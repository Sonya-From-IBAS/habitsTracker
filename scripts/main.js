'use strict'

let habbits = [];
const HABBIT_KEY = 'HABBIT_KEY';

/* utils */

function loadData(){
    const habbitString = localStorage.getItem(HABBIT_KEY);
    const habbitArray = JSON.parse(habbitString);
    if(Array.isArray(habbitArray)){
        habbits = habbitArray;
    }
}

function saveData(){
    localStorage.setItem(HABBIT_KEY, JSON.stringify(habbits));
}

/* page */
const page = {
    menu: document.querySelector('.menu__list'),
    header:{
        h1: document.querySelector('.h1'),
        progressPercent: document.querySelector(".progress__percent"),
        progressCoverBar: document.querySelector(".progress__cover-bar")
    },
    content:{
        daysContainer: document.getElementById('days'),
        nextDay: document.getElementById('nextDay')
    }
   
}


/* render */
function rerenderMenu(activeHabbit){

    for(const habbit of habbits){
        const existed = document.querySelector(`[menu-habbit-id="${habbit.id}"]`)
        if(!existed){
            const element = document.createElement('button');
            element.setAttribute('menu-habbit-id', habbit.id);
            element.classList.add("menu__item");
            element.addEventListener('click', ()=>rerender(habbit.id));
            element.innerHTML = `<img src="./img/${habbit.icon}.svg" alt="${habbit.name}" />`
            if(activeHabbit.id === habbit.id){
                element.classList.add('menu__item-active');
            }
            page.menu.appendChild(element);
            continue;
        }
        if(activeHabbit.id === habbit.id){
            existed.classList.add('menu__item-active');
        }else{
            existed.classList.remove('menu__item-active');
        }
    }
}

function rerenderHead(activeHabbit){
    page.header.h1.innerText = activeHabbit.name;
    const progress = activeHabbit.days.length / activeHabbit.target > 1 ? 100 : activeHabbit.days.length/activeHabbit.target*100;
    page.header.progressPercent.innerText = progress.toFixed(0) + '%';
    page.header.progressCoverBar.setAttribute('style', `width: ${progress}%`);
}


function rerenderContent(activeHabbit){
    page.content.daysContainer.innerHTML = '';
    for(const day in activeHabbit.days){
        const element = document.createElement('div');
        element.classList.add('habbit');
        element.innerHTML = `<div class="habbit__day">День ${Number(day) + 1}</div>
        <div class="habbit__comment">
          ${activeHabbit.days[day].comment}
        </div>
        <button class="habbit__delete">
          <img src="./img/delete.svg" alt="delete" />
        </button>`;
        page.content.daysContainer.appendChild(element);
    }
    page.content.nextDay.innerHTML = `День ${activeHabbit.days.length + 1}`;

}

function rerender(activeHabbitId){
    const activeHabbit = habbits.find(habbit => habbit.id === activeHabbitId);
    if(!activeHabbit){
        return;
    }
    rerenderMenu(activeHabbit);
    rerenderHead(activeHabbit);
    rerenderContent(activeHabbit);
}

/* Init */

(()=>{
    loadData();
    rerender(habbits[0].id)
})()