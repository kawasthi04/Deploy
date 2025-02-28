// CalendarSection.js
import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { getColorForTag } from './utils';

const CalendarSection = ({
  selectedDate,
  handleCalendarChange,
  articles,
  categoryFilter,
  setCategoryFilter,
  selectedTags,
  setSelectedTags,
  searchQuery,
  setSearchQuery,
  toggleTag,
  handleAddArticleClick,
}) => (
  <section className="calendar-section">
    <div className="calendar-header">
      <h2>Event Calendar</h2>
      <button className="add-article-btn" onClick={handleAddArticleClick}>
        Write Article
      </button>
    </div>
    <div className="calendar-container">
      <Calendar
        onChange={handleCalendarChange}
        value={selectedDate}
        tileClassName={({ date, view }) => {
          if (view === 'month') {
            const hasArticle = articles.some((article) =>
              date.toISOString().split('T')[0] ===
              new Date(article.timestamp).toISOString().split('T')[0]
            );
            return hasArticle ? 'has-article' : null;
          }
        }}
      />
    </div>
    <div className="search-container">
      <input
        type="text"
        placeholder="Search articles..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
    <br />
    <div className="filter-controls">
      <div className="dropdown-container">
        <select
          id="categoryFilter"
          value={categoryFilter}
          onChange={(e) => {
            setCategoryFilter(e.target.value);
            setSelectedTags([]);
          }}
        >
          <option value="all">All Categories</option>
          <option value="events">Events</option>
          <option value="academic">Academics</option>
          <option value="career">Career</option>
        </select>
      </div>
      {selectedTags.length > 0 && (
        <div className="active-tags">
          {selectedTags.map((tag, index) => (
            <span
              key={index}
              className="tag tag-item"
              onClick={() => toggleTag(tag)}
              style={{
                cursor: 'pointer',
                backgroundColor: getColorForTag(tag),
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  </section>
);

export default CalendarSection;