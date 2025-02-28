import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './App.css';

function AddArticlePage() {
  const [formData, setFormData] = useState({
    headline: '',
    content: '',
    author: '',
    category: 'events',
    tags: '',
  });
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const tagsArray = formData.tags
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag);
    const newArticle = {
      headline: formData.headline,
      content: formData.content,
      category: formData.category,
      adminName: formData.author,
      timestamp: new Date(),
      tags: tagsArray,
    };
    axios
      .post('http://localhost:5000/articles', newArticle)
      .then((response) => {
        navigate('/');
      })
      .catch((error) => {
        console.error('Error posting article:', error);
      });
  };

  return (
    <div className="App">
      <header>
        <h1>Axiom</h1>
      </header>
      <div className="add-article-container">
        <section className="add-article-section">
          <h2>Submit a News Article</h2>
          <form id="news-form" onSubmit={handleSubmit}>
            <input
              type="text"
              id="headline"
              placeholder="Headline"
              value={formData.headline}
              onChange={handleInputChange}
              required
            />
            <textarea
              id="content"
              placeholder="Article Content"
              value={formData.content}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              id="author"
              placeholder="Author Name"
              value={formData.author}
              onChange={handleInputChange}
              required
            />
            <select id="category" value={formData.category} onChange={handleInputChange}>
              <option value="events">Events</option>
              <option value="academic">Academics</option>
              <option value="career">Career</option>
            </select>
            <input
              type="text"
              id="tags"
              placeholder="Tags (comma separated)"
              value={formData.tags}
              onChange={handleInputChange}
            />
            <button type="submit">Post Article</button>
          </form>
          <div className="back-link">
            <Link to="/" className="filter-btn">Back to Articles</Link>
          </div>
        </section>
      </div>
    </div>
  );
}

export default AddArticlePage;
