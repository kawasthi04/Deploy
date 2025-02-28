// ArticleCard.js
import React from 'react';
import { getSnippet, getColorForTag } from './utils';

// Dynamic highlighting for plain text (if no HTML is present)
function highlightContent(text) {
  const pattern = new RegExp(
    '(' + // Group for URL
      '(https?:\\/\\/[^\\s]+)' +
      '([.,!?])?' +
    ')' +
    '|' +
    '(' + // Group for numeric date
      '(\\b\\d{1,2}[\\/-]\\d{1,2}[\\/-]\\d{2,4}\\b)' +
      '([.,!?])?' +
    ')' +
    '|' +
    '(' + // Group for spelled-out month date
      '(' +
        '(?:\\b(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?))' +
        '\\s*\\d{1,2}(?:st|nd|rd|th)?(?:[-–]\\d{1,2}(?:st|nd|rd|th)?)?(?:,\\s*\\d{4})?' +
      ')' +
      '([.,!?])?' +
    ')' +
    '|' +
    '(' + // Group for time
      '(\\b\\d{1,2}:\\d{2}\\b)' +
      '([.,!?])?' +
    ')' +
    '|' +
    '(' + // Group for venue
      '(@\\s*[A-Za-z0-9\\s,.\'-]+)' +
      '([.,!?])?' +
    ')',
    'gi'
  );

  const elements = [];
  let lastIndex = 0;
  let match;
  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      elements.push(text.substring(lastIndex, match.index));
    }
    const url = match[2];
    const urlPunc = match[3];
    const numDate = match[5];
    const numDatePunc = match[6];
    const spelledDate = match[8];
    const spelledPunc = match[9];
    const time = match[11];
    const timePunc = match[12];
    const venue = match[14];
    const venuePunc = match[15];

    if (url) {
      elements.push(
        <a
          key={pattern.lastIndex + 'url'}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#0077cc', textDecoration: 'underline' }}
        >
          {url}
        </a>
      );
      if (urlPunc) elements.push(urlPunc);
    } else if (numDate) {
      elements.push(
        <span key={pattern.lastIndex + 'numDate'} style={{ color: '#d35400', fontWeight: 'bold' }}>
          {numDate}
        </span>
      );
      if (numDatePunc) elements.push(numDatePunc);
    } else if (spelledDate) {
      elements.push(
        <span key={pattern.lastIndex + 'spelled'} style={{ color: '#9b59b6', fontWeight: 'bold' }}>
          {spelledDate}
        </span>
      );
      if (spelledPunc) elements.push(spelledPunc);
    } else if (time) {
      elements.push(
        <span key={pattern.lastIndex + 'time'} style={{ color: '#c0392b', fontWeight: 'bold' }}>
          {time}
        </span>
      );
      if (timePunc) elements.push(timePunc);
    } else if (venue) {
      elements.push(
        <span key={pattern.lastIndex + 'venue'} style={{ color: '#27ae60', fontStyle: 'italic' }}>
          {venue}
        </span>
      );
      if (venuePunc) elements.push(venuePunc);
    }
    lastIndex = pattern.lastIndex;
  }
  if (lastIndex < text.length) {
    elements.push(text.substring(lastIndex));
  }
  return elements;
}

// Render content with HTML formatting if detected; otherwise, use dynamic highlighting.
const renderContent = (text) => {
  if (/<[a-z][\s\S]*>/i.test(text)) {
    // Assume HTML formatting exists; replace newlines with <br />
    return (
      <span
        dangerouslySetInnerHTML={{ __html: text.replace(/\n/g, '<br />') }}
      />
    );
  } else {
    return <span>{highlightContent(text)}</span>;
  }
};

const ArticleCard = ({
  article,
  setSelectedArticle,
  onShare,
  toggleTag,
  adminId, // current admin's ID
  onEdit   // callback to edit the article
}) => {
  const isEditable = adminId && article.adminId && article.adminId === adminId;
  // Use a snippet if content is long; this snippet may include HTML formatting.
  const rawContent =
    article.content.length > 150 ? getSnippet(article.content) : article.content;

  return (
    <article
      className="news-item"
      data-category={article.category}
      data-timestamp={article.timestamp}
      onClick={() => setSelectedArticle(article)}
      style={{ position: 'relative' }}
    >
      <div className="article-content">
        <h2>{article.headline}</h2>
        {article.timestamp && (
          <p className="timestamp">
            {new Date(article.timestamp).toLocaleString()}
          </p>
        )}
        {/* Render the content; newlines are preserved */}
        <p style={{ whiteSpace: 'pre-wrap' }}>
          {renderContent(rawContent)}
        </p>
      </div>
      <div className="tags-container">
        <span
          className="tag category-tag"
          onClick={(e) => {
            e.stopPropagation();
            toggleTag(article.category);
          }}
          style={{
            cursor: 'pointer',
            backgroundColor: getColorForTag(article.category),
          }}
        >
          {article.category}
        </span>
        {article.tags &&
          article.tags.map((tag, index) => (
            <span
              key={index}
              className="tag tag-item"
              onClick={(e) => {
                e.stopPropagation();
                toggleTag(tag);
              }}
              style={{
                cursor: 'pointer',
                backgroundColor: getColorForTag(tag),
              }}
            >
              {tag}
            </span>
          ))}
      </div>
      <button
        className="share-btn"
        onClick={(e) => {
          e.stopPropagation();
          onShare(article);
        }}
        title="Share Article"
      >
        <span className="share-icon">⤷</span>
      </button>
      {isEditable && (
        <button
          className="edit-btn"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(article);
          }}
          title="Edit Article"
          style={{
            // position: 'absolute',
            // top: '10px',
            // right: '10px',
            // background: '#a67c52',
            // color: '#fff',
            // border: 'none',
            // padding: '5px 10px',
            // borderRadius: '4px',
            // cursor: 'pointer',
          }}
        >
          Edit
        </button>
      )}
    </article>
  );
};

export default ArticleCard;
