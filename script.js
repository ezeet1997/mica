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

  // Agregá tu número con código país, ejemplo Argentina: 549261XXXXXXX
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

document.getElementById("copyBtn").addEventListener("click", async () => {
  await navigator.clipboard.writeText(document.getElementById("message").value);
  const btn = document.getElementById("copyBtn");
  btn.textContent = "Copiado ✓";
  setTimeout(() => btn.textContent = "Copiar mensaje", 1400);
});

document.getElementById("restartBtn").addEventListener("click", () => {
  answers.plan = "";
  answers.dia = "";
  answers.horario = "";
  answers.respuesta = "";
  showStep(1);
});

showStep(1);
