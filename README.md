## mern-app-gallery

### Image_Create(POST)

```
   https://mern-app-gallery.onrender.com/api/v1/create
```


| Arguments | Type    | Description                          |
| :-------- | :------ | :----------------------------------- |
| `images`  | `array` | **Required** / image1.jpg            |


#### create image

```

  {
	"success": true,
	"message": "Images uploaded successfully.",
	"uploadedImages": [
		{
			"objectId": "6743eaf2718b7d4bf617871e",
			"url": "https://res.cloudinary.com/dwga0w95e/image/upload/v1732504339/uploads/qqz8elsbdtfsc7mnhipa.png",
			"publicId": "uploads/qqz8elsbdtfsc7mnhipa"
		}
	]
}

```

#### Get images(GET)

```
   https://mern-app-gallery.onrender.com/api/v1/get
```

```
   {
	"success": true,
	"message": "Get Photo All Successfully",
	"Images": [
		{
			"_id": "67436adbe75088951baed7c7",
			"images": [
				"https://res.cloudinary.com/dwga0w95e/image/upload/v1732471548/uploads/pmlsvvkatzbkao46vqtx.png"
			],
			"createdAt": "2024-11-24T18:05:15.529Z",
			"updatedAt": "2024-11-24T18:05:15.529Z"
		}
	]
}

```

#### Get images by id(GET)

```
   https://mern-app-gallery.onrender.com/api/v1/get/{_id}
```

```
  {
	"success": true,
	"message": "Get photo successfully with 673cbe451611cfec50776af3",
	"getImageId": {
		"_id": "673cbe451611cfec50776af3",
		"images": [
			"https://res.cloudinary.com/dwga0w95e/image/upload/v1732034146/uploads/ma5xiplfcojw10zhvdcv.png"
		],
	}
}

```
### Image_Edit(PATCH)

```
   https://mern-app-gallery.onrender.com/api/v1/edit/{_id}
```


| Arguments | Type    | Description                          |
| :-------- | :------ | :----------------------------------- |
| `images`  | `array` |    **Required** / image1.jpg         |


#### edit image

```

 {
	"success": true,
	"message": "Edit image successfully update",
	"imageId": {
		"_id": "673cd433c1506a460ac4ee95",
		"images": [
			"https://res.cloudinary.com/dwga0w95e/image/upload/v1732040158/uploads/uh5asg1s1ajznb3jjj2i.webp"
		],
		"createdAt": "2024-11-19T18:08:51.285Z",
		"updatedAt": "2024-11-19T18:15:30.242Z",
		"__v": 0
	}
}

```

### Image_Delete By Id(DELETE)


```
   https://mern-app-gallery.onrender.com/api/v1/delete/{_id}
```
   
#### delete image

```

{
	"success": true,
	"message": "Images deleted successfully"
}

```

### Image_Delete(POST)


```
   https://mern-app-gallery.onrender.com/api/v1/deleteImage
```
   
#### delete image

```

This route will be used when the user edits the photo, and when the photo is deleted

```

###Multiple Images(POST)

```
   https://mern-app-gallery.onrender.com/api/v1/deleteAllPhoto
```

```
{
	 "ids" : [
	 "673ed1ffb37ced90cf711898",
	 "673ed3760b13713540e0acaf",
	 "673ed38a0b13713540e0acb1"
 ]
}
```

```
{
	"success": true,
	"message": "All images deleted successfully"
}
```
