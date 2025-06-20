import React from "react";
import { Button } from "../ui/button";
import { AlignJustify, LogOut } from "lucide-react";
import { useDispatch } from "react-redux";
import { logout, resetToken } from "@/store/authslice";
import { useNavigate } from "react-router-dom";

export default function AdminHeader({ setOpen }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function handleLogout() {
    // dispatch(logout());
    dispatch(resetToken());
    sessionStorage.clear();
    navigate("/auth/login");
  }

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-background border-b">
      <Button
        onClick={() => setOpen(true)}
        className="lg:hidden sm:block cursor-pointer"
      >
        <AlignJustify />
        <span className="sr-only">Toggle Menu</span>
      </Button>
      <div className="flex flex-1 justify-end">
        <Button
          onClick={handleLogout}
          className="inline-flex gap-2 items-center rounded-md px-4 py-2 text-sm font-md shadow cursor-pointer"
        >
          <LogOut />
          Logout{" "}
        </Button>
      </div>
    </header>
  );
}
