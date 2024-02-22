import logout from "../components/auth-components";
import { auth } from "../firebase";

export default function Home() {
  return (
    <h1>
      <button onClick={logout}>Log Out</button>
    </h1>
  );
}
