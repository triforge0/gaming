import mixpanel from 'mixpanel-browser';

// Project Token is set via Vite env variables: VITE_MIXPANEL_TOKEN
const PROJECT_TOKEN = import.meta.env.VITE_MIXPANEL_TOKEN || '';

if (PROJECT_TOKEN) {
  mixpanel.init(PROJECT_TOKEN, {
    debug: import.meta.env.DEV, // debug mode only in development
    track_pageview: true,       // track pageviews automatically
    persistence: 'localStorage',
    ignore_dnt: true,           // Ignore Do Not Track setting to ensure tracking works
  });
} else if (import.meta.env.DEV && import.meta.env.MODE !== 'test') {
  console.warn('Mixpanel Token not found. Tracking is disabled in development.');
}

export const trackEvent = (
  eventName: string,
  properties?: Record<string, any>,
  options?: { transport?: 'xhr' | 'sendBeacon' }
) => {
  if (PROJECT_TOKEN) {
    mixpanel.track(eventName, properties, options);
  } else if (import.meta.env.DEV && import.meta.env.MODE !== 'test') {
    console.log(`[Mixpanel Debug] Event: ${eventName}`, properties, options);
  }
};

export const identifyUser = (userId: string) => {
  if (PROJECT_TOKEN) {
    mixpanel.identify(userId);
  } else if (import.meta.env.DEV && import.meta.env.MODE !== 'test') {
    console.log(`[Mixpanel Debug] Identify: ${userId}`);
  }
};
