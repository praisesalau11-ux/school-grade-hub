// ================= UI HELPERS =================
function showToast(msg, isError = false){
  const t = document.getElementById("toast");
  t.innerText = msg;
  t.style.background = isError ? "#ef4444" : "#22c55e";
  t.style.display = "block";
  setTimeout(()=> t.style.display="none", 3000);
}

function showSignup(){
  signupForm.classList.remove("hidden");
  loginForm.classList.add("hidden");
  title.innerText = "Sign Up";
}

function showLogin(){
  signupForm.classList.add("hidden");
  loginForm.classList.remove("hidden");
  title.innerText = "Login";
}

// ================= VALIDATION =================
function isEmpty(value){
  return !value || value.trim() === "";
}

// ================= SIGNUP =================
async function signup(){

  const firstName = document.getElementById("firstName").value;
  const lastName = document.getElementById("lastName").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const phone = document.getElementById("phone").value;
  const dob = document.getElementById("dob").value;
  const gender = document.getElementById("genderSelect").value;
  const className = document.getElementById("classSelect").value;

  // 🔴 Empty check
  if (
    isEmpty(firstName) || isEmpty(lastName) || isEmpty(email) ||
    isEmpty(password) || isEmpty(confirmPassword) ||
    isEmpty(phone) || isEmpty(dob) ||
    isEmpty(gender) || isEmpty(className)
  ){
    showToast("Please fill in all fields", true);
    return;
  }

  // 🔴 Password match
  if(password !== confirmPassword){
    showToast("Passwords do not match", true);
    return;
  }

  try {
    // 🔍 Check if phone already exists
    const phoneCheck = await db.collection("users")
      .where("phone", "==", phone)
      .get();

    if(!phoneCheck.empty){
      showToast("Phone number already in use", true);
      return;
    }

    // 🔐 Create user
    const userCred = await auth.createUserWithEmailAndPassword(email, password);

    const uid = userCred.user.uid;

    // 💾 Save user data
    await db.collection("users").doc(uid).set({
      firstName,
      lastName,
      email,
      phone,
      dob,
      gender,
      className,
      createdAt: new Date()
    });

    showToast("Signup successful ✅");

    // Switch to login
    showLogin();

  } catch (err){

    if(err.code === "auth/email-already-in-use"){
      showToast("Email already in use", true);
    } else if(err.code === "auth/invalid-email"){
      showToast("Invalid email", true);
    } else if(err.code === "auth/weak-password"){
      showToast("Password too weak", true);
    } else {
      showToast(err.message, true);
    }

  }
}

// ================= LOGIN =================
async function login(){

  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  if(isEmpty(email) || isEmpty(password)){
    showToast("Fill in email and password", true);
    return;
  }

  try {
    await auth.signInWithEmailAndPassword(email, password);

    showToast("Login successful ✅");

    // Redirect to dashboard
    window.location.href = "app.html";

  } catch (err){
    showToast("Invalid login credentials", true);
  }
}

// ================= AUTH STATE =================
auth.onAuthStateChanged(user=>{
  if(user && window.location.pathname.includes("app.html")){
    window.location.href = "app.html";
  }
});