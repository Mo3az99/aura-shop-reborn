import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const UserAuth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState<any>(null);
  const [mode, setMode] = useState<"login" | "signup">("login");

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();
  }, []);

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
    else window.location.reload();
  };

  const handleSignup = async () => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) alert(error.message);
    else alert("Check your email for verification!");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  if (user) {
    return (
      <div className="flex gap-2 items-center">
        <span className="text-sm">{user.email}</span>
        <button onClick={handleLogout} className="text-red-500 text-sm">Logout</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <input
        className="border px-2 py-1 text-sm"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="border px-2 py-1 text-sm"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        onClick={mode === "login" ? handleLogin : handleSignup}
        className="bg-black text-white py-1 text-sm"
      >
        {mode === "login" ? "Login" : "Sign Up"}
      </button>
      <button
        onClick={() => setMode(mode === "login" ? "signup" : "login")}
        className="text-xs underline text-blue-600"
      >
        Switch to {mode === "login" ? "Sign Up" : "Login"}
      </button>
    </div>
  );
};

export default UserAuth;