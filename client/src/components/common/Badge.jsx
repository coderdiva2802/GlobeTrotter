/**
 * Reusable Status Badge Component
 * @param {'COMPLETED' | 'UPCOMING' | 'ONGOING' | string} status
 */
export const Badge = ({ status, className = '' }) => {
  const normalized = (status || '').toUpperCase();
  
  const isCompleted = normalized === 'COMPLETED';
  const isUpcoming = normalized === 'UPCOMING';
  const isOngoing = normalized === 'ONGOING';

  let badgeStyle = {
    backgroundColor: 'var(--bg-subtle)',
    color: 'var(--text-muted)',
    border: '1px solid var(--border-color)',
  };

  let label = status || 'Trip';

  if (isCompleted) {
    badgeStyle = {
      backgroundColor: 'var(--status-completed-bg)',
      color: 'var(--status-completed-text)',
      border: '1px solid var(--status-completed-border)',
    };
    label = 'Completed';
  } else if (isUpcoming) {
    badgeStyle = {
      backgroundColor: 'var(--status-upcoming-bg)',
      color: 'var(--status-upcoming-text)',
      border: '1px solid var(--status-upcoming-border)',
    };
    label = 'Upcoming';
  } else if (isOngoing) {
    badgeStyle = {
      backgroundColor: '#eff6ff',
      color: '#2563eb',
      border: '1px solid #bfdbfe',
    };
    label = 'Ongoing';
  }

  return (
    <span
      className={`badge ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '3px 10px',
        borderRadius: 'var(--radius-full)',
        fontSize: '0.72rem',
        fontWeight: '600',
        letterSpacing: '0.02em',
        textTransform: 'capitalize',
        ...badgeStyle,
      }}
    >
      {label}
    </span>
  );
};

export default Badge;
