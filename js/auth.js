const port = 5500;//change the port based on your pc
const api_port=8080

export async function signup(event) {
  event.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const email = document.getElementById("email").value;
  console.log(email)
  try {
    const result = await fetch(`http://localhost:${api_port}/auth/signup`, {
      method: "POST",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
        email,
      }),
    });
    const data = await result.json();
    console.log(data.status);
    if (result.ok) {
      window.location.href=`http://127.0.0.1:${port}/html/login.html`
    }
    return data;
  } catch (e) {
    console.log(e);
  }
}

export async function login(event) {
  event.preventDefault(); // Prevent pagesrefresh
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const result = await fetch(`http://localhost:${api_port}/auth/login`, {
      method: "POST",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await result.json();
    console.log(data);
    if (result.ok) {
      console.log("Login successful:", data);
      localStorage.setItem("token", data.token); // Save token to localStorage
      console.log( "hello",localStorage.getItem("token"))
      window.location.href = `http://127.0.0.1:${port}/html/home.html`
    } else {
      console.error("Login failed:", data.message);
      alert("Login failed: " + data.message); // Show error message to the user
    }
 
  } catch (e) {
    console.log(e);
  }
}

export async function logout() {
  try {
    const token = localStorage.getItem("token");
    console.log("hiii",localStorage.getItem("token"))
    const result = await fetch(`http://localhost:${api_port}/auth/logout`, {
      method: "DELETE",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Add "Bearer" prefix

      },
      
    });
    const data = await result.json();
    console.log("hiii",data);
    if (result.ok) {
      window.location.href = `http://127.0.0.1:${port}/html/login.html`
      localStorage.removeItem("token");
      
    }
    else {
      console.error("can't logout")
    }
    return data;
  } catch (e) {
    console.log("errrrror",e);
  }
}

function isAuthenticated() {
  console.log("hello")
  console.log(window.location.href)

  if (`http://127.0.0.1:5500/html/home.html` === window.location.href) {
    const token = localStorage.getItem("token");
    console.log(token);
    if (!token) window.location.href = `http://127.0.0.1:${port}/html/login.html`;
  }
}
document.addEventListener("DOMContentLoaded",isAuthenticated);
document.getElementById("login-form")?.addEventListener("submit", login);
document.getElementById("signup-form")?.addEventListener("submit", signup);
document.getElementsByClassName("sign-out-btn")[0]?.addEventListener("click", logout);
