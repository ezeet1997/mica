const steps = document.querySelectorAll(".step");
const stepText = document.getElementById("stepText");
const barFill = document.getElementById("barFill");

const monthLabel = document.getElementById("monthLabel");
const calendar = document.getElementById("calendar");
const prevMonth = document.getElementById("prevMonth");
const nextMonth = document.getElementById("nextMonth");
const otherDayBtn = document.getElementById("otherDayBtn");

let currentStep = 1;
let calendarDate = new Date();

const answers = {
  plan: "",
  dia: "",
  horario: "",
  respuesta: ""
};

const monthNames = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
];

function showStep(step){
  currentStep = step;
  steps.forEach(s => s.classList.toggle("active", Number(s.dataset.step) === step));

  const visibleStep = Math.min(step, 5);
  stepText.textContent = step === 6 ? "Resultado final" : `Paso ${visibleStep} de 5`;
  barFill.style.width = step === 6 ? "100%" : `${(visibleStep / 5) * 100}%`;

  if(step === 3) renderCalendar();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function formatDate(date){
  return date.toLocaleDateString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}

function sameDay(a,b){
  return a.getFullYear() === b.getFullYear()
    && a.getMonth() === b.getMonth()
    && a.getDate() === b.getDate();
}

function renderCalendar(){
  calendar.innerHTML = "";

  const year = calendarDate.getFullYear();
  const month = calendarDate.getMonth();

  monthLabel.textContent = `${monthNames[month]} ${year}`;

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const firstWeekday = (firstDay.getDay() + 6) % 7;
  const today = new Date();
  today.setHours(0,0,0,0);

  for(let i = 0; i < firstWeekday; i++){
    const empty = document.createElement("button");
    empty.className = "day empty";
    empty.type = "button";
    empty.disabled = true;
    calendar.appendChild(empty);
  }

  for(let day = 1; day <= lastDay.getDate(); day++){
    const date = new Date(year, month, day);
    date.setHours(0,0,0,0);

    const btn = document.createElement("button");
    btn.className = "day";
    btn.type = "button";
    btn.textContent = day;

    if(sameDay(date, today)) btn.classList.add("today");
    if(date < today){
      btn.classList.add("past");
      btn.disabled = true;
    }

    if(answers.dia === formatDate(date)) btn.classList.add("selected");

    btn.addEventListener("click", () => {
      answers.dia = formatDate(date);
      showStep(4);
    });

    calendar.appendChild(btn);
  }
}

function buildMessage(){
  return `Hola Eze 😄

Ya completé la encuesta:

🍽️ Plan: ${answers.plan}
📅 Día: ${answers.dia}
🕒 Horario: ${answers.horario}
✅ Respuesta: ${answers.respuesta}

Ahora sí, organicemos la salida.`;
}

function renderResult(){
  document.getElementById("rPlan").textContent = answers.plan;
  document.getElementById("rDia").textContent = answers.dia;
  document.getElementById("rHorario").textContent = answers.horario;
  document.getElementById("rRespuesta").textContent = answers.respuesta;

  const msg = buildMessage();
  document.getElementById("message").value = msg;

  // Agregá tu número con código país. Ejemplo Argentina: 549261XXXXXXXX
  const phone = "";
  document.getElementById("waBtn").href = phone
    ? `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`
    : `https://wa.me/?text=${encodeURIComponent(msg)}`;
}

document.querySelector(".next").addEventListener("click", () => showStep(2));

document.querySelectorAll(".options").forEach(group => {
  group.querySelectorAll("button").forEach(btn => {
    btn.addEventListener("click", () => {
      const key = group.dataset.key;
      answers[key] = btn.dataset.value;

      if(currentStep < 5){
        showStep(currentStep + 1);
      } else {
        renderResult();
        showStep(6);
      }
    });
  });
});

prevMonth.addEventListener("click", () => {
  calendarDate.setMonth(calendarDate.getMonth() - 1);
  renderCalendar();
});

nextMonth.addEventListener("click", () => {
  calendarDate.setMonth(calendarDate.getMonth() + 1);
  renderCalendar();
});

otherDayBtn.addEventListener("click", () => {
  answers.dia = "Otro día / lo hablamos";
  showStep(4);
});

document.getElementById("copyBtn").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(document.getElementById("message").value);
    const btn = document.getElementById("copyBtn");
    btn.textContent = "Copiado ✓";
    setTimeout(() => btn.textContent = "Copiar mensaje", 1400);
  } catch {
    document.getElementById("message").select();
  }
});

document.getElementById("restartBtn").addEventListener("click", () => {
  answers.plan = "";
  answers.dia = "";
  answers.horario = "";
  answers.respuesta = "";
  calendarDate = new Date();
  showStep(1);
});

showStep(1);
