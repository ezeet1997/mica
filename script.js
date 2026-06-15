const monthLabel = document.getElementById("monthLabel");
const calendar = document.getElementById("calendar");
const prevMonth = document.getElementById("prevMonth");
const nextMonth = document.getElementById("nextMonth");
const selectedPlan = document.getElementById("selectedPlan");
const selectedDate = document.getElementById("selectedDate");
const messageBox = document.getElementById("messageBox");
const whatsappLink = document.getElementById("whatsappLink");
const copyMessage = document.getElementById("copyMessage");

let current = new Date();
let chosenPlan = "";
let chosenDate = "";

const monthNames = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
];

function formatDate(date) {
  return date.toLocaleDateString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}

function updateMessage() {
  const plan = chosenPlan || "[plan a elegir]";
  const date = chosenDate || "[fecha a elegir]";
  const message = `Mica, elegí: ${plan} para el ${date}. Ahora sí no hay excusas 😄`;
  messageBox.value = message;

  // Cambiá el número por el tuyo si querés que el botón abra WhatsApp directo.
  const phone = "";
  const encoded = encodeURIComponent(message);
  whatsappLink.href = phone
    ? `https://wa.me/${phone}?text=${encoded}`
    : `https://wa.me/?text=${encoded}`;
}

function renderCalendar() {
  calendar.innerHTML = "";

  const year = current.getFullYear();
  const month = current.getMonth();

  monthLabel.textContent = `${monthNames[month]} ${year}`;

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const firstWeekday = (firstDay.getDay() + 6) % 7;

  for (let i = 0; i < firstWeekday; i++) {
    const empty = document.createElement("button");
    empty.className = "day empty";
    empty.disabled = true;
    calendar.appendChild(empty);
  }

  const today = new Date();
  for (let day = 1; day <= lastDay.getDate(); day++) {
    const date = new Date(year, month, day);
    const btn = document.createElement("button");
    btn.className = "day";
    btn.textContent = day;

    if (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    ) {
      btn.classList.add("today");
    }

    btn.addEventListener("click", () => {
      document.querySelectorAll(".day").forEach(d => d.classList.remove("selected"));
      btn.classList.add("selected");
      chosenDate = formatDate(date);
      selectedDate.textContent = chosenDate;
      updateMessage();
      document.getElementById("elegir-plan").scrollIntoView({ behavior: "smooth" });
    });

    calendar.appendChild(btn);
  }
}

document.querySelectorAll(".plan-card").forEach(card => {
  card.querySelector("button").addEventListener("click", () => {
    document.querySelectorAll(".plan-card").forEach(c => c.classList.remove("active"));
    card.classList.add("active");
    chosenPlan = card.dataset.plan;
    selectedPlan.textContent = chosenPlan;
    updateMessage();
    document.getElementById("calendario").scrollIntoView({ behavior: "smooth" });
  });
});

prevMonth.addEventListener("click", () => {
  current.setMonth(current.getMonth() - 1);
  renderCalendar();
});

nextMonth.addEventListener("click", () => {
  current.setMonth(current.getMonth() + 1);
  renderCalendar();
});

copyMessage.addEventListener("click", async () => {
  await navigator.clipboard.writeText(messageBox.value);
  copyMessage.textContent = "Copiado ✓";
  setTimeout(() => copyMessage.textContent = "Copiar mensaje", 1600);
});

renderCalendar();
updateMessage();
