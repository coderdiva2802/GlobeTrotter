import { useRef, useState } from 'react';
import { Camera, X } from 'lucide-react';
import './AvatarUpload.css';

export default function AvatarUpload({
  initialLetter = 'A',
  previewUrl,
  onImageSelected,
  onImageRemoved,
}) {
  const fileInputRef = useRef(null);
  const [internalPreview, setInternalPreview] = useState(null);

  const displayPreview = previewUrl || internalPreview;

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate image type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, WEBP)');
      return;
    }

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setInternalPreview(objectUrl);
    if (onImageSelected) {
      onImageSelected(file, objectUrl);
    }
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    setInternalPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (onImageRemoved) {
      onImageRemoved();
    }
  };

  return (
    <div className="avatar-upload-container">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        style={{ display: 'none' }}
        id="avatar-file-input"
      />

      <div className="avatar-circle" onClick={() => fileInputRef.current?.click()}>
        {displayPreview ? (
          <img src={displayPreview} alt="User Avatar" className="avatar-image-preview" />
        ) : (
          <span className="avatar-initial">{initialLetter || 'A'}</span>
        )}

        {displayPreview && (
          <button
            type="button"
            className="avatar-remove-btn"
            onClick={handleRemove}
            title="Remove photo"
          >
            <X size={12} />
          </button>
        )}
      </div>

      <button
        type="button"
        className="upload-photo-btn"
        onClick={() => fileInputRef.current?.click()}
      >
        <Camera size={16} className="upload-icon" />
        Upload photo
      </button>
    </div>
  );
}
