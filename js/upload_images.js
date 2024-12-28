
let fileArray = []; // Array to store selected files
let imageIdCounter = 0; // Counter to assign unique IDs to images

function previewImages(event) {
    const files = Array.from(event.target.files); // Convert FileList to array
    const previewContainer = document.getElementById('imagePreviewContainer');

    // Add files to the custom fileArray
    fileArray.push(...files);

    // Display each file in the preview container
    files.forEach((file, index) => {
        const reader = new FileReader();

        // Create a preview element
        const previewDiv = document.createElement('div');
        previewDiv.classList.add('image-preview');
        const currentImageId = `image-${imageIdCounter++}`; // Generate a unique ID
        previewDiv.id = currentImageId;

        const img = document.createElement('img');
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-btn');
        deleteButton.innerHTML = `
            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='#000000' width='24' height='24'>
                <path d="M5 20a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8h2V6h-4V4a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v2H3v2h2zM9 4h6v2H9zM8 8h9v12H7V8z"></path>
                <path d="M9 10h2v8H9zm4 0h2v8h-2z"></path>
            </svg>
        `;
        deleteButton.onclick = () => removeImage(currentImageId, index);

        previewDiv.appendChild(img);
        previewDiv.appendChild(deleteButton);
        previewContainer.appendChild(previewDiv);

        // Load the image file
        reader.onload = function (e) {
            img.src = e.target.result;
        };

        reader.readAsDataURL(file);
    });

    // Clear the file input so it doesn't interfere with adding new files
    event.target.value = '';
}

function removeImage(imageId, fileIndex) {
    // Remove the preview element
    const imageToRemove = document.getElementById(imageId);
    if (imageToRemove) {
        imageToRemove.remove();
    }

    // Remove the file from the custom array
    fileArray.splice(fileIndex, 1);
}

function removeAllImages() {
    // Clear the preview container
    const previewContainer = document.getElementById('imagePreviewContainer');
    previewContainer.innerHTML = '';

    // Clear the custom file array
    fileArray = [];
}

function prepareFiles(event) {
    // Before form submission, create a new FormData object with the updated fileArray
    const formData = new FormData();
    fileArray.forEach(file => formData.append('images[]', file));

    // Replace the form's default submission with the updated FormData
    fetch('/upload', {
        method: 'POST',
        body: formData
    }).then(response => {
        console.log('Upload complete:', response);
    }).catch(error => {
        console.error('Upload error:', error);
    });

    event.preventDefault(); // Prevent default form submission
}