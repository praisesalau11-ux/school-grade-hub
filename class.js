// class.js

const classes = [
  "JSS1","JSS2","JSS3",
  "SS1 Science","SS1 Art","SS1 Commercial",
  "SS2 Science","SS2 Art","SS2 Commercial",
  "SS3 Science","SS3 Art","SS3 Commercial"
];

function loadClasses(selectId) {
  const select = document.getElementById(selectId);
  if (!select) return;

  classes.forEach(c => {
    const option = document.createElement("option");
    option.value = c;
    option.textContent = c;
    select.appendChild(option);
  });
}