import { useNavigate } from "react-router-dom";
import { AUTH_API } from "../api/auth";
import { useState } from "react";
import type { RegisterCredentials } from "../interfaces/user";
import axios from "axios";
import Button from "../components/button";
import Input from "../components/input_field";


function Signup() {
  const navigate= useNavigate()

  const [form, setForm] = useState<RegisterCredentials>({
    pseudo: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try{
        await axios.post(AUTH_API.signup, {pseudo: form.pseudo, email: form.email, password: form.password})
        const result = await axios.post(AUTH_API.login, {
            email: form.email,
            password: form.password
        })
        console.log(result?.data?.access)
        localStorage.setItem("access", result.data.access)
        localStorage.setItem("refresh", result.data.refresh)
        
    }catch(err){
        console.log(err)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-8">
      <div className="w-full max-w-sm bg-[#111111] border border-green-500/20 rounded-xl p-8 shadow-[0_0_32px_rgba(34,197,94,0.04)]">
        <div className="text-[11px] tracking-widest text-green-500 uppercase font-medium mb-6 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_6px_#22c55e]" />
          colab.code
        </div>

        <h1 className="text-xl font-semibold text-zinc-100 mb-1">
          Welcome 
        </h1>
        <p className="text-sm text-zinc-500 mb-7">Sign up to your workspace</p>

        <div className="flex flex-col gap-4">

          <Input
            label="Pseudo"
            type="text"
            name="pseudo"
            placeholder="pseudo"
            value={form.pseudo}
            onChange={handleChange}
          />
          <Input
            label="Email"
            type="email"
            name="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
          />
          <Input
            label="Password"
            type="password"
            name="password"
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange}
          />
        </div>

        <Button
          context="SIGN UP"
          trigger={handleSubmit}
          variant="run"
          className="w-full mt-5 tracking-widest"
        />

        <p className="text-center text-xs text-zinc-600 mt-5">
          Already have an account?{" "}
          <span
            className="text-green-500 cursor-pointer hover:text-green-400"
            onClick={() => navigate("/login")}
          >
            Log in
          </span>
        </p>
      </div>
    </div>
  );
}

export default Signup;
