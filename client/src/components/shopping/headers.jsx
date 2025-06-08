import {
  ClipboardCheck,
  HousePlug,
  LogOut,
  Menu,
  ShoppingCart,
  UserCog,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { shoppingViewHeaderMenuItems } from "@/config";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { HiOutlineMailOpen } from "react-icons/hi";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { logout } from "@/store/authslice";
import CartWrapper from "./cart-wrapper";
import { fetchUserItems } from "@/store/shop/cart-slice";
import { Label } from "../ui/label";
import axios from "axios";
import { toast } from "sonner";
import { Separator } from "../ui/separator";

function MenuItem() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  //!filter need to learn
  function handleNavigate(getMenuItem) {
    sessionStorage.removeItem("filters");
    const filterNav =
      getMenuItem.id !== "home" &&
      getMenuItem.id !== "products" &&
      getMenuItem.id !== "search"
        ? { category: [getMenuItem.id] }
        : null;
    sessionStorage.setItem("filters", JSON.stringify(filterNav));

    location.pathname.includes("listing") && filterNav !== null
      ? setSearchParams(new URLSearchParams(`?category=${getMenuItem.id}`))
      : navigate(getMenuItem.path);
  }
  return (
    <nav className="flex flex-col p-2  mb-3 lg:mb-0 lg:items-center gap-6 lg:flex-row">
      {shoppingViewHeaderMenuItems.map((menuItem) => (
        <Label
          key={menuItem.id}
          className="text-sm font-medium cursor-pointer"
          onClick={() => handleNavigate(menuItem)}
        >
          {menuItem.label}{" "}
        </Label>
      ))}
    </nav>
  );
}

function HeaderRightContent() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [openCartSheet, setOpenCartSheet] = useState(false);
  const { cartItem } = useSelector((state) => state.shopCart);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleVerifyEmail() {
    try {
      setLoading(true);
      const response = await axios.post(
        `http://localhost:8080/api/email/send/verification/${user._id}`
      );
      if (response.status === 201) {
        navigate("/verify/email");
        console.log(response, "hanlder");
        toast.success("Verification sent to your gmail");
        return;
      }
      console.log(response, "hanlder");
      toast.error("Something wend wrong");
    } catch (error) {
      console.error("Invalid server error ", error);
    } finally {
      setLoading(false);
    }
  }

  function handleLogOut() {
    dispatch(logout());
  }

  useEffect(() => {
    dispatch(fetchUserItems(user._id));
  }, [dispatch]);

  if (loading) {
    return <div>...Loading</div>;
  }

  return (
    <div className="flex lg:items-center lg:flex-row flex-col gap-4">
      <Sheet open={openCartSheet} onOpenChange={() => setOpenCartSheet(false)}>
        <Button
          onClick={() => setOpenCartSheet(true)}
          variant="outline"
          size="icon"
          className={"relative"}
        >
          <ShoppingCart className="w-6 h-6" />
          <span className="absolute top-[-4px] right-[2px] text-sm">
            {cartItem.items?.length || 0}
          </span>
          <span className="sr-only">User Cart</span>
        </Button>
        <CartWrapper
          setOpenCartSheet={setOpenCartSheet}
          cartItems={
            cartItem && cartItem.items && cartItem.items.lenght > 0
              ? []
              : cartItem.items
          }
        />
      </Sheet>

      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar className="bg-black cursor-pointer">
            <AvatarFallback className="bg-black text-white font-extrabold">
              {user?.username[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-56 mt-1  " side="right">
          <DropdownMenuLabel>Logged in as {user?.username}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className={"cursor-pointer"}
            onClick={() => navigate("/shop/account")}
          >
            <UserCog className="mr-2 w-4 h-4 " />
            Account
          </DropdownMenuItem>
          <Separator className={"my-1"} />
          {user.emailVerify === false && loading === false ? (
            <div>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className={"cursor-pointer"}
                onClick={handleVerifyEmail}
              >
                {" "}
                <HiOutlineMailOpen /> Verify Your Email
              </DropdownMenuItem>
            </div>
          ) : (
            <h2 className="flex gap-2 ml-1 ">
              <ClipboardCheck className="" /> Your Email is verifyed
            </h2>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem className={"cursor-pointer"} onClick={handleLogOut}>
            <LogOut className="mr-2 w-4 h-5" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default function ShoppingHeader() {
  return (
    <header className="sticky top-0 z-40 w-full h-[10vh] border-b border-2 bg-gray-100">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <Link to="/shop/home" className=" flex items-center gap-2">
          <HousePlug className="h-6 w-6" />
          <span className="font-bold"> Ecommerce</span>
        </Link>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="lg:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle Header Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent className="w-full max-w-5xl p-2" side="left">
            <MenuItem />
            <HeaderRightContent />
          </SheetContent>
        </Sheet>
        <div className=" hidden lg:block">
          <MenuItem />
        </div>

        <div className="hidden lg:block">
          <HeaderRightContent />
        </div>
      </div>
    </header>
  );
}
