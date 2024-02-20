import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const navigate = useNavigate();
  onAuthStateChanged(auth, (user) => {
    if (user === null) {
      navigate("/login");
    }
  });
  return children;
}
