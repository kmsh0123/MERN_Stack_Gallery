import { configureStore } from '@reduxjs/toolkit'
import { ImageGalleryAPI } from '../../service/api/ImageGalleryAPI'

export const store = configureStore({
  reducer: {
    [ImageGalleryAPI.reducerPath] : ImageGalleryAPI.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(ImageGalleryAPI.middleware),
})