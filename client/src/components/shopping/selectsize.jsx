import React from "react";

export default function SelectSize({ selectSize, setSelectedSize, size }) {
  return (
    <div className="flex gap-4">
      {size && size.length > 0
        ? size.map((item, index) => (
            <button
              key={index}
              className={`border-2 py-3 px-6 rounded-md cursor-pointer transition-all
                ${
                  selectSize === item
                    ? "border-black bg-black text-white"
                    : "border-gray-300 hover:border-black"
                }`}
              onClick={() => setSelectedSize(item)}
            >
              {item}
            </button>
          ))
        : null}
    </div>
  );
}
