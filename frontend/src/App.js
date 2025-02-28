// App.js
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import HeaderComponent from "./components/HeaderComponent";
import NewsContainer from "./components/NewsContainer";
import CalendarSection from "./components/CalendarSection";
import ArticlePopup from "./components/ArticlePopup";
import AddArticleModal from "./components/AddArticleModal";
import ShareModal from "./components/ShareModal";
import LoginModal from "./components/LoginModal";
import RegisterModal from "./components/RegisterModal";
import AboutUs from "./components/AboutUs";
import { isSameDay } from "./components/utils";
// import  "./components/Animations";

function App() {
  // State variables for articles, admin, modals, etc.
  const [articles, setArticles] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedTags, setSelectedTags] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [showAddArticleModal, setShowAddArticleModal] = useState(false);
  const [layoutMode, setLayoutMode] = useState("grid");
  const [newArticleForm, setNewArticleForm] = useState({
    headline: "",
    content: "",
    author: "",
    category: "events",
    tags: "",
    clubs: [],
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedPdfFiles, setSelectedPdfFiles] = useState([]);
  const [theme, setTheme] = useState("scifi");
  const [showShareModal, setShowShareModal] = useState(false);
  const [articleToShare, setArticleToShare] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [registerForm, setRegisterForm] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [registerError, setRegisterError] = useState("");
  const [adminId, setAdminId] = useState(null);
  const [adminUsername, setAdminUsername] = useState(null);
  const [editingArticle, setEditingArticle] = useState(null);

  // New state to toggle between Home and About Us views.
  const [currentView, setCurrentView] = useState("home");

  const articlesContainerRef = useRef(null);

  // Theme loading effect
  useEffect(() => {
    let themeLink = document.getElementById("theme-stylesheet");
    const newHref = `/css_themes/${theme}.css`;
    if (themeLink) {
      themeLink.href = newHref;
    } else {
      themeLink = document.createElement("link");
      themeLink.id = "theme-stylesheet";
      themeLink.rel = "stylesheet";
      themeLink.href = newHref;
      document.head.appendChild(themeLink);
    }
  }, [theme]);

  // Fetch articles from backend
  useEffect(() => {
    axios
      .get("http://localhost:5000/articles")
      .then((response) => {
        const sorted = response.data.sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        );
        setArticles(sorted);
      })
      .catch((error) => {
        console.error("Error fetching articles:", error);
      });
  }, []);

  // Check URL for shared article
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const articleId = params.get("articleId");
    if (articleId && articles.length > 0) {
      const sharedArticle = articles.find((a) => a._id === articleId);
      if (sharedArticle) {
        setSelectedArticle(sharedArticle);
      }
    }
  }, [articles]);

  // Filter articles based on category, tags, and search query
  const filteredArticles = articles.filter((article) => {
    const matchesCategory =
      categoryFilter === "all" ? true : article.category === categoryFilter;
    const matchesTags =
      selectedTags.length === 0 ||
      (article.tags && article.tags.some((tag) => selectedTags.includes(tag)));
    const matchesSearch =
      searchQuery.trim() === "" ||
      article.headline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesTags && matchesSearch;
  });

  // Scroll handler for the news container
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

  // Navigation handlers for ArticlePopup
  const handlePrevArticle = (e) => {
    e.stopPropagation();
    const currentIndex = filteredArticles.findIndex(
      (article) => article._id === selectedArticle._id
    );
    if (currentIndex > 0) {
      setSelectedArticle(filteredArticles[currentIndex - 1]);
    }
  };

  const handleNextArticle = (e) => {
    e.stopPropagation();
    const currentIndex = filteredArticles.findIndex(
      (article) => article._id === selectedArticle._id
    );
    if (currentIndex < filteredArticles.length - 1) {
      setSelectedArticle(filteredArticles[currentIndex + 1]);
    }
  };

  // Share handlers
  const handleShare = (article) => {
    setArticleToShare(article);
    setShowShareModal(true);
  };

  const handlePopupShare = () => {
    if (selectedArticle) {
      const shareUrl = `${window.location.origin}${window.location.pathname}?articleId=${selectedArticle._id}`;
      const text = encodeURIComponent(
        `Check out this article! \n*${selectedArticle.headline}*\n${shareUrl}`
      );
      const whatsappUrl = `https://api.whatsapp.com/send?text=${text}`;
      window.open(whatsappUrl, "_blank");
    }
  };

  const handleShareToWhatsApp = () => {
    if (articleToShare) {
      const shareUrl = `${window.location.origin}${window.location.pathname}?articleId=${articleToShare._id}`;
      const text = encodeURIComponent(
        `Check out this article: ${articleToShare.headline} ${shareUrl}`
      );
      const whatsappUrl = `https://api.whatsapp.com/send?text=${text}`;
      window.open(whatsappUrl, "_blank");
      setShowShareModal(false);
    }
  };

  // Admin-related handlers
  const handleAddArticleClick = () => {
    if (isAdminAuthenticated) {
      setEditingArticle(null);
      setNewArticleForm({
        headline: "",
        content: "",
        author: adminUsername || "",
        category: "events",
        tags: "",
        clubs: [],
      });
      setShowAddArticleModal(true);
    } else {
      setShowLoginModal(true);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/admins/login",
        loginForm
      );
      const { token, adminId, username } = response.data;
      localStorage.setItem("adminToken", token);
      setAdminId(adminId);
      setAdminUsername(username);
      setIsAdminAuthenticated(true);
      setShowLoginModal(false);
      setNewArticleForm((prev) => ({ ...prev, author: username }));
      setLoginError("");
      setLoginForm({ username: "", password: "" });
    } catch (error) {
      console.error("Login error:", error);
      setLoginError("Invalid credentials. Please try again.");
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (registerForm.password !== registerForm.confirmPassword) {
      setRegisterError("Passwords do not match.");
      return;
    }
    try {
      await axios.post("http://localhost:5000/admins/register", {
        username: registerForm.username,
        password: registerForm.password,
      });
      alert("Registration successful. Please log in.");
      setShowRegisterModal(false);
      setShowLoginModal(true);
      setRegisterForm({ username: "", password: "", confirmPassword: "" });
      setRegisterError("");
    } catch (error) {
      console.error("Registration error:", error);
      setRegisterError(
        error.response?.data?.error || "Registration failed. Please try again."
      );
    }
  };

  // Calendar change handler
  const handleCalendarChange = (date) => {
    setSelectedDate(date);
    setSelectedTags([]);
    if (articlesContainerRef.current) {
      const targetArticle = filteredArticles.find((article) =>
        isSameDay(new Date(article.timestamp), date)
      );
      if (targetArticle) {
        const articleElement = articlesContainerRef.current.querySelector(
          `[data-timestamp="${targetArticle.timestamp}"]`
        );
        if (articleElement) {
          articleElement.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    }
  };

  // Tag toggle handler
  const toggleTag = (tag) => {
    setSelectedTags((prevTags) =>
      prevTags.includes(tag)
        ? prevTags.filter((t) => t !== tag)
        : [...prevTags, tag]
    );
  };

  // Handlers for new article form
  const handleNewArticleInputChange = (e) => {
    const { id, value } = e.target;
    setNewArticleForm((prev) => ({ ...prev, [id]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
  };

  const handlePdfChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedPdfFiles(files);
  };

  const handleClubToggle = (club) => {
    setNewArticleForm((prev) => {
      const clubs = prev.clubs.includes(club)
        ? prev.clubs.filter((c) => c !== club)
        : [...prev.clubs, club];
      return { ...prev, clubs };
    });
  };

  const handleNewArticleSubmit = async (e) => {
    e.preventDefault();
    let imageUrls = [];
    let pdfUrls = [];

    if (selectedFiles.length > 0) {
      const formDataUpload = new FormData();
      selectedFiles.forEach((file) => {
        formDataUpload.append("images", file);
      });
      try {
        const uploadResponse = await axios.post(
          "http://localhost:5000/upload",
          formDataUpload,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        imageUrls = uploadResponse.data;
      } catch (error) {
        console.error("Error uploading images:", error);
      }
    }

    if (selectedPdfFiles.length > 0) {
      const formDataUploadPdfs = new FormData();
      selectedPdfFiles.forEach((file) => {
        formDataUploadPdfs.append("pdfs", file);
      });
      try {
        const uploadPdfResponse = await axios.post(
          "http://localhost:5000/upload-pdfs",
          formDataUploadPdfs,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        pdfUrls = uploadPdfResponse.data;
      } catch (error) {
        console.error("Error uploading PDFs:", error);
      }
    }

    const manualTags = newArticleForm.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag);
    const combinedTags = [...manualTags, ...newArticleForm.clubs];

    const finalAuthor = isAdminAuthenticated
      ? adminUsername
      : newArticleForm.author;
    const finalAdminId = isAdminAuthenticated ? adminId : null;

    const articleData = {
      headline: newArticleForm.headline,
      content: newArticleForm.content,
      category: newArticleForm.category,
      adminName: finalAuthor,
      adminId: finalAdminId,
      timestamp: new Date(),
      tags: combinedTags,
      images: imageUrls,
      attachments: pdfUrls,
    };

    try {
      if (editingArticle) {
        const response = await axios.put(
          `http://localhost:5000/articles/${editingArticle._id}`,
          articleData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
            },
          }
        );
        setArticles((prevArticles) =>
          prevArticles.map((a) =>
            a._id === editingArticle._id ? response.data : a
          )
        );
        setEditingArticle(null);
      } else {
        const response = await axios.post(
          "http://localhost:5000/articles",
          articleData
        );
        setArticles((prevArticles) => [response.data, ...prevArticles]);
      }
      setShowAddArticleModal(false);
      setNewArticleForm({
        headline: "",
        content: "",
        author: "",
        category: "events",
        tags: "",
        clubs: [],
      });
      setSelectedFiles([]);
      setSelectedPdfFiles([]);
    } catch (error) {
      console.error("Error posting article:", error);
    }
  };

  // Handler for editing an article (admin only)
  const handleEditArticle = (article) => {
    if (isAdminAuthenticated && article.adminId === adminId) {
      setEditingArticle(article);
      setNewArticleForm({
        headline: article.headline,
        content: article.content,
        author: adminUsername,
        category: article.category,
        tags: article.tags.join(", "),
        clubs: article.clubs || [],
      });
      setShowAddArticleModal(true);
    } else {
      alert("You can only edit articles that you have written.");
    }
  };

  return (
    <div className="App">
      <HeaderComponent
        layoutMode={layoutMode}
        setLayoutMode={setLayoutMode}
        theme={theme}
        setTheme={setTheme}
        onAboutClick={() => setCurrentView("about")}
        hideExtras={currentView === "about"} // Hide right column in About Us view
      />

      {currentView === "home" ? (
        <>
          <div className="content">
            <div className="sticky-day-header">
              <hr className="day-separator" />
              <span className="current-day-label">
                {selectedDate.toLocaleDateString()}
              </span>
            </div>
            <NewsContainer
              ref={articlesContainerRef}
              onScroll={handleScroll}
              articles={filteredArticles}
              layoutMode={layoutMode}
              setSelectedArticle={setSelectedArticle}
              onShare={handleShare}
              toggleTag={toggleTag}
              adminId={adminId}
              onEdit={handleEditArticle}
            />
            <CalendarSection
              selectedDate={selectedDate}
              handleCalendarChange={handleCalendarChange}
              articles={articles}
              categoryFilter={categoryFilter}
              setCategoryFilter={setCategoryFilter}
              selectedTags={selectedTags}
              setSelectedTags={setSelectedTags}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              toggleTag={toggleTag}
              handleAddArticleClick={handleAddArticleClick}
            />
          </div>
          {selectedArticle && (
            <ArticlePopup
              selectedArticle={selectedArticle}
              handlePrevArticle={handlePrevArticle}
              handleNextArticle={handleNextArticle}
              setSelectedArticle={setSelectedArticle}
              handlePopupShare={handlePopupShare}
            />
          )}
          <AddArticleModal
            showAddArticleModal={showAddArticleModal}
            setShowAddArticleModal={setShowAddArticleModal}
            newArticleForm={newArticleForm}
            setNewArticleForm={setNewArticleForm}
            selectedFiles={selectedFiles}
            setSelectedFiles={setSelectedFiles}
            selectedPdfFiles={selectedPdfFiles}
            setSelectedPdfFiles={setSelectedPdfFiles}
            handleNewArticleSubmit={handleNewArticleSubmit}
            handleClubToggle={handleClubToggle}
            handleFileChange={handleFileChange}
            handlePdfChange={handlePdfChange}
            handleNewArticleInputChange={handleNewArticleInputChange}
            adminUsername={adminUsername}
          />
          <ShareModal
            showShareModal={showShareModal}
            setShowShareModal={setShowShareModal}
            handleShareToWhatsApp={handleShareToWhatsApp}
          />
          <LoginModal
            showLoginModal={showLoginModal}
            setShowLoginModal={setShowLoginModal}
            loginForm={loginForm}
            setLoginForm={setLoginForm}
            loginError={loginError}
            handleLoginSubmit={handleLoginSubmit}
            setShowRegisterModal={setShowRegisterModal}
          />
          <RegisterModal
            showRegisterModal={showRegisterModal}
            setShowRegisterModal={setShowRegisterModal}
            registerForm={registerForm}
            setRegisterForm={setRegisterForm}
            registerError={registerError}
            handleRegisterSubmit={handleRegisterSubmit}
            setShowLoginModal={setShowLoginModal}
          />
        </>
      ) : (
        // Render About Us view
        <AboutUs onBack={() => setCurrentView("home")} />
      )}
    </div>
  );
}

export default App;
