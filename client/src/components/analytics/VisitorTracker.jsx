// client/src/components/analytics/VisitorTracker.jsx

import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { trackVisitorEvent } from '../../utils/visitorTracking';

export default function VisitorTracker() {
  const location = useLocation();
  const trackedPaths = useRef(new Set());

  useEffect(() => {
    const currentPath = location.pathname + location.search;
    
    // Prevent tracking the same path multiple times in a session
    // (e.g., if React double-renders in StrictMode, or user refreshes heavily)
    if (!trackedPaths.current.has(currentPath)) {
      trackVisitorEvent('page_view');
      trackedPaths.current.add(currentPath);
    }
  }, [location]);

  return null;
}
