// AddArticleModal.js
import React, { useRef, useState } from 'react';
import { technicalClubs, culturalClubs } from './constants';

const AddArticleModal = ({
  showAddArticleModal,
  setShowAddArticleModal,
  newArticleForm,
  setNewArticleForm,
  selectedFiles,
  setSelectedFiles,
  selectedPdfFiles,
  setSelectedPdfFiles,
  handleNewArticleSubmit,
  handleClubToggle,
  handleFileChange,
  handlePdfChange,
  handleNewArticleInputChange,
  adminUsername, // Holds the logged-in admin's username
}) => {
  // Always call hooks at the top.
  const textareaRef = useRef(null);
  const [textColor, setTextColor] = useState('#000000');
  const [highlightColor, setHighlightColor] = useState('#ffff00');

  if (!showAddArticleModal) return null;

  // Inserts formatting tags around the selected text in the textarea.
  const insertFormatting = (tagStart, tagEnd) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = newArticleForm.content;
    const before = text.substring(0, start);
    const selected = text.substring(start, end);
    const after = text.substring(end);
    const newContent = before + tagStart + selected + tagEnd + after;
    setNewArticleForm({ ...newArticleForm, content: newContent });
  };

  // On form submission, simply call the submission handler.
  const onSubmit = (e) => {
    e.preventDefault();
    handleNewArticleSubmit(e);
  };

  return (
    <div className="popup-overlay" onClick={() => setShowAddArticleModal(false)}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={() => setShowAddArticleModal(false)}>
          ×
        </button>
        <h2>Submit a News Article</h2>
        {/* Formatting Toolbar */}
        <div
          className="formatting-toolbar"
          style={{
            marginBottom: '10px',
            textAlign: 'center',
            borderBottom: '1px solid #ccc',
            paddingBottom: '5px',
          }}
        >
          <button
            type="button"
            onClick={() => insertFormatting('<b>', '</b>')}
            title="Bold"
            style={{ marginRight: '8px', fontWeight: 'bold' }}
          >
            B
          </button>
          <button
            type="button"
            onClick={() => insertFormatting('<i>', '</i>')}
            title="Italic"
            style={{ marginRight: '8px', fontStyle: 'italic' }}
          >
            I
          </button>
          <button
            type="button"
            onClick={() => insertFormatting('<u>', '</u>')}
            title="Underline"
            style={{ marginRight: '8px', textDecoration: 'underline' }}
          >
            U
          </button>
          <span style={{ marginRight: '8px' }}>
            <label style={{ marginRight: '4px' }}>Text Colour:</label>
            <input
              type="color"
              defaultValue={textColor}
              onChange={(e) => setTextColor(e.target.value)}
              id="textColorPicker"
              style={{ verticalAlign: 'middle' }}
            />
            <button
              type="button"
              onClick={() =>
                insertFormatting(
                  `<span style="color: ${document.getElementById('textColorPicker').value};">`,
                  '</span>'
                )
              }
              title="Apply Text Colour"
              style={{ marginLeft: '4px', padding: '4px 8px' }}
            >
              Apply
            </button>
          </span>
          <span>
            <label style={{ marginRight: '4px' }}>Highlight:</label>
            <input
              type="color"
              defaultValue={highlightColor}
              onChange={(e) => setHighlightColor(e.target.value)}
              id="highlightColorPicker"
              style={{ verticalAlign: 'middle' }}
            />
            <button
              type="button"
              onClick={() =>
                insertFormatting(
                  `<span style="background-color: ${document.getElementById('highlightColorPicker').value};">`,
                  '</span>'
                )
              }
              title="Apply Highlight"
              style={{ marginLeft: '4px', padding: '4px 8px' }}
            >
              Apply
            </button>
          </span>
        </div>
        <form id="news-form" onSubmit={onSubmit}>
          <input
            type="text"
            id="headline"
            placeholder="Headline"
            value={newArticleForm.headline}
            onChange={handleNewArticleInputChange}
            required
          />
          {/* Textarea for content with fixed size */}
          <textarea
            id="content"
            placeholder="Article Content"
            ref={textareaRef}
            value={newArticleForm.content}
            onChange={handleNewArticleInputChange}
            style={{
              whiteSpace: 'pre-wrap',
              width: '100%',
              height: '300px',
              resize: 'none',
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              marginBottom: '10px',
            }}
            required
          />
          {adminUsername ? (
            <input
              type="text"
              id="author"
              placeholder="Author Name"
              value={adminUsername}
              readOnly
              required
            />
          ) : (
            <input
              type="text"
              id="author"
              placeholder="Author Name"
              value={newArticleForm.author}
              onChange={handleNewArticleInputChange}
              required
            />
          )}
          <select
            id="category"
            value={newArticleForm.category}
            onChange={handleNewArticleInputChange}
          >
            <option value="events">Events</option>
            <option value="academic">Academics</option>
            <option value="career">Career</option>
            <option value="hostel">Hostel</option>
          </select>
          <input
            type="text"
            id="tags"
            placeholder="Additional Tags (comma separated)"
            value={newArticleForm.tags}
            onChange={handleNewArticleInputChange}
          />
          <div className="file-upload-container">
            <label htmlFor="imageUpload" className="custom-file-upload">
              Upload Image(s)
            </label>
            <input
              type="file"
              id="imageUpload"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            <label htmlFor="pdfUpload" className="custom-file-upload">
              Upload PDF(s)
            </label>
            <input
              type="file"
              id="pdfUpload"
              accept="application/pdf"
              multiple
              onChange={handlePdfChange}
              style={{ display: 'none' }}
            />
          </div>
          {selectedFiles.length > 0 && (
            <div className="attached-files-indicator">
              <p>Attached Images:</p>
              <ul>
                {selectedFiles.map((file, index) => (
                  <li key={index}>{file.name}</li>
                ))}
              </ul>
            </div>
          )}
          {selectedPdfFiles.length > 0 && (
            <div className="attached-files-indicator">
              <p>Attached PDFs:</p>
              <ul>
                {selectedPdfFiles.map((file, index) => (
                  <li key={index}>{file.name}</li>
                ))}
              </ul>
            </div>
          )}
          <button type="submit">Post Article</button>
        </form>
        <div className="club-selection" style={{ marginTop: '15px' }}>
          <h3>Select Club(s):</h3>
          <div className="club-group">
            <h4>Technical/Innovative Clubs</h4>
            {technicalClubs.map((club) => (
              <span
                key={club}
                className={`club-tag ${newArticleForm.clubs.includes(club) ? 'selected' : ''}`}
                onClick={() => handleClubToggle(club)}
                style={{ marginRight: '5px', cursor: 'pointer' }}
              >
                {club}
              </span>
            ))}
          </div>
          <div className="club-group" style={{ marginTop: '10px' }}>
            <h4>Cultural Clubs</h4>
            {culturalClubs.map((club) => (
              <span
                key={club}
                className={`club-tag ${newArticleForm.clubs.includes(club) ? 'selected' : ''}`}
                onClick={() => handleClubToggle(club)}
                style={{ marginRight: '5px', cursor: 'pointer' }}
              >
                {club}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddArticleModal;
