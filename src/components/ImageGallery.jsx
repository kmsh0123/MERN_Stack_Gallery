import React, { useState } from 'react';
import { useDeleteMultipleImageMutation, useGetImageQuery } from '../../service/api/ImageGalleryAPI';

const ImageGallery = () => {
  const { data, isLoading, error } = useGetImageQuery();
  const [deleteAllImages] = useDeleteMultipleImageMutation();
  const [selectedItems, setSelectedItems] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletedImages, setDeletedImages] = useState([]); // State for tracking images being deleted

  const handleSelectAll = () => {
    if (selectedItems.length === data?.Images?.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(data?.Images?.map((item) => item._id));
    }
  };

  const handleSelectItem = (itemId) => {
    setSelectedItems((prevSelectedItems) => {
      if (prevSelectedItems.includes(itemId)) {
        return prevSelectedItems.filter((id) => id !== itemId);
      } else {
        return [...prevSelectedItems, itemId];
      }
    });
  };

  const handleDeleteSelected = async () => {
    if (selectedItems.length === 0) return;
    setIsDeleting(true);
    setDeletedImages(selectedItems); // Mark images as being deleted
    try {
      await deleteAllImages(selectedItems).unwrap();
      setSelectedItems([]); // Clear selections after deletion
    } catch (error) {
      console.error('Failed to delete items:', error);
    } finally {
      setIsDeleting(false);
      setDeletedImages([]); // Reset deleted images state
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading items: {error.message}</div>;

  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-1">
          <input
            type="checkbox"
            checked={selectedItems.length === data?.Images?.length}
            onChange={handleSelectAll}
            className="w-5 h-5"
          />
          <label>Select All</label>
        </div>
        <button
          className={`${
            selectedItems.length
              ? isDeleting
                ? 'bg-gray-400 cursor-not-allowed animate-pulse'
                : 'bg-red-700'
              : 'disabled:bg-red-200 cursor-not-allowed'
          } p-2 rounded-xl text-white`}
          onClick={handleDeleteSelected}
          disabled={selectedItems.length === 0 || isDeleting}
        >
          {isDeleting ? 'Delete Select...' : 'Delete Select'}
        </button>
      </div>
      <div className="flex flex-wrap -mx-1">
        {data?.Images?.map((item, index) => (
          <div
            className={`px-1 mb-3 w-1/4 relative ${
              deletedImages.includes(item._id) ? 'animate-pulse transition duration-200' : ''
            }`}
            key={index}
          >
            <input
              type="checkbox"
              checked={selectedItems.includes(item._id)}
              onChange={() => handleSelectItem(item._id)}
              className="absolute w-5 h-5"
            />
            <img
              className={`w-full h-52 rounded-xl bg-no-repeat bg-cover bg-center ${
                deletedImages.includes(item._id) ? 'opacity-50' : ''
              }`}
              src={item?.images}
              alt=""
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default ImageGallery;
