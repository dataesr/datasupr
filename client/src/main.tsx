import React, { ReactNode, useLayoutEffect } from 'react';
import ReactDOM from 'react-dom/client'
import Routes from './router.js'
import { BrowserRouter, Link, useLocation } from 'react-router-dom';
import { DSFRConfig } from '@dataesr/dsfr-plus';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

type RouterLinkProps = {
  href: string;
  replace?: boolean;
  target?: string;
  children?: React.ReactNode;
}

const RouterLink = ({ href, replace, target, ...props }: RouterLinkProps) => {
  if (target === "_blank") return <a href={href} target={target} {...props} />
  return <Link to={href} replace={replace} {...props} />
}

const ScrollToTop = (): ReactNode => {
  const { pathname } = useLocation();
  useLayoutEffect(() => {
    document.documentElement.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      refetchOnWindowFocus: false,
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ScrollToTop />
        {/* <DSFRConfig routerComponent={RouterLink} theme='light'> */}
        <DSFRConfig routerComponent={RouterLink}>
          <Routes />
        </DSFRConfig>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
