import { storage } from "./firebaseconfig.js";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

async function uploadFile() {
    const fileInput = document.getElementById("fileInput");
    const file = fileInput.files[0];

    if (!file) {
        alert("Please select a file.");
        return;
    }

    // Validate DOCX file type
    if (file.type !== "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        alert("Only DOCX files are allowed.");
        return;
    }
    // Reference to Firebase Storage
    const storageRef = ref(storage, `uploads/${file.name}`);

    try {
        const snapshot = await uploadBytes(storageRef, file);
        alert("File uploaded successfully!");

        // Get download URL
        const downloadURL = await getDownloadURL(snapshot.ref);
        console.log("Download URL:", downloadURL);
    } catch (error) {
        console.error("Upload failed:", error);
        alert("Upload failed. Try again.");
    }
}

// Make function available globally (if not using modules)
window.uploadFile = uploadFile;
