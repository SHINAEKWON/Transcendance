
import { env } from "../../env/env.js";
import { authorizedFetch } from "../../utils/authorizedFetch.js";

// This app will be loaded when you upload an avatar image from editProfile of the Frontend

export async function avatarUploadHandler(event: Event) {
    
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
    
    formData.append('avatarFile', file);

    try {
        const response = await authorizedFetch(`${env.backUser}/upload`, {
            method: 'POST',
            body: formData,
            credentials: 'include',
        });

        if (!response.ok) {
            const msg = await response.text();
            throw new Error(msg);
        }

        // To get avatar file's URL
        const data = await response.json();

        alert('Your avatar has been uploaded successfully!');
        
    } catch(error) {
        alert ('Failed to upload avatar!');
        console.error(error);
    }

}