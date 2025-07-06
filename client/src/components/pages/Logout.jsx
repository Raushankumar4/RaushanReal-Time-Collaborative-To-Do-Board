import { useMutation } from "@tanstack/react-query";
import { logout } from "../services/authService";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Button from "../resuable/Button";

const Logout = () => {
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      localStorage.removeItem("token")
      toast.success("You have been logged out.");
      navigate("/");
    },
    onError: () => {
      toast.error("Logout failed");
    },
  });

  return (
    <Button type="submit"
      onClick={() => mutate()}
      disabled={isPending}

    >
      {isPending ? "Logging out..." : "Logout"}
    </Button>
  );
};

export default Logout;
