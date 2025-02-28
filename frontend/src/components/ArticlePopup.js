// ArticlePopup.js
import React, { useEffect } from 'react';
import { getColorForTag } from './utils';

const renderArticleContent = (content) => {
  // Simple check: if content contains any HTML tags, assume it is formatted HTML.
  if (/<\/?[a-z][\s\S]*>/i.test(content)) {
    return (
      <div
        className="article-body"
        style={{ whiteSpace: 'pre-wrap' }}
        dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br />') }}
      />
    );
  } else {
    // Otherwise, split by newlines and dynamically highlight tokens.
    const paragraphs = content.split('\n').map((para, index) => (
      <p key={index} style={{ whiteSpace: 'pre-wrap' }}>
        {highlightContent(para)}
      </p>
    ));
    return <div className="article-body">{paragraphs}</div>;
  }
};

// Helper function to dynamically highlight content.
const highlightContent = (text) => {
  const regex = /(\bhttps?:\/\/[^\s]+)|(\b\d{1,2}[\/-]\d{1,2}[\/-]\d{2,4}\b)|(\b\d{1,2}:\d{2}\b)|(@\s*[A-Za-z0-9\s,.'-]+)/gi;
  const elements = [];
  let lastIndex = 0;
  let match;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      elements.push(text.substring(lastIndex, match.index));
    }
    if (match[1]) {
      // URL match
      elements.push(
        <a
          key={match.index}
          href={match[1]}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#0077cc', textDecoration: 'underline' }}
        >
          {match[1]}
        </a>
      );
    } else if (match[2]) {
      // Date match
      elements.push(
        <span key={match.index} style={{ color: '#d35400', fontWeight: 'bold' }}>
          {match[2]}
        </span>
      );
    } else if (match[3]) {
      // Time match
      elements.push(
        <span key={match.index} style={{ color: '#c0392b', fontWeight: 'bold' }}>
          {match[3]}
        </span>
      );
    } else if (match[4]) {
      // Venue match
      elements.push(
        <span key={match.index} style={{ color: '#27ae60', fontStyle: 'italic' }}>
          {match[4]}
        </span>
      );
    }
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) {
    elements.push(text.substring(lastIndex));
  }
  return elements;
};

const ArticlePopup = ({
  selectedArticle,
  handlePrevArticle,
  handleNextArticle,
  setSelectedArticle,
  handlePopupShare,
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        handlePrevArticle(e);
      } else if (e.key === 'ArrowRight') {
        handleNextArticle(e);
      } else if (e.key === 'Escape') {
        setSelectedArticle(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrevArticle, handleNextArticle, setSelectedArticle]);

  return (
    <div className="popup-overlay" onClick={() => setSelectedArticle(null)}>
      <div
        className="popup-content news-article-popup"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="close-btn" onClick={() => setSelectedArticle(null)}>
          ×
        </button>
        <div className="popup-header">
          <button className="nav-arrow left-arrow" onClick={handlePrevArticle}>
            ←
          </button>
          <button className="nav-arrow right-arrow" onClick={handleNextArticle}>
            →
          </button>
          <header className="article-header">
            <h1>{selectedArticle.headline}</h1>
            <p className="byline">
              By {selectedArticle.adminName} |{' '}
              {new Date(selectedArticle.timestamp).toLocaleString()}
              <button
                className="popup-share-btn-inline"
                onClick={handlePopupShare}
                title="Share Article"
              >
                <span className="share-icon-inline">⤷</span>
              </button>
            </p>
            <hr />
          </header>
        </div>
        <div className="popup-body">
          {selectedArticle.images && selectedArticle.images.length > 0 && (
            <div className="popup-image-container">
              <img
                src={selectedArticle.images[0]}
                alt="Main article"
                className="popup-image"
              />
            </div>
          )}
          {/* Render the article content with formatting */}
          {renderArticleContent(selectedArticle.content)}
          {selectedArticle.attachments && selectedArticle.attachments.length > 0 && (
            <div className="attachment-container">
              <h3>Attachments</h3>
              <ul className="attachment-list">
                {selectedArticle.attachments.map((pdfUrl, index) => (
                  <li key={index}>
                    <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
                      View PDF 
                    </a>{' '}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {selectedArticle.tags && (
            <div className="tags-container">
              <span
                className="tag category-tag"
                style={{ backgroundColor: getColorForTag(selectedArticle.category) }}
              >
                {selectedArticle.category}
              </span>
              {selectedArticle.tags.map((tag, index) => (
                <span
                  key={index}
                  className="tag tag-item"
                  style={{ backgroundColor: getColorForTag(tag) }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArticlePopup;
