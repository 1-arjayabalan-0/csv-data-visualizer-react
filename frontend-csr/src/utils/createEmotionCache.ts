import createCache from '@emotion/cache';

// Prepend: true moves MUI styles to the top of the <head> so they're loaded first.
// It allows developers to easily override MUI styles with other styling solutions, like CSS modules.
export default function createEmotionCache() {
  const isBrowser = typeof document !== 'undefined';
  
  // On the client side, Create a meta tag at the top of the <head> and set it as insertionPoint.
  if (isBrowser) {
    const emotionInsertionPoint = document.querySelector<HTMLMetaElement>(
      'meta[name="emotion-insertion-point"]'
    );
    return createCache({ 
      key: 'mui-style', 
      insertionPoint: emotionInsertionPoint ?? undefined,
      prepend: true 
    });
  }
  
  // On the server, use a simpler configuration
  return createCache({ key: 'mui-style' });
}