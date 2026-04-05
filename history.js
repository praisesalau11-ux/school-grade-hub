const HISTORY_QUESTIONS = [];

function shuffle(arr){
  return arr.sort(()=>Math.random()-0.5);
}

const base = [
  {q:"When did World War 1 end?", a:"1918", wrong:["1914","1939","1945"]},
  {q:"Who was the first president of USA?", a:"George Washington", wrong:["Abraham Lincoln","John Adams","Jefferson"]},
  {q:"French Revolution started in?", a:"1789", wrong:["1776","1804","1812"]}
];

for(let i=1;i<=50000;i++){

  let item = base[Math.floor(Math.random()*base.length)];

  HISTORY_QUESTIONS.push({
    id: "hist_" + i,
    q: item.q,
    options: shuffle([item.a, ...item.wrong]),
    a: item.a
  });
}