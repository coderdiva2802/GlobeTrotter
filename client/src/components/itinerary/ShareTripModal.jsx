import { useState } from 'react';
import { X, Copy, Check, Share2, Globe } from 'lucide-react';

export const ShareTripModal = ({ isOpen, onClose, tripName, shareUrl }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard?.writeText(shareUrl || window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="modal-backdrop animate-fade-in" onClick={onClose}>
      <div
        className="modal-container share-modal-container"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="modal-header">
          <div className="modal-title-group">
            <div className="modal-icon-badge">
              <Share2 size={20} />
            </div>
            <div>
              <h2 className="modal-title">Share Your Itinerary</h2>
              <p className="modal-subtitle">Anyone with this link can view your itinerary and schedule</p>
            </div>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        <div className="modal-body-content">
          <div className="share-trip-preview-banner">
            <Globe size={18} className="share-globe-icon" />
            <div>
              <strong>{tripName || 'Europe Summer Adventure'}</strong>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Public Day-wise Itinerary & Budget</p>
            </div>
          </div>

          <div className="share-input-group">
            <input
              type="text"
              readOnly
              className="share-link-input"
              value={shareUrl || window.location.href}
            />
            <button
              type="button"
              className="share-copy-btn"
              onClick={handleCopy}
            >
              {copied ? (
                <>
                  <Check size={16} />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy size={16} />
                  <span>Copy Link</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="details-footer-actions">
          <button
            type="button"
            className="btn-primary"
            onClick={onClose}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareTripModal;
