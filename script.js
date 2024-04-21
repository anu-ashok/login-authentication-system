async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}


function getUsersFromStorage() {
  return JSON.parse(localStorage.getItem('users')) || [];
}


function saveUsersToStorage(users) {
  localStorage.setItem('users', JSON.stringify(users));
}

async function registerUser(username, password) {
  let users = getUsersFromStorage();
  if (users.some(u => u.username === username)) {
    alert("Username already exists!");
  } else {
    const hashedPassword = await hashPassword(password);
    users.push({ username: username, password: hashedPassword });
    saveUsersToStorage(users);
    alert("Registration successful!");
    document.getElementById("registerForm").reset();
  }
}


async function loginUser(username, password) {
  let users = getUsersFromStorage();
  const hashedPassword = await hashPassword(password);
  const user = users.find(u => u.username === username && u.password === hashedPassword);
  if (user) {
    alert("Login successful!");
    window.location.href = "securedPage.html"; 
  } else {
    alert("Invalid username or password!");
  }
}


document.getElementById("registerForm").addEventListener("submit", function(event) {
  event.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  if (getUsersFromStorage().some(u => u.username === username)) {

    alert("Username already exists!");
  } else {
    if (password.length < 8) {
      alert("Password must be at least 8 characters long.");
    } else {
      registerUser(username, password);
    }
  }
});


document.getElementById("loginForm").addEventListener("submit", function(event) {
  event.preventDefault();
  const username = document.getElementById("loginUsername").value;
  const password = document.getElementById("loginPassword").value;
  loginUser(username, password);
});
