'use client';

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import "@/styles/login.css";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!username || !password) {
            setError("Username and password are required!");
            return;
        }

        const { data: userData, error: userError } = await supabase
            .from("users")
            .select("*")
            .eq("username", username)
            .single();

        if (userError || !userData) {
            setError("User not found!");
            return;
        }

        const { data, error } = await supabase.auth.signInWithPassword({
            email: userData.email,
            password,
        });

        if (error) {
            setError(error.message);
        } else {
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
                            placeholder=" "
                        />
                        <label htmlFor="username" className={`login-label ${username ? 'filled' : ''}`}>Username</label>
                    </div>

                    <div className="input-container">
                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="login-input"
                            required
                            placeholder=" "
                        />
                        <label htmlFor="password" className={`login-label ${password ? 'filled' : ''}`}>Password</label>
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
