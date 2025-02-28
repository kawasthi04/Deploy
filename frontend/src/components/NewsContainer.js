// NewsContainer.js
import React, { forwardRef } from 'react';
import ArticleCard from './ArticleCard';

const NewsContainer = forwardRef(
  ({ articles, layoutMode, setSelectedArticle, onShare, onScroll, toggleTag, adminId, onEdit }, ref) => (
    <section className={`news-container ${layoutMode}`} ref={ref} onScroll={onScroll}>
      {articles.length === 0 ? (
        <p className="no-articles">
          No articles found for this day, category, tag, or search.
        </p>
      ) : (
        articles.map((article) => (
          <ArticleCard
            key={article._id}
            article={article}
            setSelectedArticle={setSelectedArticle}
            onShare={onShare}
            toggleTag={toggleTag}
            adminId={adminId}       // Pass current admin's ID to ArticleCard
            onEdit={onEdit}         // Pass the edit callback to ArticleCard
          />
        ))
      )}
    </section>
  )
);

export default NewsContainer;
