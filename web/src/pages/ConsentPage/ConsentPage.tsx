import React, { useCallback, useEffect } from 'react';
import { RouteProvider } from '../../models.ts';
import { useQueryParams } from '../../hooks.ts';
import { setCookie } from '../../utils.ts';

const ConsentPage: React.FC = () => {
  const searchParams = useQueryParams();

  const getRouteProvider = useCallback((): RouteProvider | null => {
    const routeProvider = sessionStorage.getItem('routeProvider');
    sessionStorage.removeItem('routeProvider');

    return routeProvider ? JSON.parse(routeProvider) : null;
  }, []);

  useEffect(() => {
    const routeProvider = getRouteProvider();

    if (routeProvider && routeProvider.consentUrl) {
      window.location.href = routeProvider.consentUrl;
    }
  }, [getRouteProvider]);

  useEffect(() => {
    const consentCode = searchParams['code'];
    if (consentCode) {
      setCookie('_rpcc', consentCode, 1);
      window.close();
    }
  }, [searchParams]);

  return null;
};

export default ConsentPage;
