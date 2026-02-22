// src/components/windows/Settings/components/PortfolioInfoWindow.jsx
import PortfolioInfoSection from "./PortfolioInfoSection";

export default function PortfolioInfoWindow({ uiTheme = "glass", glassContrast = "light" }) {
  return (
    <div className="h-full p-6 overflow-auto">
      <PortfolioInfoSection uiTheme={uiTheme} glassContrast={glassContrast} />
    </div>
  );
}