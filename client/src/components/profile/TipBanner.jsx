import { Sparkles } from 'lucide-react';
import './TipBanner.css';

export default function TipBanner({
  text = 'Tip: Keep your profile updated and plan your trips in advance for a hassle-free travel experience!',
}) {
  return (
    <div className="tip-banner-container">
      <div className="tip-icon-wrapper">
        <Sparkles size={18} className="tip-sparkle-icon" />
      </div>
      <p className="tip-banner-text">{text}</p>
    </div>
  );
}
