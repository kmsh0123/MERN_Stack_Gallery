// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const ImageGalleryAPI = createApi({
  reducerPath: 'ImageGalleryAPI',
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_ENDPOINT }),
  tagTypes : ["ImageGalleryAPI"],
  endpoints: (builder) => ({

    getImage:builder.query({
      query: () => ({
        url : "get",
        method : "GET"
      }),
      providesTags : ["ImageGalleryAPI"]
    }),

    uploadImage:builder.mutation({
      query : (images) => ({
         url : "create",
         method : "POST",
         body : images,
      }),
      invalidatesTags : ["ImageGalleryAPI"]
    }),
    
    deleteMultipleImage:builder.mutation({
      query : (ids) =>({
        url : "deleteAllPhoto",
        method : "POST",
        body : {ids}
      }),
      invalidatesTags : ["ImageGalleryAPI"]
    })
  }),
})

export const {useGetImageQuery,useUploadImageMutation,useDeleteMultipleImageMutation} = ImageGalleryAPI