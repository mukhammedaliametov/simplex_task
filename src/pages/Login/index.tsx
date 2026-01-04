import React, { useState } from "react";
import Logo from "../../assets/logo.png";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const Login = () => {
  const navigate = useNavigate();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const ENV_LOGIN = import.meta.env.VITE_LOGIN;
    const ENV_PASSWORD = import.meta.env.VITE_PASSWORD;

    if (login === ENV_LOGIN && password === ENV_PASSWORD) {
      localStorage.setItem("isAuth", "true");
      localStorage.setItem("justLoggedIn", "true");
      navigate("/");
    } else {
      toast.error("Login yoki parol noto‘g‘ri!");
    }
  };

  return (
    <section className="bg-[#1E1E1E] w-full h-screen flex items-center text-white">
      <Toaster position="top-center" />
      <div className="bg-[#353535] rounded-md w-md mx-auto py-6 px-4">
        <img src={Logo} alt="logo" width="200px" className="mx-auto" />
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-8">
          <div className="flex flex-col gap-1">
            <label htmlFor="login">Login</label>
            <input
              id="login"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              className="border border-white focus:border-[#FF733B] p-3 outline-none rounded-md"
              type="text"
              placeholder="Login"
              autoComplete="off"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="password">Parol</label>
            <input
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-white focus:border-[#FF733B] p-3 outline-none rounded-md"
              type="password"
              placeholder="Parol"
              autoComplete="off"
            />
          </div>
          <button
            type="submit"
            className="bg-[#FF733B] py-3 rounded-md hover:opacity-80 cursor-pointer"
          >
            Tizimga Kirish
          </button>
        </form>
      </div>
    </section>
  );
};

export default Login;
