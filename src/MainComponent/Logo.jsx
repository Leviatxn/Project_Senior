import React from 'react';
import '../LoginPage.css';

const Logo = ({ fontSize = "60px", color = "#006765", overlayColor = "#00A6A2",margin = "0" }) => {
    return (
        <div
          className="ku-coop-title"
          style={{
            margin: margin,
          }}
        >
          <h1
            className="text-base"
            style={{
              fontSize: fontSize,
              color: color,
            }}
          >
            K<span className="text-overlay" style={{ color: overlayColor }}>U - CO</span>OP
          </h1>
        </div>
      );
    };

export default Logo;