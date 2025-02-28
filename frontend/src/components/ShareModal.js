// ShareModal.js
import React from 'react';

const ShareModal = ({ showShareModal, setShowShareModal, handleShareToWhatsApp }) => {
  if (!showShareModal) return null;

  return (
    <div className="popup-overlay" onClick={() => setShowShareModal(false)}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={() => setShowShareModal(false)}>
          ×
        </button>
        <h2>Share Article</h2>
        <p>Select an option to share:</p>
        <button className="whatsapp-share-btn" onClick={handleShareToWhatsApp}>
          Share to WhatsApp
        </button>
      </div>
    </div>
  );
};

export default ShareModal;