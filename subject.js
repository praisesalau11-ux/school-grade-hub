const SUBJECT_QUESTIONS = [];

function shuffle(arr){
  return arr.sort(()=>Math.random()-0.5);
}

for(let i=1;i<=50000;i++){

  let correct = "Heart";
  let options = ["Heart","Liver","Lungs","Kidney"];

  SUBJECT_QUESTIONS.push({
    id: "sub_" + i,
    q: "Which organ pumps blood in the human body?",
    options: shuffle(options),
    a: correct
  });
}