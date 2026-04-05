// SCIENCE SUBJECTS (Nigeria standard + advanced)
const scienceSubjects = [
  "Mathematics",
  "English Language",
  "Physics",
  "Chemistry",
  "Biology",
  "Further Mathematics",
  "Technical Drawing",
  "Computer Science",
  "Agricultural Science",
  "Civic Education",
  "Geography"
];

// ART SUBJECTS
const artSubjects = [
  "Mathematics",
  "English Language",
  "Literature in English",
  "Government",
  "History",
  "CRS / IRS",
  "Civic Education",
  "Fine Arts",
  "Music",
  "French"
];

// COMMERCIAL SUBJECTS
const commercialSubjects = [
  "Mathematics",
  "English Language",
  "Economics",
  "Accounting",
  "Commerce",
  "Marketing",
  "Business Studies",
  "Office Practice",
  "Civic Education"
];

// FUNCTION
function getSeniorSubjects(department){
  if(department === "Science") return scienceSubjects;
  if(department === "Art") return artSubjects;
  if(department === "Commercial") return commercialSubjects;
  return [];
}