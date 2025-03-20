"use client";
import React, { Component, ChangeEvent, FormEvent } from "react";
import { supabase } from "@/lib/supabase";
import { FiEye, FiEyeOff } from "react-icons/fi";
import Cookies from 'js-cookie';
import { FaBars, FaHome, FaHistory, FaCog } from "react-icons/fa"; // Adicionei os ícones necessários
import "@/styles/setting.css";  // Importação do CSS
import { useRouter } from 'next/navigation';
import { FaArrowLeft } from 'react-icons/fa';


export default function DetectPage() {
  const router = useRouter();
  const handleLogout = () => {
    Cookies.remove('supabaseToken');
    router.push('/detect/login');
};
  interface AccountSettingsState {
    username: string;
    email: string;
    error: string;
    success: string;
    showPasswordFields: boolean;
    currentPassword: string;
    newPassword: string;
    showCurrentPassword: boolean;
    showNewPassword: boolean;
    loading: boolean;
    sidebarOpen: boolean; // Definição da variável de estado para sidebar
  }

  class AccountSettings extends Component<{}, AccountSettingsState> {
    constructor(props: {}) {
      super(props);
      this.state = {
        username: "",
        email: "",
        error: "",
        success: "",
        showPasswordFields: false,
        currentPassword: "",
        newPassword: "",
        showCurrentPassword: false,
        showNewPassword: false,
        loading: true,
        sidebarOpen: false, // Inicialização do estado sidebarOpen
      };
    }

    async componentDidMount() {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
          this.setState({ error: "User not logged in.", loading: false });
          return;
        }

        const { data, error } = await supabase
          .from("users")
          .select("username, email")
          .eq("id", user.id)
          .single();

        if (error) {
          this.setState({ error: error.message, loading: false });
        } else if (data) {
          this.setState({
            username: data.username || "",
            email: user.email || "",
            loading: false,
          });
        }
      } catch (error) {
        this.setState({ error: "An unexpected error occurred.", loading: false });
      }
    }

    handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      this.setState({ [e.target.id]: e.target.value } as unknown as AccountSettingsState);
    };

    handleUpdate = async (e: FormEvent) => {
      e.preventDefault();
      this.setState({ error: "", success: "" });

      const { username, email } = this.state;
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        this.setState({ error: "User not logged in." });
        return;
      }

      let authUpdate: { email?: string } = {};
      if (email && email !== user.email) authUpdate.email = email;

      if (Object.keys(authUpdate).length > 0) {
        const { error: authError } = await supabase.auth.updateUser(authUpdate);
        if (authError) {
          this.setState({ error: authError.message });
          return;
        }
      }

      const { error: userError } = await supabase
        .from("users")
        .update({ username })
        .eq("id", user.id);

      if (userError) {
        this.setState({ error: userError.message });
      } else {
        this.setState({ success: "Profile updated successfully!" });
      }
    };

    handlePasswordChange = async (e: FormEvent) => {
      e.preventDefault();
      this.setState({ error: "", success: "" });

      const { currentPassword, newPassword } = this.state;

      if (!currentPassword || !newPassword) {
        this.setState({ error: "Please enter both fields." });
        return;
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: this.state.email,
        password: currentPassword,
      });

      if (signInError) {
        this.setState({ error: "Current password is incorrect." });
        return;
      }

      const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });

      if (updateError) {
        this.setState({ error: updateError.message });
      } else {
        this.setState({
          success: "Password updated successfully!",
          showPasswordFields: false,
          currentPassword: "",
          newPassword: "",
        });
      }
    };

    handleDeleteAccount = async () => {
      const confirmDelete = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");

      if (confirmDelete) {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          this.setState({ error: "User not logged in." });
          return;
        }

        await supabase.from("users").delete().eq("id", user.id);
        const { error } = await supabase.auth.signOut();

        if (error) {
          this.setState({ error: error.message });
        } else {
          this.setState({ success: "Account deleted. Redirecting..." });
          setTimeout(() => {
            window.location.href = "/detect/login";
          }, 2000);
        }
      }
    };

    togglePasswordFields = () => {
      this.setState((prevState) => ({ showPasswordFields: !prevState.showPasswordFields }));
    };

    toggleCurrentPasswordVisibility = () => {
      this.setState((prevState) => ({ showCurrentPassword: !prevState.showCurrentPassword }));
    };

    toggleNewPasswordVisibility = () => {
      this.setState((prevState) => ({ showNewPassword: !prevState.showNewPassword }));
    };

    // Função para alternar o estado do sidebar
    toggleSidebar = () => {
      this.setState((prevState) => ({ sidebarOpen: !prevState.sidebarOpen }));
    };
    

    // Funções de navegação
    handleHomeClick = () => {
      router.push('/detect');
    };

    handleHistoryClick = () => {
      router.push('/detect/history'); // Caminho para a página de histórico
    };

    handleSettingsClick = () => {
      router.push('/detect/settings');
    };

    render() {
      const { username, email, error, success, showPasswordFields, currentPassword, newPassword, showCurrentPassword, showNewPassword, loading, sidebarOpen } = this.state;

      if (loading) {
        return <p>Loading user data...</p>;
      }

      return (
<div className="container">

  <header className="header">
    <img src="/detect/login/undetectable_ai_cover.png" alt="Undetectable AI Logo" className="header-logo" />
    <button className="hamburger" onClick={this.toggleSidebar}>
      <FaBars />
    </button>
  </header>

  <main className={`main-content ${!sidebarOpen ? "expanded" : ""}`}>
    <aside className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
      <nav>
        <ul>
          <li><a href="#" onClick={this.handleHomeClick}><FaHome /> Home</a></li>
          <li><a href="#" onClick={this.handleHistoryClick}><FaHistory /> Detection History</a></li>
          <li><a href="#" onClick={this.handleSettingsClick}><FaCog /> Settings</a></li>
        </ul>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </nav>
    </aside>

    <div className="account-container">
      <h2>Account Settings</h2>
       {!showPasswordFields ? (
        <form onSubmit={this.handleUpdate}>
          <div className="input-container">
            <label htmlFor="username">Username</label>
            <input type="text" id="username" value={username} onChange={this.handleChange} required />
          </div>

          <div className="input-container">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" value={email} onChange={this.handleChange} required />
          </div>

          <div className="button-container">
            <button type="submit" className="update-btn">Update Profile</button>
          </div>

          <div className="button-container">
            <button onClick={this.handleDeleteAccount} className="delete-btn">Delete Account</button>
          </div>


          <div className="change-password-container">
            <button type="button" className="change-password-btn" onClick={this.togglePasswordFields}>
              Change Password
            </button>
          </div>
        </form>
      ) : (
        <div className="password-fields">

          <button className="back-btn" onClick={this.togglePasswordFields}>
            <FaArrowLeft /> Back
          </button>

          <div className="input-container">
            <label htmlFor="currentPassword">Current Password</label>
            <input
              type={showCurrentPassword ? "text" : "password"}
              id="currentPassword"
              value={currentPassword}
              onChange={this.handleChange}
              required
            />
            <button type="button" onClick={this.toggleCurrentPasswordVisibility}>
              {showCurrentPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>

          <div className="input-container">
            <label htmlFor="newPassword">New Password</label>
            <input
              type={showNewPassword ? "text" : "password"}
              id="newPassword"
              value={newPassword}
              onChange={this.handleChange}
              required
            />
            <button type="button" onClick={this.toggleNewPasswordVisibility}>
              {showNewPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>

          <button type="button" onClick={this.handlePasswordChange} className="update-btn">
            Change Password
          </button>
        </div>
      )}

      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
    </div>
  </main>
</div>



      );
    }
  }

  return <AccountSettings />;
}
