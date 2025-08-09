import React, { useEffect } from "react";
import { InteractiveHoverButton } from "./magicui/interactive-hover-button";

interface LandingProps {
  onTryNowClick: () => void;
}

const Landing: React.FC<LandingProps> = ({ onTryNowClick }) => {
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "module";
    script.src =
      "https://unpkg.com/@splinetool/viewer@1.10.44/build/spline-viewer.js";
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="relative h-screen w-screen">
      <spline-viewer
        loading-anim-type="spinner-small-light"
        url="https://prod.spline.design/eTeo6rfhLvn6n1dv/scene.splinecode"
      ></spline-viewer>
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2">
        <InteractiveHoverButton onClick={onTryNowClick}>
          Try Now
        </InteractiveHoverButton>
      </div>
    </div>
  );
};

export default Landing;