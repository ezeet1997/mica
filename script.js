const steps = document.querySelectorAll(".step");
const stepText = document.getElementById("stepText");
const barFill = document.getElementById("barFill");

let currentStep = 1;

const answers = {
  plan: "",
  dia: "",
  horario: "",
  respuesta: ""
};

function showStep(step){
  currentStep = step;
  steps.forEach(s => s.classList.toggle("active", Number(s.dataset.step) === step));

  const visibleStep = Math.min(step, 5);
  stepText.textContent = step === 6 ? "Resultado final" : `Paso ${visibleStep} de 5`;
  barFill.style.width = step === 6 ? "100%" : `${(visibleStep / 5) * 100}%`;

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function formatInputDate(value){
  if(!value) return "";
  const [year, month, day] = value.split("-");
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  return date.toLocaleDateString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}

function setMinDate(){
  const input = document.getElementById("dateInput");
  if(!input) return;

  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  input.min = `${yyyy}-${mm}-${dd}`;
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

document.getElementById("continueDateBtn").addEventListener("click", () => {
  const input = document.getElementById("dateInput");
  const formatted = formatInputDate(input.value);

  if(!formatted){
    input.focus();
    return;
  }

  answers.dia = formatted;
  showStep(4);
});

document.getElementById("otherDayBtn").addEventListener("click", () => {
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
  document.getElementById("dateInput").value = "";
  showStep(1);
});

setMinDate();
showStep(1);
