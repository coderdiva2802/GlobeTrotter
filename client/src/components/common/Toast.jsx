import { CheckCircle2, AlertCircle, X } from 'lucide-react';
import './Toast.css';

export default function Toast({ type = 'success', message, onClose }) {
  if (!message) return null;

  return (
    <div className={`toast-notification toast-${type}`} role="alert">
      <div className="toast-icon">
        {type === 'success' ? (
          <CheckCircle2 size={18} className="toast-success-icon" />
        ) : (
          <AlertCircle size={18} className="toast-error-icon" />
        )}
      </div>
      <div className="toast-body">
        <p className="toast-text">{message}</p>
      </div>
      {onClose && (
        <button type="button" className="toast-close" onClick={onClose} aria-label="Close notification">
          <X size={16} />
        </button>
      )}
    </div>
  );
}
