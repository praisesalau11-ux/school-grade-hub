const MATH_QUESTIONS = [];

function getRandomInt(min, max){
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(arr){
  return arr.sort(()=>Math.random()-0.5);
}

// Generate 50,000 questions automatically
for(let i = 1; i <= 50000; i++){

  let a = getRandomInt(10, 1000);
  let b = getRandomInt(10, 1000);

  let correct = a + b;

  let wrong1 = correct + getRandomInt(1, 100);
  let wrong2 = correct - getRandomInt(1, 100);
  let wrong3 = correct + getRandomInt(101, 200);

  MATH_QUESTIONS.push({
    id: "math_" + i,
    q: `Solve: ${a} + ${b}`,
    options: shuffle([correct, wrong1, wrong2, wrong3]),
    a: correct
  });
}