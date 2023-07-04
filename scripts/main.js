"use strict";

let habbits = [];
const HABBIT_KEY = "HABBIT_KEY";
let globalActiveHabbitId;

/* page */
const page = {
  menu: document.querySelector(".menu__list"),
  header: {
    h1: document.querySelector(".h1"),
    progressPercent: document.querySelector(".progress__percent"),
    progressCoverBar: document.querySelector(".progress__cover-bar"),
  },
  content: {
    daysContainer: document.getElementById("days"),
    nextDay: document.getElementById("nextDay"),
  },
  popup: {
    index: document.getElementById("add-habbit__popup"),
    iconField: document.querySelector(".popup__form input[name='icon']"),
    iconName: document.querySelector(".popup__form input[name='name']"),
    iconTarget: document.querySelector(".popup__form input[name='target']"),
  },
};

/* utils */

function loadData() {
  const habbitString = localStorage.getItem(HABBIT_KEY);
  const habbitArray = JSON.parse(habbitString);
  if (Array.isArray(habbitArray)) {
    habbits = habbitArray;
  }
}

function saveData() {
  localStorage.setItem(HABBIT_KEY, JSON.stringify(habbits));
}

function togglePopup() {
  page.popup.index.classList.toggle("cover_hidden");
  if (page.popup.iconName.classList.contains("error")) {
    page.popup.iconName.classList.remove("error");
  }
  if (page.popup.iconTarget.classList.contains("error")) {
    page.popup.iconTarget.classList.remove("error");
  }
}

/* render */
function rerenderMenu(activeHabbit) {
  page.menu.innerHTML = "";
  for (const habbit of habbits) {
    const existed = document.querySelector(`[menu-habbit-id="${habbit.id}"]`);
    if (!existed) {
      const element = document.createElement("div");
      element.classList.add("menu__list-item");
      const active = activeHabbit.id === habbit.id ? " menu__item-active" : "";
      element.innerHTML = `
            <button class="menu__item${active}" menu-habbit-id='${habbit.id}' onclick="rerender(${habbit.id})">
                <img  src="./img/${habbit.icon}.svg" class="invetr" alt="${habbit.name}"/>
            </button>

            <button class="menu__item-close" onclick="deleteMenuItem(${habbit.id})">
                <img src="./img/menu_close.svg" alt="close">
            </button>
            `;
      page.menu.appendChild(element);
      continue;
    }
    if (activeHabbit.id === habbit.id) {
      existed.classList.add("menu__item-active");
    } else {
      existed.classList.remove("menu__item-active");
    }
  }
  if (habbits.length < 2) {
    document.querySelector(".menu__item-close").classList.add("none");
  } else if (
    document.querySelector(".menu__item-close").classList.contains("none")
  ) {
    document.querySelector(".menu__item-close").classList.remove("none");
  }
}

function rerenderHead(activeHabbit) {
  page.header.h1.innerText = activeHabbit.name;
  const progress =
    activeHabbit.days.length / activeHabbit.target > 1
      ? 100
      : (activeHabbit.days.length / activeHabbit.target) * 100;
  page.header.progressPercent.innerText = progress.toFixed(0) + "%";
  page.header.progressCoverBar.setAttribute("style", `width: ${progress}%`);
}

function rerenderContent(activeHabbit) {
  page.content.daysContainer.innerHTML = "";
  for (const day in activeHabbit.days) {
    const element = document.createElement("div");
    element.classList.add("habbit");
    element.innerHTML = `<div class="habbit__day">День ${Number(day) + 1}</div>
        <div class="habbit__comment">
          ${activeHabbit.days[day].comment}
        </div>
        <button class="habbit__delete" onclick="dayDelete(${day})">
          <img src="./img/delete.svg" alt="delete" />
        </button>`;
    page.content.daysContainer.appendChild(element);
  }
  if (document.querySelector(".input_icon").classList.contains("error")) {
    document.querySelector(".input_icon").classList.remove("error");
  }
  page.content.nextDay.innerHTML = `День ${activeHabbit.days.length + 1}`;
}

