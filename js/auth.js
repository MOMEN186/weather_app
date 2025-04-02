const port = 8080;//changr the port based on your pc


export async function signup(event) {
  event.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const email = document.getElementById("email").value;
  try {
    const result = await fetch(`http://localhost:${port}/auth/signup`, {
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
    console.log(data);
    return data;
  } catch (e) {
    console.log(e);
  }
}

export async function login(event) {
  event.preventDefault(); // Prevent pagesrefresh
  const email = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  try {
    const result = await fetch(`http://localhost:${port}/auth/login`, {
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
    if (result.ok) {
      console.log("Login successful:", data);
      localStorage.setItem("token", data.token); // Save token to localStorage
      //window.location.href = "home.html"; // Redirect to homepage
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
    const result = await fetch(`http://localhost:${port}/auth/logout`, {
      method: "DELETE",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
      },
    });
    const data = await result.json();
    localStorage.removeItem("token");
    return data;
  } catch (e) {
    console.log(e);
  }
}

document.getElementById("login-form")?.addEventListener("submit", login);
document.getElementById("signup-form")?.addEventListener("submit", signup);
document.getElementsByClassName("sign-out-btn")[0]?.addEventListener("click", logout);
