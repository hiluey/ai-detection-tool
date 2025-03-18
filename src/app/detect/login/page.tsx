"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import "@/styles/login.css";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function Login() {
    const [username, setUsername] = useState(""); // Campo para o nome de usuário
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        // Verifica se o nome de usuário e senha foram preenchidos
        if (!username || !password) {
            setError("Username and password are required!");
            return;
        }

        // Verifica se o usuário existe na tabela "users"
        const { data: userData, error: userError } = await supabase
            .from("users")
            .select("*")
            .eq("username", username)
            .single(); // Acha um único usuário

        if (userError || !userData) {
            setError("User not found!");
            return;
        }

        // Tenta autenticar com o email e senha associados ao usuário
        const { data, error } = await supabase.auth.signInWithPassword({
            email: userData.email, // Pega o email do usuário
            password,
        });

        if (error) {
            setError(error.message);
        } else {
            // Armazena o token de sessão no cookie
            document.cookie = `supabaseToken=${data.session.access_token}; path=/;`;

            router.push("/detect");
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="login-container">
            <div className="login-image">
                <img src="\detect\login\undetectable_ai_cover.png" alt="Undetectable AI Logo" className="imgLogin" />
                <img src="\detect\login\conex.png" alt="Undetectable AI Logo" className="imgConex" />
            </div>

            <div className="login-box">
                <h2>Sign In</h2>
                <form onSubmit={handleLogin}>
                    <div className="input-container">
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="login-input"
                            required
                        />
                        <label htmlFor="username" className="login-label">Username</label>
                    </div>

                    <div className="input-container">
                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="login-input"
                            required
                        />
                        <label htmlFor="password" className="login-label">Password</label>
                        <button
                            type="button"
                            className="toggle-password-btn"
                            onClick={togglePasswordVisibility}
                        >
                            {showPassword ? <FiEyeOff /> : <FiEye />}
                        </button>
                    </div>

                    {error && <p className="login-error">{error}</p>}

                    <button type="submit" className="login-button">
                        Log In
                    </button>
                </form>

                <div className="signup">
                    <p>
                        Don't have an account? <a href="/detect/signup" className="signup-link">Sign up</a>
                    </p>
                </div>
            </div>
        </div>
    );
}
