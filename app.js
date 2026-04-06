// ================= ELEMENTS =================
let classSelect, departmentSelect;
let historyBox, profileBox, gameBox, leaderboardBox;

let chartInstance = null;

// ================= INIT =================
document.addEventListener("DOMContentLoaded", () => {

  classSelect = document.getElementById("classSelect");
  departmentSelect = document.getElementById("departmentSelect");

  historyBox = document.getElementById("historyBox");
  profileBox = document.getElementById("profileBox");
  gameBox = document.getElementById("gameBox");
  leaderboardBox = document.getElementById("leaderboardBox");

  classSelect.innerHTML = [...juniorClasses, ...seniorClasses]
    .map(c=>`<option>${c}</option>`).join("");

  initStreak(); // ✅ streak system init
});

// ================= NAV =================
function goPage(id){
  document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));
  document.getElementById(id).classList.add("active");

  if(id==="profilePage") loadProfile();
  if(id==="historyPage") loadHistory();
  if(id==="leaderboardPage") loadLeaderboard();
}

// ================= NOTIFY =================
function notify(msg){
  const div = document.createElement("div");
  div.innerText = msg;
  div.style.position="fixed";
  div.style.top="10px";
  div.style.right="10px";
  div.style.background="#22c55e";
  div.style.padding="10px";
  document.body.appendChild(div);
  setTimeout(()=>div.remove(),3000);
}

// ================= SUBJECT =================
function loadSubjects(){
  const cls = classSelect.value;
  const deptBox = document.getElementById("departmentBox");

  let subjects = [];

  if(isJunior(cls)){
    deptBox.style.display="none";
    subjects = juniorSubjects;
  }

  if(isSenior(cls)){
    deptBox.style.display="block";
    subjects = getSeniorSubjects(departmentSelect.value);
  }

  renderSubjects(subjects);
}

function renderSubjects(subjects){
  const box = document.getElementById("subjectsBox");
  box.innerHTML="";

  subjects.forEach(sub=>{
    box.innerHTML += `
      <div class="card">
        <label>${sub}</label>
        <input type="number" class="score" data-sub="${sub}">
      </div>
    `;
  });
}

// ================= GRADE SYSTEM =================
function getGrade(percent){
  if(percent >= 80) return "A";
  if(percent >= 70) return "B";
  if(percent >= 60) return "C";
  if(percent >= 50) return "D";
  if(percent >= 40) return "E";
  return "F";
}

// ================= GRADES =================
function calculateGrades(){
  const inputs = document.querySelectorAll(".score");

  let scores=[], labels=[], total=0;

  inputs.forEach(i=>{
    let val = parseFloat(i.value)||0;
    scores.push(val);
    labels.push(i.dataset.sub);
    total+=val;
  });

  let avg = total / inputs.length;
  let gpa = (avg/100)*5;
  let grade = getGrade(avg);

  let weak = labels.filter((s,i)=>scores[i]<50);

  document.getElementById("resultBox").innerHTML = `
    <p>Percentage: ${avg.toFixed(2)}%</p>
    <p>GPA: ${gpa.toFixed(2)}</p>
    <p>Grade: ${grade}</p>
    <p>Weak Subjects: ${weak.join(", ")||"None"}</p>
  `;

  notify("Result calculated 🔥");

  drawChart(labels,scores);

  saveHistory({scores,avg,gpa,grade});
}

// ================= CHART =================
function drawChart(labels,data){
  if(chartInstance) chartInstance.destroy();

  chartInstance = new Chart(document.getElementById("chart"),{
    type:"bar",
    data:{
      labels,
      datasets:[{
        label:"Scores",
        data
      }]
    }
  });
}

// ================= XP =================
async function addXP(amount){
  const user = auth.currentUser;
  if(!user) return;

  const ref = db.collection("users").doc(user.uid);
  const doc = await ref.get();

  let xp = doc.data().xp || 0;
  xp += amount;

  await ref.update({ xp });
}

// ================= LEVEL =================
function getLevel(xp){
  if(xp>=100000) return "Verified";
  if(xp>=80000) return "Fam";
  if(xp>=75000) return "Diamond";
  if(xp>=55000) return "Platinum";
  if(xp>=50000) return "Silver";
  if(xp>=40000) return "Gold";
  if(xp>=35000) return "Leader";
  if(xp>=20000) return "Master";
  if(xp>=10000) return "Elite";
  if(xp>=5000) return "Expert";
  if(xp>=2500) return "Trained";
  if(xp>=1000) return "Starter";
  return "Beginner";
}

// ================= 🔥 STREAK SYSTEM =================
function initStreak(){
  const today = new Date().toDateString();
  let last = localStorage.getItem("lastLoginDate");
  let streak = parseInt(localStorage.getItem("streak")) || 0;

  if(last === today){
    return;
  }

  let yesterday = new Date();
  yesterday.setDate(yesterday.getDate()-1);

  if(last === yesterday.toDateString()){
    streak++;
  } else {
    streak = 1;
  }

  localStorage.setItem("streak", streak);
  localStorage.setItem("lastLoginDate", today);

  notify(`🔥 Streak: ${streak} days`);

  giveStreakReward(streak);
}

