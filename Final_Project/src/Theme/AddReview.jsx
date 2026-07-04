import React, { useState } from "react";
import { Link } from "react-router-dom";
import Dash_navbar from "../component/Dash_navbar";
import Footer from "../component/Footer";
import { apiRequest } from "../Api/client";
import "./add-review.css";

const initialForm = {
  name: "",
  email: "",
  review: "",
};

function AddReviewPage() {
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");
  const username = userData?.github || "github";
  const [formData, setFormData] = useState(initialForm);
  const [submitState, setSubmitState] = useState({ status: "idle", message: "" });

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitState({ status: "loading", message: "Saving your review..." });

    try {
      await apiRequest("/reviews", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      setFormData(initialForm);
      setSubmitState({
        status: "success",
        message: "Review saved successfully. Thank you for sharing your feedback.",
      });
    } catch (error) {
      setSubmitState({
        status: "error",
        message: error.message || "Could not save your review. Please try again.",
      });
    }
  }

  return (
    <div className="add-review-layout">
      <Dash_navbar
        avatar={`https://github.com/${username}.png`}
        profileLink={`https://github.com/${username}`}
      />

      <main className="add-review-page mt-5">
        <section className="add-review-wrapper container">
          <div className="add-review-grid">
            <aside className="add-review-side">
              <p className="add-review-kicker">Share your feedback</p>
              <h1>Add Your Review</h1>
              <p>
                Fill in your details and your review will be saved so it can appear on the signup page.
              </p>

              <div className="add-review-tip">
                <h2>Tips for better reviews</h2>
                <p>Mention the template name, what you liked, and any feature you want next.</p>
              </div>
            </aside>

            <form className="add-review-form" onSubmit={handleSubmit}>
              <label htmlFor="name">Name</label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your full name"
                required
              />

              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
              />

              <label htmlFor="review">Review / Message</label>
              <textarea
                id="review"
                name="review"
                rows="6"
                value={formData.review}
                onChange={handleChange}
                placeholder="Write your review here..."
                required
              />

              <div className="add-review-actions">
                <Link to="/theme" className="add-review-back">
                  Back to Themes
                </Link>
                <button
                  type="submit"
                  className="add-review-submit"
                  disabled={submitState.status === "loading"}
                >
                  {submitState.status === "loading" ? "Saving..." : "Save Review"}
                </button>
              </div>

              {submitState.message && (
                <p className={`add-review-status ${submitState.status}`}>
                  {submitState.message}
                </p>
              )}
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default AddReviewPage;
