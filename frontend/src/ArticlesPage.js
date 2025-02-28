import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./App.css";

// Helper: checks if two dates are on the same day.
function isSameDay(date1, date2) {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

function ArticlesPage() {
  const [articles, setArticles] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedTags, setSelectedTags] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArticle, setSelectedArticle] = useState(null); // for article view popup
  const [showAddArticleModal, setShowAddArticleModal] = useState(false); // for add article popup

  // State for the new article form data.
  const [newArticleForm, setNewArticleForm] = useState({
    headline: "",
    content: "",
    author: "",
    category: "events",
    tags: "",
  });

  const articlesContainerRef = useRef(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/articles")
      .then((response) => {
        setArticles(response.data);
      })
      .catch((error) => {
        console.error("Error fetching articles:", error);
      });
  }, []);

  const filteredArticles = articles.filter((article) => {
    const articleDate = new Date(article.timestamp);
    const matchesDate = isSameDay(articleDate, selectedDate);
    const matchesCategory =
      categoryFilter === "all" ? true : article.category === categoryFilter;
    const matchesTags =
      selectedTags.length === 0 ||
      (article.tags && article.tags.some((tag) => selectedTags.includes(tag)));
    const matchesSearch =
      searchQuery.trim() === "" ||
      article.headline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDate && matchesCategory && matchesTags && matchesSearch;
  });

  const handleCalendarChange = (date) => {
    setSelectedDate(date);
    if (articlesContainerRef.current) {
      articlesContainerRef.current.scrollTop = 0;
    }
    setSelectedTags([]);
  };

  const toggleTag = (tag) => {
    setSelectedTags((prevTags) =>
      prevTags.includes(tag)
        ? prevTags.filter((t) => t !== tag)
        : [...prevTags, tag]
    );
  };

  const handleScroll = () => {
    const container = articlesContainerRef.current;
    if (!container) return;
    const articleElements = container.getElementsByClassName("news-item");
    if (articleElements.length === 0) return;
    for (let el of articleElements) {
      const rect = el.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      if (rect.top >= containerRect.top && rect.top < containerRect.top + 50) {
        const ts = el.getAttribute("data-timestamp");
        if (ts) {
          setSelectedDate(new Date(ts));
        }
        break;
      }
    }
  };

  // Handler for new article form input changes.
  const handleNewArticleInputChange = (e) => {
    const { id, value } = e.target;
    setNewArticleForm((prev) => ({ ...prev, [id]: value }));
  };

  // Handler for new article form submission.
  const handleNewArticleSubmit = (e) => {
    e.preventDefault();
    const tagsArray = newArticleForm.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag);
    const newArticle = {
      headline: newArticleForm.headline,
      content: newArticleForm.content,
      category: newArticleForm.category,
      adminName: newArticleForm.author,
      timestamp: new Date(),
      tags: tagsArray,
    };
    axios
      .post("http://localhost:5000/articles", newArticle)
      .then((response) => {
        // Optionally update the articles list with the new article.
        setArticles((prevArticles) => [response.data, ...prevArticles]);
        setShowAddArticleModal(false);
        // Reset the form.
        setNewArticleForm({
          headline: "",
          content: "",
          author: "",
          category: "events",
          tags: "",
        });
      })
      .catch((error) => {
        console.error("Error posting article:", error);
      });
  };

  return (
    <div className="App">
      <header>
        <h1>Axiom</h1>
      </header>

      <div className="content">
        {/* Articles Section (scrollable) */}
        <section
          className="news-container"
          ref={articlesContainerRef}
          onScroll={handleScroll}
        >
          {filteredArticles.length === 0 ? (
            <p className="no-articles">
              No articles found for this day, category, tag, or search.
            </p>
          ) : (
            filteredArticles.map((article) => (
              <article
                key={article._id}
                className="news-item"
                data-category={article.category}
                data-timestamp={article.timestamp}
                onClick={() => setSelectedArticle(article)}
              >
                <div className="article-content">
                  <h2>{article.headline}</h2>
                  {article.timestamp && (
                    <p className="timestamp">
                      {new Date(article.timestamp).toLocaleString()}
                    </p>
                  )}
                  <p>{article.content}</p>
                </div>
                <div className="tags-container">
                  <span
                    className="tag category-tag"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleTag(article.category);
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    {article.category}
                  </span>
                  {article.tags &&
                    article.tags.length > 0 &&
                    article.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="tag tag-item"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleTag(tag);
                        }}
                        style={{ cursor: "pointer" }}
                      >
                        {tag}
                      </span>
                    ))}
                </div>
              </article>
            ))
          )}
        </section>

        {/* Calendar & Filters Section */}
        <section className="calendar-section">
          <div className="calendar-header">
            <h2>Event Calendar</h2>
            <button
              className="add-article-btn"
              onClick={() => setShowAddArticleModal(true)}
            >
              Add Article
            </button>
          </div>
          <div className="calendar-container">
            <Calendar onChange={handleCalendarChange} value={selectedDate} />
          </div>
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
                <h3>Active Tag Filters:</h3>
                {selectedTags.map((tag, index) => (
                  <span
                    key={index}
                    className="tag tag-item"
                    onClick={() => toggleTag(tag)}
                    style={{ cursor: "pointer" }}
                  >
                    {tag}
                  </span>
                ))}
                <button
                  onClick={() => setSelectedTags([])}
                  className="filter-btn"
                >
                  Clear Tag Filters
                </button>
              </div>
            )}
            <div className="search-container">
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </section>
      </div>

      {/* Popup Modal for displaying selected article */}
      {selectedArticle && (
        <div
          className="popup-overlay"
          onClick={() => setSelectedArticle(null)}
        >
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="close-btn"
              onClick={() => setSelectedArticle(null)}
            >
              &times;
            </button>
            <h2>{selectedArticle.headline}</h2>
            {selectedArticle.timestamp && (
              <p className="timestamp">
                {new Date(selectedArticle.timestamp).toLocaleString()}
              </p>
            )}
            <p>{selectedArticle.content}</p>
            {selectedArticle.tags && (
              <div className="tags-container">
                <span className="tag category-tag">
                  {selectedArticle.category}
                </span>
                {selectedArticle.tags.map((tag, index) => (
                  <span key={index} className="tag tag-item">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Popup Modal for the Add Article Form */}
      {showAddArticleModal && (
        <div
          className="popup-overlay"
          onClick={() => setShowAddArticleModal(false)}
        >
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="close-btn"
              onClick={() => setShowAddArticleModal(false)}
            >
              &times;
            </button>
            <h2>Submit a News Article</h2>
            <form id="news-form" onSubmit={handleNewArticleSubmit}>
              <input
                type="text"
                id="headline"
                placeholder="Headline"
                value={newArticleForm.headline}
                onChange={handleNewArticleInputChange}
                required
              />
              <textarea
                id="content"
                placeholder="Article Content"
                value={newArticleForm.content}
                onChange={handleNewArticleInputChange}
                required
              />
              <input
                type="text"
                id="author"
                placeholder="Author Name"
                value={newArticleForm.author}
                onChange={handleNewArticleInputChange}
                required
              />
              <select
                id="category"
                value={newArticleForm.category}
                onChange={handleNewArticleInputChange}
              >
                <option value="events">Events</option>
                <option value="academic">Academics</option>
                <option value="career">Career</option>
              </select>
              <input
                type="text"
                id="tags"
                placeholder="Tags (comma separated)"
                value={newArticleForm.tags}
                onChange={handleNewArticleInputChange}
              />
              <button type="submit">Post Article</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ArticlesPage;
