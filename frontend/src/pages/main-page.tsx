import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router-dom";

const MainPage = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut(); // clear user, tokens, etc.
      navigate("/login", { replace: true });
    } catch (err: any) {
      console.error("Sign out failed:", err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">MainPage</h1>
      {/* Your main content… */}
      <button
        onClick={handleSignOut}
        className="mt-4 bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
      >
        Sign Out
      </button>
    </div>
  );
};

export default MainPage;
