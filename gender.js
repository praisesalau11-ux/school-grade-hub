// gender.js

const genders = ["Male", "Female"];

function loadGenders(selectId) {
  const select = document.getElementById(selectId);
  if (!select) return;

  genders.forEach(g => {
    const option = document.createElement("option");
    option.value = g;
    option.textContent = g;
    select.appendChild(option);
  });
}