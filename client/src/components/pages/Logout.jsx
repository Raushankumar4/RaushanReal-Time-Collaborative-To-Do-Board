import { useMutation } from "@tanstack/react-query";
import { logout } from "../services/authService";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Logout = () => {
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      toast.success("You have been logged out.");
      navigate("/");
    },
    onError: () => {
      toast.error("Logout failed");
    },
  });

  return (
    <button
      onClick={() => mutate()}
      disabled={isPending}
      style={{
        padding: "0.5rem 1rem",
        background: "#333",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
      }}
    >
      {isPending ? "Logging out..." : "Logout"}
    </button>
  );
};

export default Logout;
