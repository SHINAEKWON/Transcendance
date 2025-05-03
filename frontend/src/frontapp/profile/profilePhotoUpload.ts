import axios from 'axios';
import { env } from "../../env/env.js";

// This app will be loaded when you upload an avatar image from editProfile of the Frontend

export async function avatarUploadHandler(event: Event, email: string) {
    
    console.log("avatarUploadHandler");
    
    const fileInput = event.target as HTMLInputElement;
    
    const file = fileInput.files?.[0];
    if (!file)
        return ;
    
    const validFileTypes = ['image/jpeg', 'image/gif', 'image/png'];
    
    if (!validFileTypes.includes(file.type)) {
        alert('Allowed image formats: jpg, gif and png');
        return ;
    }
    
    if (file.size > 2097152) {
        alert('File size must be smaller than 2MB');
        return ;
    }
    
    // Should I also check resolution (min, max) ?
    
    const formData = new FormData();
    
    console.log("Print email: ", email);
    
    formData.append('avatarFile', file);
    // formData.append('email', email);
    
    // try {
    //     const response = await fetch(`${env.backUser}/upload`, {
    //         method: 'POST',
    //         body: formData,
    //         credentials: 'include',
    //       });

    //       const errorData = await response.json();
    //     console.error('Upload failed:', errorData);


    //     if (!response.ok) {
    //         const errorData = await response.json();
    //         console.error('Upload failed:', errorData);
    //     } else {
    //         const result = await response.json();
    //         console.log('Upload success:', result);
    //     }

    //     alert('Your avatar has been uploaded successfully!');
        
    // } catch(error) {
    //     alert ('Failed to upload avatar!');
    //     console.error(error);
    // }
    try {
        const response = await fetch(`${env.backUser}/upload`, {
          method: 'POST',
          body: formData,
          credentials: 'include',
        });
      
        if (!response.ok) {
          const contentType = response.headers.get('content-type');
          let errorData;
          if (contentType && contentType.includes('application/json')) {
            errorData = await response.json();
          } else {
            errorData = { message: 'Server returned non-JSON error' };
          }
          console.error('Upload failed:', errorData);
          alert(errorData.message || 'Upload failed');
          return;
        }
      
        const result = await response.json();
        console.log('Upload success:', result);
        alert('Your avatar has been uploaded successfully!');
      } catch (error) {
        console.error('Unexpected error during upload:', error);
        alert('Unexpected error during upload!');
      }
      

}