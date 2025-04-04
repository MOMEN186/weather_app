const port = 8080;//change the port based on your pc


export async function signup(event) {
  event.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const email = document.getElementById("email").value;
  console.log("Sending:", { username, password, email }); 
  try {
    const result = await fetch(`http://localhost:${port}/auth/signup`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username,
            password,
            email,
        }),
    });
    
    
    
    if(result.ok){
      alert("Signup successful! You can now log in.");
      window.location.href = '../html/login.html'
      
    }
    if (!result.ok) {
        const errorData = await result.json();
        console.error("Backend error:", errorData);
        throw new Error(errorData.message || 'Signup failed');
    }
    
    const data = await result.json();
    return data;
} catch (e) {
    console.error("Signup error:", e);
    
}
}

export async function login(event) {
  event.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  try {
    const result = await fetch(`http://localhost:${port}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });

    if (!result.ok) {
      const errorData = await result.json();
      alert(errorData.message || 'Login failed'); 
      return;
    }

    const data = await result.json();
    localStorage.setItem("username", username); 
    localStorage.setItem("token", data.token);
    
    
    // Show success message
    console.log('Login successful! Redirecting to home page...');
    
    // Redirect to home page
    window.location.href = '../html/home.html'
    
  } catch (e) {
    console.error("Login error:", e);
    alert('An error occurred during login');
  }
}

function logout() {
  const username = localStorage.getItem("username");
  
  fetch(`http://localhost:${port}/auth/logout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
  })
  .then((res) => res.json())
  .then((data) => {
      if (data.success) {
          localStorage.removeItem("username"); 
          localStorage.removeItem("token");
          window.location.href = "../html/login.html"     
      }
  })
  .catch((error) => console.error("Error logging out:", error));
}




document.getElementById("login-form")?.addEventListener("submit", login);
document.getElementById("signup-form")?.addEventListener("submit", signup);
document.getElementById("signout")?.addEventListener("click", (e) => {
  console.log("Logout button clicked!"); 
  logout();
});
