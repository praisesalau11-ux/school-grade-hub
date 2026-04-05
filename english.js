const ENGLISH_QUESTIONS = [];

function shuffle(arr){
  return arr.sort(()=>Math.random()-0.5);
}

const verbs = ["go","eat","write","run","speak","see","take","come","buy"];

for(let i=1;i<=50000;i++){

  let verb = verbs[Math.floor(Math.random()*verbs.length)];

  let correct = verb + "s";
  let wrong1 = verb;
  let wrong2 = verb + "ed";
  let wrong3 = verb + "ing";

  ENGLISH_QUESTIONS.push({
    id: "eng_" + i,
    q: `Choose the correct present tense form of "${verb}"`,
    options: shuffle([correct, wrong1, wrong2, wrong3]),
    a: correct
  });
}