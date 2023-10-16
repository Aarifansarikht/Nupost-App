import RNPhotoManipulator from 'react-native-photo-manipulator';
import { storage, ref, uploadBytes, getDownloadURL } from '../firebase/firebase';


export async function editAndSaveImage(image) {
  try {
 
    const texts = [
      { position: { x: 50, y: 50 }, text: "Akash Pal", textSize: 1000, color: "#000000" },
      { position: { x: 50, y: 5000 }, text: "7300802813", textSize: 1000, color: "#0000" },
    ];


  
    return new Promise(async (resolve, reject) => {
      try {
    
         const overlay = "https://res.cloudinary.com/dmhyncob4/image/upload/v1696171333/images/nvtrzysiax9zxkjmdmth.png";
         const position = { x: -10, y: 0 , height: 400, width: 250 };
        // const path =  await RNPhotoManipulator.overlayImage(image, overlay, position)
        // const cropRegion = { x: 5, y: 30, height: 400, width: 250 };
        // const targetSize = { height: 200, width: 150 };
        // const operations = [
        //     { operation: "text", options: { position: { x: 50, y: 30 }, text: "Akash", textSize: 30, color: "#000000" } },
        //     { operation: "overlay", overlay: "https://res.cloudinary.com/dmhyncob4/image/upload/v1696166452/images/qfmb6nn9fo6kqirrnd0h.png", position: { x: 5, y: 20 } },
        // ];
        // const quality = 90;
        
       

        // RNPhotoManipulator.batch(image, cropRegion, targetSize, operations, quality)
        // const path = await RNPhotoManipulator.batch(image, cropRegion, targetSize, operations, quality);
        const path =  await RNPhotoManipulator.overlayImage(image, overlay, position);
        resolve(path); // Resolve the promise with the edited image path
      } catch (error) {
        console.log('Error:', error);
        reject(error); // Reject the promise in case of an error
      }
    });
  } catch (error) {
    console.log('Error:', error);
    return null; // Return null in case of an error
  }
}



export const uploadImage = async (profileimg) => {
  if (profileimg == null) {
      return null;
  }

  const uploadUri = profileimg;
  let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);

  // Add timestamp to File Name
  const extension = filename.split('.').pop();
  const name = filename.split('.').slice(0, -1).join('.');
  filename = name + Date.now() + '.' + extension;

  const storageRef = ref(storage, `user_profile/${filename}`);

  try {
      // Fetch the image data from the local file path
      const response = await fetch(uploadUri);
      const blob = await response.blob();


      // Upload the image to Firebase Cloud Storage
      const uploadTaskSnapshot = await uploadBytes(storageRef, blob, {
          contentType: 'image/jpeg', // Specify the content type here
      });

      // Get the download URL of the uploaded image
      const imageUrl = await getDownloadURL(storageRef);

      // Set the image URL state or use it as needed
  
        // setProfileImg(imageUrl)
 
      // Display a success message or perform any other necessary actions
      // alert(
      //     'Image uploaded!',
      //     'Your image has been uploaded to Firebase Cloud Storage successfully!'
      // );

      return imageUrl;
  } catch (e) {
      console.error('Error uploading image:', e);
      return null;
  }
};

