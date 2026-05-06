const circleStyle = (size) => ({
  width: size,
  height: size,
  borderRadius: '50%',
  overflow: 'hidden',
  flexShrink: 0,
  display: 'inline-flex',
});

export function FlagPL({ size = 22 }) {
  return (
    <div style={circleStyle(size)}>
      <svg width={size} height={size} viewBox="0 0 2 2" xmlns="http://www.w3.org/2000/svg">
        <rect width="2" height="1" fill="#FFFFFF" />
        <rect y="1" width="2" height="1" fill="#DC143C" />
      </svg>
    </div>
  );
}

export function FlagGB({ size = 22 }) {
  return (
    <div style={circleStyle(size)}>
      <svg width={size} height={size} viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
        {/* Blue field */}
        <rect width="60" height="60" fill="#012169" />

        {/* St Andrew's cross — white diagonals */}
        <line x1="0" y1="0" x2="60" y2="60" stroke="#FFFFFF" strokeWidth="12" />
        <line x1="60" y1="0" x2="0" y2="60" stroke="#FFFFFF" strokeWidth="12" />

        {/* St Patrick's cross — red diagonals (simplified, centred) */}
        <line x1="0" y1="0" x2="60" y2="60" stroke="#C8102E" strokeWidth="6" />
        <line x1="60" y1="0" x2="0" y2="60" stroke="#C8102E" strokeWidth="6" />

        {/* St George's cross — white arms */}
        <rect x="24" y="0" width="12" height="60" fill="#FFFFFF" />
        <rect x="0" y="24" width="60" height="12" fill="#FFFFFF" />

        {/* St George's cross — red arms */}
        <rect x="26" y="0" width="8" height="60" fill="#C8102E" />
        <rect x="0" y="26" width="60" height="8" fill="#C8102E" />
      </svg>
    </div>
  );
}
