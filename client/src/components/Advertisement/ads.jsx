import axios from "axios";
import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Link } from "react-router-dom";

export default function AdsForShowing() {
  const [showX, setShowX] = useState(false);
  const [timer, setTimer] = useState(5);
  const [ad, setAd] = useState(null);
  const [isVisible, setIsVisible] = useState(true); // for controlling visibility

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/admin/ads/toShow/ads"
        );
        setAd(response.data?.data);
      } catch (error) {
        console.error("Error fetching ad", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!ad) return;

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setShowX(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [ad]);

  if (!ad || !isVisible) return null;

  return (
    <div className="fixed bottom-5 right-5 max-w-xs w-full bg-white border rounded-lg shadow-lg p-4 z-50">
      <Link
        to={ad?.targetUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        <img
          src={ad?.imageUrl}
          alt={ad?.title}
          className="w-full h-auto rounded"
        />
        {/* <p className="mt-2 font-semibold text-gray-800">{ad?.title}</p> */}
      </Link>

      {!showX ? (
        <p className="text-gray-500 text-sm mt-1">Ad closes in: {timer}s</p>
      ) : (
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-0 right-2 text-red-500 hover:text-red-700 cursor-pointer"
        >
          <X size={20} />
        </button>
      )}
    </div>
  );
}
