import { ReactNode, useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const ScrollToTop = (): ReactNode => {
  const { pathname } = useLocation();
  useLayoutEffect(() => {
    document.documentElement.scrollTo(0, 0);
  }, [pathname]);
  return null;
}
