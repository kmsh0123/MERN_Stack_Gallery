import React from 'react';
import ImageGallery from './components/ImageGallery';
import { useUploadImageMutation } from '../service/api/ImageGalleryAPI';

const App = () => {
  const [uploadMedia, { isLoading }] = useUploadImageMutation();

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const UploadHandler = async (files) => {
    const images = new FormData();
    for (let i = 0; i < files.length; i++) {
      images.append("images", files[i], files[i].name);
    }
    await uploadMedia(images);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
      <div className="relative my-6">
        <input
          id="file"
          type="file"
          name="images"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => UploadHandler([...e.target.files])}
          disabled={isLoading} // Disable input when loading
        />
        <label
          htmlFor="file"
          className={`relative flex cursor-pointer flex-col items-center gap-4 rounded border border-dashed border-slate-300 px-3 py-6 text-center text-sm font-medium transition-colors ${
            isLoading ? "cursor-not-allowed opacity-50" : ""
          }`}
        >
          <span className="inline-flex h-12 items-center justify-center self-center rounded-full bg-slate-100/70 px-3 text-slate-400">
            {isLoading ? ( // Show spinner when loading
              <svg
                className="animate-spin h-6 w-6 text-emerald-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                aria-label="File input icon"
                role="graphics-symbol"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z"
                />
              </svg>
            )}
          </span>
          <span className="text-slate-500">
                {isLoading ? "Uploading..." : "Drag & drop or"} <span className="text-emerald-500">{isLoading ? "" : "upload a file"}</span>
          </span>
        </label>
      </div>
      <ImageGallery />
    </form>
  );
};

export default App;
