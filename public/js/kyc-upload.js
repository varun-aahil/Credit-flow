document.addEventListener('DOMContentLoaded', function() {
  const uploadBoxes = document.querySelectorAll('.upload-box');

  uploadBoxes.forEach(box => {
      const input = box.querySelector('input[type="file"]');
      
      // Handle drag and drop
      box.addEventListener('dragover', (e) => {
          e.preventDefault();
          box.classList.add('drag-over');
      });

      box.addEventListener('dragleave', () => {
          box.classList.remove('drag-over');
      });

      box.addEventListener('drop', (e) => {
          e.preventDefault();
          box.classList.remove('drag-over');
          
          const files = e.dataTransfer.files;
          if (files.length) {
              input.files = files;
              handleFileSelect(box, files[0]);
          }
      });

      // Handle click upload
      box.addEventListener('click', () => input.click());
      
      input.addEventListener('change', (e) => {
          if (e.target.files.length) {
              handleFileSelect(box, e.target.files[0]);
          }
      });
  });

  function handleFileSelect(box, file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
          alert('Please upload an image file');
          return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
          alert('File size should be less than 5MB');
          return;
      }

      // Show preview
      const reader = new FileReader();
      reader.onload = function(e) {
          // Remove existing preview if any
          const existingPreview = box.querySelector('.preview-image');
          if (existingPreview) {
              existingPreview.remove();
          }

          // Create preview image
          const img = document.createElement('img');
          img.src = e.target.result;
          img.className = 'preview-image';
          box.appendChild(img);

          // Update upload box text
          const span = box.querySelector('span');
          span.textContent = file.name;
      };
      reader.readAsDataURL(file);
  }
});
