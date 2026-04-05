const GENERAL_QUESTIONS = [];

function shuffle(arr){
  return arr.sort(()=>Math.random()-0.5);
}

const base = [
  {q:"Capital of France?", a:"Paris", wrong:["Rome","Berlin","Madrid"]},
  {q:"Capital of Japan?", a:"Tokyo", wrong:["Seoul","Beijing","Bangkok"]},
  {q:"Capital of Nigeria?", a:"Abuja", wrong:["Lagos","Kano","Ibadan"]}
];

for(let i=1;i<=50000;i++){

  let item = base[Math.floor(Math.random()*base.length)];

  GENERAL_QUESTIONS.push({
    id: "gen_" + i,
    q: item.q,
    options: shuffle([item.a, ...item.wrong]),
    a: item.a
  });
}