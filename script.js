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

const answers = { plan:"", dia:"", horario:"", respuesta:"" };
const months = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];

function showStep(step){
  currentStep = step;
  steps.forEach(s => s.classList.toggle("active", Number(s.dataset.step) === step));
  const visible = Math.min(step,5);
  stepText.textContent = step === 6 ? "Ticket generado" : `Paso ${visible} de 5`;
  barFill.style.width = step === 6 ? "100%" : `${(visible/5)*100}%`;
  if(step === 3) renderCalendar();
  
  if(step !== 3){
    window.scrollTo({top:0,behavior:"smooth"});
  }

}

function formatDate(date){
  return date.toLocaleDateString("es-AR",{weekday:"long",day:"numeric",month:"long",year:"numeric"});
}
function sameDay(a,b){
  return a.getFullYear()===b.getFullYear() && a.getMonth()===b.getMonth() && a.getDate()===b.getDate();
}

function renderCalendar(){
  calendar.innerHTML = "";
  const y = calendarDate.getFullYear();
  const m = calendarDate.getMonth();
  monthLabel.textContent = `${months[m]} ${y}`;

  const first = new Date(y,m,1);
  const last = new Date(y,m+1,0);
  const firstWeekday = (first.getDay()+6)%7;
  const today = new Date();
  today.setHours(0,0,0,0);

  for(let i=0;i<firstWeekday;i++){
    const empty = document.createElement("button");
    empty.className = "day empty";
    empty.type = "button";
    empty.disabled = true;
    calendar.appendChild(empty);
  }

  for(let d=1; d<=last.getDate(); d++){
    const date = new Date(y,m,d);
    date.setHours(0,0,0,0);
    const btn = document.createElement("button");
    btn.className = "day";
    btn.type = "button";
    btn.textContent = d;

    if(sameDay(date,today)) btn.classList.add("today");
    if(date < today){
      btn.classList.add("past");
      btn.disabled = true;
    }

    btn.addEventListener("click",()=>{
      answers.dia = formatDate(date);
      showStep(4);
    });

    calendar.appendChild(btn);
  }
}

function message(){
  return `Hola Eze 😄

Ya tengo mi pasaporte de salida:

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

  const msg = message();
  document.getElementById("message").value = msg;

  // Cambiar por tu número con código país. Ej: 549261XXXXXXXX
  const phone = "";
  document.getElementById("waBtn").href = phone
    ? `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`
    : `https://wa.me/?text=${encodeURIComponent(msg)}`;
}

document.querySelector(".next").addEventListener("click",()=>showStep(2));

document.querySelectorAll(".options").forEach(group=>{
  group.querySelectorAll("button").forEach(btn=>{
    btn.addEventListener("click",()=>{
      answers[group.dataset.key] = btn.dataset.value;
      if(currentStep < 5) showStep(currentStep+1);
      else { renderResult(); showStep(6); }
    });
  });
});

prevMonth.addEventListener("click",()=>{ calendarDate.setMonth(calendarDate.getMonth()-1); renderCalendar(); });
nextMonth.addEventListener("click",()=>{ calendarDate.setMonth(calendarDate.getMonth()+1); renderCalendar(); });
otherDayBtn.addEventListener("click",()=>{ answers.dia = "Otro día / lo hablamos"; showStep(4); });

document.getElementById("copyBtn").addEventListener("click",async()=>{
  try{
    await navigator.clipboard.writeText(document.getElementById("message").value);
    const b = document.getElementById("copyBtn");
    b.textContent = "Copiado ✓";
    setTimeout(()=>b.textContent="Copiar",1400);
  }catch{
    document.getElementById("message").select();
  }
});

document.getElementById("restartBtn").addEventListener("click",()=>{
  answers.plan = answers.dia = answers.horario = answers.respuesta = "";
  calendarDate = new Date();
  showStep(1);
});

showStep(1);
