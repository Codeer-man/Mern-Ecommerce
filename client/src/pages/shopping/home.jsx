import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getShopProduct, getSingleProduct } from "@/store/shop/product-slice";
import ShopingProduct from "@/components/shopping/Product-tile";

import { FaMale, FaFemale, FaChild } from "react-icons/fa";
import { GiWatch, GiConverseShoe } from "react-icons/gi";

import { GiRunningShoe, GiClothes } from "react-icons/gi";
import { FaTshirt, FaShoppingBasket, FaStore } from "react-icons/fa";
import { MdLocalLaundryService } from "react-icons/md";
import { RiImageLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import ProductDetail from "@/pages/shopping/Product-detail";
import { addToCart, fetchUserItems } from "@/store/shop/cart-slice";
import { toast } from "sonner";
import { getFeatuerImage } from "@/store/admin/feature-slice";
import AdsForShowing from "@/components/Advertisement/ads";
import gsap from "gsap";

const categoriesWithIcon = [
  { id: "men", label: "Men", icon: FaMale },
  { id: "women", label: "Women", icon: FaFemale },
  { id: "kids", label: "Kids", icon: FaChild },
  { id: "accessories", label: "Accessories", icon: GiWatch },
  { id: "footwear", label: "Footwear", icon: GiConverseShoe },
];

const brandsWithIcon = [
  { id: "nike", label: "Nike", icon: GiRunningShoe }, // Running shoe
  { id: "adidas", label: "Adidas", icon: MdLocalLaundryService }, // Laundry symbol
  { id: "puma", label: "Puma", icon: FaShoppingBasket }, // Shopping basket
  { id: "levi", label: "Levi's", icon: FaTshirt }, // T-shirt
  { id: "zara", label: "Zara", icon: RiImageLine }, // Image/gallery icon
  { id: "h&m", label: "H&M", icon: FaStore }, // Storefront
];

export default function ShoppingHome() {
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const [imageSlider, setImageSlider] = useState(0);
  const [opendetailDialogue, setOpenDetailDialogue] = useState(false);
  const { products, productDetail } = useSelector(
    (state) => state.shoppingProduct
  );
  const { user } = useSelector((state) => state.auth);
  const { featureImage } = useSelector((state) => state.featureSlice);
  const { cartItem } = useSelector((state) => state.shopCart);

  const navigate = useNavigate();

  const dispatch = useDispatch();

  function handleGetProductDetail(id) {
    navigate(`/shop/product-detail/${id}`);
  }

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.2 });

    tl.fromTo(
      titleRef.current,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
    ).fromTo(
      subtitleRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power3.out" },
      "-=0.5"
    );
  }, []);

  function handleAddToCart(productId, getTotalStock) {
    let getCartItems = cartItem.items || [];

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.ProductId === productId
      );
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          toast.error(
            `Only ${getQuantity} quantity can be added for this item`
          );
          return;
        }
      }
    }

    dispatch(
      addToCart({ userId: user._id, ProductId: productId, quantity: 1 })
    ).then((data) => {
      if (data.payload.success === true) {
        dispatch(fetchUserItems(user._id));
        toast.success("Product has been added to cart");
      }
    });
  }

  function handleNavigate(getCurrentItem, section) {
    sessionStorage.removeItem("filters");
    const currentFilter = {
      [section]: [getCurrentItem.id],
    };
    sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    navigate(`/shop/listing`);
  }

  useEffect(() => {
    const time = setInterval(() => {
      setImageSlider((prev) => (prev + 1) % featureImage[0].image.length);
    }, 3000);

    return () => clearInterval(time);
  }, [featureImage]);

  useEffect(() => {
    if (productDetail !== null) {
      setOpenDetailDialogue(true);
    }
  }, [productDetail]);

  useEffect(() => {
    dispatch(
      getShopProduct({ filterParams: {}, sortParams: "price-lowtohigh" })
    );
  }, [dispatch]);

  useEffect(() => {
    dispatch(getFeatuerImage());
  }, [dispatch]);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="relative w-full h-[600px] overflow-hidden ">
        {featureImage[0]?.image.map((slide, index) => (
          <img
            src={slide?.url}
            alt={"image"}
            key={index}
            className={`${
              index === imageSlider ? "opacity-100" : "opacity-0"
            } absolute top-0 left-0 w-full h-full object-cover  transition-opacity duration-1000`}
          />
        ))}
        <Button
          variant="outline"
          size="icon"
          className={
            "absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/80"
          }
          onClick={() =>
            setImageSlider(
              (prevData) =>
                (prevData - 1 + featureImage.length) % featureImage.length
            )
          }
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className={
            "absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/80"
          }
          onClick={() =>
            setImageSlider((prevData) => (prevData + 1) % featureImage.length)
          }
        >
          <ChevronRightIcon className="w-4 h-4" />
        </Button>
      </div>
      <div className="absolute shadow-lg top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-4 text-center">
        <h1
          ref={titleRef}
          className="text-4xl md:text-6xl font-extrabold tracking-wider text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] mb-4"
        >
          Fashion That Speaks
        </h1>
        <h3
          ref={subtitleRef}
          className="text-lg md:text-2xl font-medium text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.4)] max-w-2xl mx-auto"
        >
          Bold designs, premium fabrics — made for your unique expression and
          everyday confidence.
        </h3>
      </div>

      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Shop by category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 items-center lg:grid-cols-5 gap-4 w-full">
            {categoriesWithIcon.map((item) => (
              <Card
                key={item.id}
                className={
                  "cursor-pointer hover:shadow-lg transition-shadow flex "
                }
                onClick={() => handleNavigate(item, "category")}
              >
                <CardContent
                  className={"flex flex-col items-center justify-center p-6"}
                >
                  <item.icon className="w-12 h-12 mb-4 text-primary" />
                  <span className="font-bold">{item.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Shop by Brand</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 ">
            {brandsWithIcon.map((item) => (
              <Card
                key={item.id}
                className={"cursor-pointer hover:shadow-lg transition-shadow"}
                onClick={() => handleNavigate(item, "brand")}
              >
                <CardContent
                  className={"flex flex-col items-center justify-center p-6"}
                >
                  <item.icon className="w-12 h-12 mb-4 text-primary" />
                  <span className="font-bold">{item.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Featured Products
          </h2>
          <div className="grid grid-col-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products && products.data && products.data.length > 0
              ? products.data.slice(1, 5).map((product) => (
                  <ShopingProduct
                    product={product}
                    handleGetProductDetail={handleGetProductDetail}
                    handleAddToCart={handleAddToCart}
                    key={product._id}
                    // show={show}
                  />
                ))
              : null}
          </div>
        </div>
      </section>
      {/* {show ? <ProductDetail /> : null}  */}
    </div>
  );
}
