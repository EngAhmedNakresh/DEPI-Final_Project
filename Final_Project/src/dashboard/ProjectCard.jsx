import "./project-card.css";

export default function ProjectCard({ repo, isSelected, onSelect }) {
  return (
    <div className="project-card">

      {/* Header */}
      <div className="card-head">
        <div className="title-section">
          <i className="fa-regular fa-folder folder-icon"></i>
          <h4>{repo.name}</h4>
        </div>

        <span className={`repo-status ${repo.private ? "private" : "public"}`}>
          {repo.private ? "Private" : "Public"}
        </span>
      </div>

      {/* Description */}
      <p className="description">
        {repo.description || "No description provided."}
      </p>

      {/* Language */}
      <div className="tags">
        {repo.language && (
          <span className="language-tag">{repo.language}</span>
        )}
      </div>

      {/* Actions */}
      <div className="card-actions">
        <a
          href={repo.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="repo-link optimize-btn text-center" >✨ AI Optimize</a>

        <label className="select-box">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onSelect(repo.name)}
          />
          <span className="checkmark"></span>
          <span className="select-text">Select</span>
        </label>
      </div>
    </div>
  );
}