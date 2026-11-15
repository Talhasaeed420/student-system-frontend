// The API URL comes from the .env file (VITE_API_URL)
const API_URL = import.meta.env.VITE_API_URL;

async function request(path, { method = "GET", body } = {}) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (res.status === 401 && path !== "/auth/login") {
    localStorage.removeItem("token");
    window.location.reload();
  }
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
}

export const api = {
  login: (email, password) => request("/auth/login", { method: "POST", body: { email, password } }),
  list: (params) => request(`/students?${new URLSearchParams(params)}`),
  stats: () => request("/students/stats"),
  create: (s) => request("/students", { method: "POST", body: s }),
  update: (id, s) => request(`/students/${id}`, { method: "PUT", body: s }),
  remove: (id) => request(`/students/${id}`, { method: "DELETE" }),
};
