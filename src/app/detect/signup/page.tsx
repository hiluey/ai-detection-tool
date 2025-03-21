'use client';

import { useState } from "react";
import { supabase } from '../../../lib/supabase'; 
import { useRouter } from "next/navigation";
import "@/styles/signup.css";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function Signup() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!name || !email || !password || !username) {
            setError("All fields are required!");
            return;
        }

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            setError(error.message);
        } else {
            if (data && data.user) {
                const { error: userError } = await supabase
                    .from("users")
                    .insert([{ username, email, id: data.user.id }]);

                if (userError) {
                    setError(userError.message);
                } else {
                    setSuccess("Registration successful! Redirecting...");
                    setTimeout(() => {
                        router.push("/detect/login");
                    }, 2000);
                }
            } else {
                setError("User creation failed. Please try again.");
            }
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="signup-container">
            <div className="signup-image">
                <img src="\detect\login\undetectable_ai_cover.png" alt="Undetectable AI Logo" className="imgLogin" />
                <img src="\detect\login\conex.png" alt="Undetectable AI Logo" className="imgConex" />
            </div>

            <div className="signup-box">
                <h2>Sign Up</h2>
                <form onSubmit={handleSignup}>
                    <div className="input-container">
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="signup-input"
                            required
                            placeholder=" "
                        />
                        <label htmlFor="name" className={`signup-label ${name ? 'filled' : ''}`}>
                            Name <span className="required">*</span>
                        </label>
                    </div>

                    <div className="input-container">
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="signup-input"
                            required
                            placeholder=" "
                        />
                        <label htmlFor="username" className={`signup-label ${username ? 'filled' : ''}`}>
                            Username <span className="required">*</span>
                        </label>
                    </div>

                    <div className="input-container">
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="signup-input"
                            required
                            placeholder=" "
                        />
                        <label htmlFor="email" className={`signup-label ${email ? 'filled' : ''}`}>
                            Email <span className="required">*</span>
                        </label>
                    </div>

                    <div className="input-container">
                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="signup-input"
                            required
                            placeholder=" "
                        />
                        <label htmlFor="password" className={`signup-label ${password ? 'filled' : ''}`}>
                            Password <span className="required">*</span>
                        </label>
                        <button
                            type="button"
                            className="toggle-password-btn"
                            onClick={togglePasswordVisibility}
                        >
                            {showPassword ? <FiEyeOff /> : <FiEye />}
                        </button>
                    </div>

                    {error && <p className="signup-error">{error}</p>}
                    {success && <p className="signup-success">{success}</p>}

                    <button type="submit" className="signup-button">
                        Sign Up
                    </button>
                </form>

                <div className="login">
                    <p>
                        Already have an account? <a href="/detect/login" className="login-link">Login</a>
                    </p>
                </div>
            </div>
        </div>
    );
}
