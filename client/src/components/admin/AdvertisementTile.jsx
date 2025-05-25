import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";

export default function AdvertisementTile({
  item,
  setOpenCreateAdsDialogue,
  handleEditAdvertiesment,
  setCurrentEditedId,
  setFormData,
  handleDeleteAdvertiesment,
  handleToggleList,
}) {
  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-4 md:p-6 flex flex-col justify-between hover:shadow-lg transition-shadow duration-300 h-full">
      <div className="relative aspect-video overflow-hidden rounded-lg mb-4">
        <img
          src={item.imageUrl}
          alt={item.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </div>

      <div className="flex-1 flex flex-col">
        <h2 className="text-lg md:text-xl font-semibold mb-2 text-gray-800 line-clamp-2">
          {item.title}
        </h2>
        <p className="text-sm text-gray-600 mb-3 line-clamp-3">
          {item.description}
        </p>
        <Link
          to={item.targetUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 hover:underline text-sm font-medium mt-auto"
        >
          🔗 Visit Link
        </Link>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <span
            className={`text-sm font-medium px-2 py-1 rounded-full ${
              item.isActive
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {item.isActive ? "Active" : "Inactive"}
          </span>

          <div className="flex flex-wrap gap-2 justify-end">
            <Button
              onClick={() => {
                setOpenCreateAdsDialogue(true);
                setCurrentEditedId(item._id);
                handleEditAdvertiesment(item);
                setFormData(item);
              }}
              variant="outline"
              size="sm"
              className="text-xs sm:text-sm px-3 py-1"
            >
              Edit
            </Button>
            <Button
              onClick={() => {
                setCurrentEditedId(item._id);
                handleDeleteAdvertiesment(item._id);
              }}
              variant="destructive"
              size="sm"
              className="text-xs sm:text-sm px-3 py-1"
            >
              Delete
            </Button>
            <Button
              onClick={() => handleToggleList(item)}
              size="sm"
              variant={item.isActive ? "secondary" : "default"}
              className="text-xs sm:text-sm px-3 py-1"
            >
              {item.isActive ? "Deactivate" : "Activate"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
