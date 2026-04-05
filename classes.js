const juniorClasses = ["JSS1", "JSS2", "JSS3"];

// Senior now includes departments
const seniorClasses = [
  "SS1 Science","SS1 Art","SS1 Commercial",
  "SS2 Science","SS2 Art","SS2 Commercial",
  "SS3 Science","SS3 Art","SS3 Commercial"
];

function isJunior(className){
  return juniorClasses.includes(className);
}

function isSenior(className){
  return className.startsWith("SS");
}

function getDepartment(className){
  if(className.includes("Science")) return "Science";
  if(className.includes("Art")) return "Art";
  if(className.includes("Commercial")) return "Commercial";
  return null;
}