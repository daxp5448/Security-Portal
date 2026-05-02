import api from "./api";


export const registerUser = (data) => {
  return api.post("/auth/register", {
    email: data.email,
    full_name: data.fullName,
    password: data.password,
    is_active: true,
    is_superuser: false,
  });
};


export const loginUser = (email, password) => {
  const formData = new URLSearchParams();
  formData.append("username", email);
  formData.append("password", password);

  return api.post("/auth/login", formData, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
};

export const forgotPasswordItem = (email) => {
  return api.post("/auth/forgot-password", { email });
};