// Weekly reward
async function giveStreakReward(streak){
  let bonus = 0;

  if(streak % 7 === 0){
    bonus = 50;
    notify("🎁 Weekly streak reward +50 XP");
  } else {
    bonus = 10;
  }

  await addXP(bonus);
}

// ================= GAME SYSTEM =================
let ALL_QUESTIONS = [
  ...MATH_QUESTIONS,
  ...ENGLISH_QUESTIONS,
  ...HISTORY_QUESTIONS,
  ...GENERAL_QUESTIONS
];

let usedIndexes = new Set();
let currentQ = null;
let timer;
let timeLeft = 20;

let gameTotal = 0;
let gameCount = 0;
let score = 0;

// START GAME
function startGame(){
  usedIndexes.clear();
  gameCount = 0;
  score = 0;

  gameTotal = Math.floor(Math.random() * 41) + 10;

  notify(`Game started 🎮 (${gameTotal})`);

  nextQuestion();
}

// UNIQUE QUESTION
function getUniqueQuestion(){
  if(usedIndexes.size >= ALL_QUESTIONS.length){
    usedIndexes.clear();
  }

  let index;
  do{
    index = Math.floor(Math.random() * ALL_QUESTIONS.length);
  }while(usedIndexes.has(index));

  usedIndexes.add(index);
  return ALL_QUESTIONS[index];
}

// NEXT QUESTION
function nextQuestion(){
  clearInterval(timer);

  if(gameCount >= gameTotal){
    endGame();
    return;
  }

  currentQ = getUniqueQuestion();
  gameCount++;

  renderQuestion(currentQ);
  startTimer();
}

// RENDER
function renderQuestion(q){
  if(q.options){
    let html = q.options.map(opt=>`
      <button onclick="checkGameAnswer('${opt}')">${opt}</button>
    `).join("");

    gameBox.innerHTML = `<h3>${q.q}</h3>${html}`;
  } else {
    gameBox.innerHTML = `
      <h3>${q.q}</h3>
      <input id="ansInput">
      <button onclick="checkGameAnswer()">Submit</button>
    `;
  }
}

// TIMER
function startTimer(){
  timeLeft = 20;
  document.getElementById("timer").innerText = timeLeft;

  timer = setInterval(()=>{
    timeLeft--;
    document.getElementById("timer").innerText = timeLeft;

    if(timeLeft<=0){
      notify(`⏰ Time up! Answer: ${currentQ.a}`);
      nextQuestion();
    }
  },1000);
}

// CHECK
async function checkGameAnswer(selected=null){
  clearInterval(timer);

  let userAnswer = selected !== null
    ? selected
    : document.getElementById("ansInput")?.value;

  if(userAnswer == currentQ.a){
    score++;
    notify("✅ Correct");
  } else {
    notify(`❌ Wrong: ${currentQ.a}`);
  }

  setTimeout(nextQuestion,1000);
}

// END GAME
async function endGame(){

  let xpEarned = score * 2;

  notify(`🎉 ${score}/${gameTotal} (+${xpEarned} XP)`);

  await addXP(xpEarned);

  gameBox.innerHTML = `
    <h3>Finished</h3>
    <p>Score: ${score}/${gameTotal}</p>
  `;
}

// ================= HISTORY =================
async function saveHistory(data){
  const user = auth.currentUser;
  if(!user) return;

  await db.collection("history").add({
    uid:user.uid,
    ...data,
    time:new Date()
  });
}

function loadHistory(){
  const user = auth.currentUser;

  db.collection("history")
  .where("uid","==",user.uid)
  .onSnapshot(snap=>{
    let html="";
    snap.forEach(doc=>{
      let d=doc.data();
      html+=`
        <div class="card">
          GPA: ${d.gpa.toFixed(2)}<br>
          %: ${d.avg.toFixed(2)}<br>
          Grade: ${d.grade}
        </div>
      `;
    });
    historyBox.innerHTML=html;
  });
}

// ================= PROFILE =================
async function loadProfile(){
  const user = auth.currentUser;
  const doc = await db.collection("users").doc(user.uid).get();
  const d = doc.data();

  let level = getLevel(d.xp || 0);
  let streak = localStorage.getItem("streak") || 0;

  profileBox.innerHTML = `
    <div class="card">
      ${d.firstName} ${d.lastName}<br>
      XP: ${d.xp || 0}<br>
      Level: ${level}<br>
      🔥 Streak: ${streak}
    </div>
  `;
}

// ================= LEADERBOARD =================
function loadLeaderboard(){
  db.collection("users")
  .orderBy("xp","desc")
  .limit(20)
  .onSnapshot(snap=>{
    let html="";
    let rank=1;

    snap.forEach(doc=>{
      let d=doc.data();

      let medal = "";
      if(rank===1) medal="🥇";
      else if(rank===2) medal="🥈";
      else if(rank===3) medal="🥉";

      html+=`
        <div class="card">
          ${medal} ${rank}. ${d.firstName} ${d.lastName} - XP: ${d.xp || 0}
        </div>
      `;
      rank++;
    });

    leaderboardBox.innerHTML=html;
  });
}