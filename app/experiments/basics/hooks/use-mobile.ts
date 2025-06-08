import { useState, useEffect } from 'react';
import { Dimensions } from 'react-native';

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState<boolean>(true);

  useEffect(() => {
    const updateDimensions = () => {
      const { width } = Dimensions.get('window');
      setIsMobile(width < MOBILE_BREAKPOINT);
    };

    // İlk yükleme kontrolü
    updateDimensions();

    // Ekran boyutu değişikliklerini dinle - yeni API
    const subscription = Dimensions.addEventListener(
      'change',
      updateDimensions
    );

    return () => {
      // Yeni API için cleanup
      if (subscription?.remove) {
        subscription.remove();
      }
    };
  }, []);

  return isMobile;
}
