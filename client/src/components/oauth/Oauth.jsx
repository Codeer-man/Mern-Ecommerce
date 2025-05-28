import { Button } from "@/components/ui/button";
import { checkauth } from "@/store/authslice";
import { auth, provider } from "@/utils/firebase";
import axios from "axios";
import { signInWithPopup } from "firebase/auth";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function OAuth() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  async function handleGoogleLogin(e) {
    e.preventDefault();
    try {
      const response = await signInWithPopup(auth, provider);
      const user = response.user;

      const newUserData = {
        googleId: user.uid,
        username: user.displayName,
        email: user.email,
        avatar: user.photoURL,
        provider: "google",
        phoneNumber: user.phoneNumber,
      };

      const res = await axios.post(
        "http://localhost:8080/api/auth/o-auth/google-route",
        newUserData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      dispatch(checkauth());
      const role = res.data?.data?.role;
      if (role === "admin") {
        console.log("navigating to /admin/dashboard");
        navigate("/admin/dashboard");
      } else {
        console.log("navigating to /shop/home");
        navigate("/shop/home");
      }
      toast.success(res?.data.message);

      // setTimeout(() => {
      //   console.log("AFTER NAVIGATE:", window.location.pathname);
      // }, 1000);
    } catch (error) {
      console.error("Google login error:", error);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center cursor-pointer w-full">
      <div className="w-full max-w-md space-y-8 bg-white rounded-lg">
        <Button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-2"
          variant="outline"
        >
          <img
            src="https://www.google.com/favicon.ico"
            alt="Google logo"
            className="w-5 h-5"
          />
          Continue with Google
        </Button>
      </div>
    </div>
  );
}
