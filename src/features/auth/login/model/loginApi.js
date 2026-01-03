export async function loginRequest(formData) {
  const response = await fetch('http://localhost:8080/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
    credentials: "include"
  });

  if (!response.ok) throw new Error("Login failed");
  return response.json();
}