// pages/auth/Login.jsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
// import { Spinner } from "@/components/ui/spinner";
import { oAuth } from "@/store/authslice";

export default function Oauth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(false);

  const { isAuthenticated, isLoading, error } = useSelector(
    (state) => state.auth
  );

  const code = searchParams.get("code");
  const state = searchParams.get("state");

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8080/api/google";
  };

  useEffect(() => {
    // If user is already authenticated, redirect
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    // Handle OAuth callback if code and state exist
    if (code && state && !isAuthenticated && !isProcessing) {
      const processOAuth = async () => {
        setIsProcessing(true);
        try {
          await dispatch(oAuth({ code, state })).unwrap();
        } catch (err) {
          console.error("OAuth failed:", err);
        } finally {
          setIsProcessing(false);
        }
      };
      processOAuth();
    }
  }, [code, state, dispatch, isAuthenticated]);

  if (isLoading || isProcessing) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          {/* <Spinner className="w-12 h-12" /> */}
          <p className="text-lg">Signing in with Google...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center ">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow">
        {error && (
          <div className="p-4 text-red-600 bg-red-100 rounded-md">{error}</div>
        )}

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
