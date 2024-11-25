import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from "dotenv";
import ImageModel from '../model/ImageModel.js';

dotenv.config({
    path : ".env"
})

cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.CLOUD_API_KEY, 
    api_secret: process.env.CLOUD_API_SECRET
});



export const imageUpload = async (req, res) => {
  try {
    // Upload files to Cloudinary
    const imageUploadPromises = req.files.map(async (file) => {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "uploads", // Optional: Organize images by folder in Cloudinary
      });

      // Create a separate database entry for each image
      const imageDocument = await ImageModel.create({
        images: [result.secure_url],
      });

      return {
        url: result.secure_url,
        objectId: imageDocument._id,
        publicId: result.public_id,
      };
    });

    const uploadedImages = await Promise.all(imageUploadPromises);

    // Response includes the two ObjectIds and their corresponding URLs
    return res.status(201).json({
      success: true,
      message: "Images uploaded successfully.",
      uploadedImages: uploadedImages.map((image) => ({
        objectId: image.objectId,
        url: image.url,
        publicId: image.publicId,
      })),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};




export const getImages = async(req,res) => {
  try {
  const Images = await ImageModel.find({}).select("-__v");
  
    if(!Images){
      return res.status(400).json({
        success : false,
        message : "Image not found"
      })
    }

    res.status(200).json({
      success : true,
      message : "Get Photo All Successfully",
      Images
    })
  } catch (error) {
    res.status(500).json({
      success : false,
      message : error.message
    })
  }
}

export const getImageById = async(req,res) => {
  const {id} = req.params
  const getImageId = await ImageModel.findById(id);
  
  try {
    res.status(200).json({
      success : true,
      message : `Get photo successfully with ${id}`,
      getImageId
    })
  } catch (error) {
    res.status(500).json({
      success : false,
      message : error.message
    })
  }
}

export const EditImage = async(req,res)=>{
  const {id} = req.params;

  try {
    const imageUploadPromises = req.files.map(async (file) => {
      const result = await cloudinary.uploader.upload(file.path, {
          folder: 'uploads', // Optional: Organize images by folder in Cloudinary
      });
      return result.secure_url; // Store the secure URL from Cloudinary
      });
    const uploadedImages = await Promise.all(imageUploadPromises);

    const imageId = await ImageModel.findByIdAndUpdate(id,{
      images : uploadedImages,
    },{new : true})
    return res.status(201).json({
      success: true,
      message: `Edit image successfully update`,
      imageId
    });
  } catch (error) {
    return res.status(422).json({
      success: false,
      message: error.message,
    });
  }
}

export const deleteImage = async (req,res)=>{
  const {publicId,imageId} = req.body;
  
   if(!publicId || !imageId){
    return res.status(400).json({
      success : false,
      message : "Public and Image ID are not found"
    })
   }

   try {
    const photo = await ImageModel.findById(imageId);
    if(!photo){
      return res.status(404).json({
        success : false,
        message : "Image ID are not found"
      })
    }
    const imageUrl = photo.images.find(image => image.includes(publicId));
    if (!imageUrl) {
      return res.status(404).json({ success: false, message: 'Image not found in product' });
    }
    const cloudinaryResult = await cloudinary.uploader.destroy(`uploads/${publicId}`);
    if (cloudinaryResult.result !== 'ok') {
      return res.status(400).json({ success: false, message: 'Failed to delete image from Cloudinary' });
    }
    const updatedImage = await ProductModel.findByIdAndUpdate(
      productId,
      { $pull: { images: imageUrl } }, // Use the exact URL from MongoDB
      { new: true }
    );

    if (!updatedImage) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({ success: true, message: 'Image deleted successfully', updatedImage });
   } catch (error) {
    res.status(500).json({ success: false, message: error.message });
   }

}

export const deletePhoto = async (req,res)=>{
  const {id} = req.params;
  try {
      // Fetch the product to get the image URLs
      const photo = await ImageModel.findById(id);
      
      if (!photo) {
          return res.status(404).json({
              success: false,
              message: "Photo not found",
          });
      }

      // Extract public IDs from the image URLs (Assuming the image URL is from Cloudinary)
      const imageDeletionPromises = photo.images.map(async (imageUrl) => {
          // Extract the public ID from the image URL (Cloudinary URLs have a specific structure)
          const publicId = imageUrl.split('/').slice(-1)[0].split('.')[0]; // Extracts the public ID
          return cloudinary.uploader.destroy(`uploads/${publicId}`);     
      });


      // Wait for all images to be deleted from Cloudinary
      await Promise.all(imageDeletionPromises);

      // Delete the product from MongoDB
      await ImageModel.findByIdAndDelete(id);

      return res.status(200).json({
          success: true,
          message: "Images deleted successfully",
      });
  } catch (error) {
      return res.status(500).json({
          success: false,
          message: error.message,
      });
  }
}

export const deleteAllPhoto = async (req, res) => {
  const { ids } = req.body; // Document အတွက် ID များရယူ

  try {
    // IDs များအလိုက် MongoDB မှ Document များကို ရယူ
    const imagesToDelete = await ImageModel.find({ _id: { $in: ids } });

    if (imagesToDelete.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No photos found for the provided IDs",
      });
    }

    // Cloudinary public IDs ရယူ
    const publicIds = imagesToDelete.flatMap(image =>
      image.images?.map(imageUrl => {
        const parts = imageUrl.split('/');
        return parts.slice(-2, -1)[0] + '/' + parts.slice(-1)[0].split('.')[0];
      }) || []
    );

    if (publicIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid Cloudinary URLs found in the provided IDs",
      });
    }

    // Cloudinary မှ Public IDs ဖြင့်ဓာတ်ပုံများကို ဖျက်
    await cloudinary.api.delete_resources(publicIds);

    // MongoDB မှ Document များဖျက်
    await ImageModel.deleteMany({ _id: { $in: ids } });

    return res.status(200).json({
      success: true,
      message: "All images deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "An error occurred while deleting photos",
    });
  }
};