function dayDelete(day) {
  habbits = habbits.map((habbit) => {
    if (habbit.id === globalActiveHabbitId) {
      habbit.days.splice(day, 1);
      return {
        ...habbit,
        days: habbit.days,
      };
    }
    return habbit;
  });
  rerender(globalActiveHabbitId);
  saveData();
}

function rerender(activeHabbitId) {
  globalActiveHabbitId = activeHabbitId;
  const activeHabbit = habbits.find((habbit) => habbit.id === activeHabbitId);
  if (!activeHabbit) {
    return;
  }
  document.location.replace(document.location.pathname + "#" + activeHabbitId);
  rerenderMenu(activeHabbit);
  rerenderHead(activeHabbit);
  rerenderContent(activeHabbit);
}

/* work with days */
function addDays(event) {
  event.preventDefault();
  const form = event.target;
  const data = new FormData(form);
  const comment = data.get("comment");
  form["comment"].classList.remove("error");
  if (!comment) {
    form["comment"].classList.add("error");
    return;
  }
  habbits = habbits.map((habbit) => {
    if (habbit.id === globalActiveHabbitId) {
      return {
        ...habbit,
        days: habbit.days.concat([{ comment }]),
      };
    }
    return habbit;
  });
  form["comment"].value = "";
  rerender(globalActiveHabbitId);
  saveData();
}

/* work with habbits */
function deleteMenuItem(dayId) {
  habbits.map((habbit, index) => {
    if (habbit.id === dayId) {
      habbits.splice(index, 1);
    }
  });
  globalActiveHabbitId = habbits[0].id;
  rerenderMenu(globalActiveHabbitId);
  saveData();
  rerender(globalActiveHabbitId);
}

function setIcon(context, icon) {
  page.popup.iconField.value = icon;
  const activeIcon = document.querySelector(".icon.icon_active");
  activeIcon.classList.remove("icon_active");
  context.classList.add("icon_active");
}

function addHabbit(event) {
  event.preventDefault();
  const form = event.target;
  const data = new FormData(form);
  const name = data.get("name");
  const icon = data.get("icon");
  const target = data.get("target");

  if (!page.popup.iconName.value) {
    page.popup.iconName.classList.add("error");
    return;
  } else if (page.popup.iconName.classList.contains("error")) {
    page.popup.iconName.classList.remove("error");
  }
  if (!page.popup.iconTarget.value) {
    page.popup.iconTarget.classList.add("error");
    return;
  } else if (page.popup.iconTarget.classList.contains("error")) {
    page.popup.iconTarget.classList.remove("error");
  }

  habbits = habbits.concat([
    {
      id: habbits[habbits.length - 1].id + 1,
      icon,
      name,
      target,
      days: [],
    },
  ]);
  rerender(globalActiveHabbitId);
  saveData();
  form["name"].value = "";
  form["target"].value = "";
  page.popup.index.classList.toggle("cover_hidden");
  rerenderMenu(globalActiveHabbitId);
}

function createFirstHabbit() {
  const initialHabbit = [
    {
      id: 1,
      icon: "water",
      name: "Пить пиво",
      target: 10,
      days: ["aboba"],
    },
  ];

  try {
    const memoryString = localStorage.getItem(HABBIT_KEY);
    if (memoryString === "[]" || memoryString === "") {
      localStorage.setItem(HABBIT_KEY, JSON.stringify(initialHabbit));
    }
  } catch {
    localStorage.setItem(HABBIT_KEY, JSON.stringify(initialHabbit));
  }
}
/* Init */

(() => {
    console.log('hellow world')
  createFirstHabbit();
  loadData();
  const hashId = Number(document.location.hash.replace("#", ""));
  const urlHabbit = habbits.find((habbit) => habbit.id === hashId);
  if (urlHabbit) {
    rerender(urlHabbit.id);
  } else {
    rerender(habbits[0].id);
  }
})();
