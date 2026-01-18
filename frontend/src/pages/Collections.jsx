// What this does:
// Displays Instagram posts using oEmbed style embeds (no API keys)
import React from "react";
import "./Collections.css";
import { InstagramEmbed } from "react-social-media-embed";

const Collections = () => {
  // Put your real Instagram post links here (each one is a post/reel URL)
  const posts = [
    "https://www.instagram.com/_yvesnails_art_rwanda/reel/DTQrc2fDEWx/",
    "https://www.instagram.com/_yvesnails_art_rwanda/reel/DS7_fH4DDeX/",
    "https://www.instagram.com/_yvesnails_art_rwanda/reel/DS4doQEjFvO/",
  ];

  return (
    <div className="collections-page">
      {/* Banner */}
      <div className="collections-banner">
        <h1>Collections</h1>
        <p>See our latest work from Instagram </p>
      </div>

      {/* Grid of embeds */}
    
      <div className="ig-embed-grid">
        {posts.map((url) => (
          <div className="ig-embed-card" key={url}>
            <InstagramEmbed url={url} width="100%" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Collections;
