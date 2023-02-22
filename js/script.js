let nav = 0; // ACOMPANHA O MÊS QUE ESTAMOS

let clicked = null; // ACOMPANHA OS CLIQUES DO USUÁRIO NO DIA PARA ADICIONAR, CONSULTAR OU DELETAR UM EVENTO

let events = localStorage.getItem("events")
  ? JSON.parse(localStorage.getItem("events"))
  : [];

const calendar = document.getElementById("calendar");

const newEventModal = document.getElementById("newEventModal");

const deleteEventModal = document.getElementById("deleteEventModal");

const backDrop = document.getElementById("modalBackDrop");

const eventTitleInput = document.getElementById("eventTitleInput");

const weekdays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function openModal(date) {
  clicked = date;

  const eventForDay = events.find((e) => e.date === clicked);

  // SE O DIA CLICADO JÁ ESTIVER COM EVENTO MARCADO, MOSTRAREMOS A MODAL PARA DELETAR O EVENTO, SENÃO ABRIREMOS A MODAL PARA ADICIONAR UM NOVO EVENTO

  if (eventForDay) {
    // console.log("Evento já existe");
    document.getElementById("eventText").innerText = eventForDay.title;
    deleteEventModal.style.display = "block";
  } else {
    newEventModal.style.display = "block";
  }
  backDrop.style.display = "block";
}

function load() {
  const dt = new Date();
  // console.log(dt);

  if (nav !== 0) {
    dt.setMonth(new Date().getMonth() + nav);
  }

  const day = dt.getDate();
  const month = dt.getMonth();
  const year = dt.getFullYear();
  // console.log(day, month, year);

  const firstDayOfMonth = new Date(year, month, 1);
  console.log(firstDayOfMonth);

  // REPRESENTA QUANTOS DIAS TEMOS NO MÊS EM QUESTÃO
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  // console.log(daysInMonth);

  const dateString = firstDayOfMonth.toLocaleDateString("en-us", {
    weekday: "long",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });
  // console.log(dateString);

  const paddingDays = weekdays.indexOf(dateString.split(", ")[0]);
  // console.log(paddingDays);

  // MOSTRA O MÊS EM QUESTÃO
  document.getElementById("monthDisplay").innerText = `${dt.toLocaleDateString(
    "en-us",
    { month: "long" }
  )} ${year}`;

  calendar.innerHTML = "";

  for (let i = 1; i <= paddingDays + daysInMonth; i++) {
    // PARA CADA ITERAÇÃO SERÁ CRIADO UMA DIV

    const daySquare = document.createElement("div");
    daySquare.classList.add("day");

    const dayString = `${month + 1} / ${i - paddingDays} / ${year}`;

    if (i > paddingDays) {
      daySquare.innerText = i - paddingDays;

      const eventForDay = events.find((e) => e.date === dayString);

      // DESTACA O DIA ESPECÍFICO QM QUE ESTAMOS NO CALENDÁRIO

      if (i - paddingDays === day && nav === 0) {
        daySquare.id = "currentDay";
      }

      if (eventForDay) {
        const eventDiv = document.createElement("div");
        eventDiv.classList.add("event");
        eventDiv.innerText = eventForDay.title;
        daySquare.appendChild(eventDiv);
      }

      daySquare.addEventListener("click", () => openModal(dayString));
    } else {
      daySquare.classList.add("padding");
    }

    // MOSTRA O CALENDÁRIO NA TELA
    calendar.appendChild(daySquare);
  }
}

function closeModal() {
  eventTitleInput.classList.remove("error");
  newEventModal.style.display = "none";
  deleteEventModal.style.display = "none";
  backDrop.style.display = "none";
  eventTitleInput.value = "";
  clicked = null;
  load();
}

function saveEvent() {
  if (eventTitleInput.value) {
    eventTitleInput.classList.remove("error");

    events.push({
      date: clicked,
      title: eventTitleInput.value,
    });

    localStorage.setItem("events", JSON.stringify(events));
    closeModal();
  } else {
    eventTitleInput.classList.add("error");
  }
}

function deleteEvent() {
  // PEGAMOS OS EVENTOS E FILTRAMOS O ÚNICO EVENTO QUE SERÁ DELETADO / FILTRAMOS OS EVENTOS QUE SÃO DIEFERENTES DE CLICADO E DELETAMOS O EVENTO QUE ESIVER (= CLICKED)
  events = events.filter((e) => e.date !== clicked);
  localStorage.setItem("events", JSON.stringify(events));
  closeModal();
}

function initButtons() {
  document.getElementById("nextButton").addEventListener("click", () => {
    nav++;
    load();
  });

  document.getElementById("backButton").addEventListener("click", () => {
    nav--;
    load();
  });

  document.getElementById("saveButton").addEventListener("click", saveEvent);

  document.getElementById("cancelButton").addEventListener("click", closeModal);

  document
    .getElementById("deleteButton")
    .addEventListener("click", deleteEvent);

  document.getElementById("closeButton").addEventListener("click", closeModal);
}

initButtons();
load();
