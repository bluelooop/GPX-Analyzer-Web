import RouteForm from '../../components/RouteForm/RouteForm.tsx';
import { Container, Header } from 'semantic-ui-react';
import { useCallback, useState } from 'react';
import AuthService from '../../services/AuthService.ts';
import { GPXRoute, RouteProvider } from '../../models.ts';
import { getCookie } from '../../utils.ts';
import GpxService from '../../services/GpxService.ts';

function Homepage() {
  const [routeProvider, setRouteProvider] = useState<RouteProvider>({ name: '' });
  const [route, setRoute] = useState<GPXRoute>({} as GPXRoute);

  const analyzeRoute = async (routeURL: URL, splitBy: number) => {
    try {
      const routeData = await GpxService.analyze(routeURL, splitBy);
      setRoute(routeData);
    } catch {
      // Error Omitted
    }
  };

  const onAnalyzeRouteClick = useCallback(
    async (routeURL: URL, splitBy: number) => {
      let routeProviderAuthenticated = getCookie('_rpa');

      const handleRouteProviderAuthenticated = async () => {
        routeProviderAuthenticated = getCookie('_rpa');
        if (routeProviderAuthenticated) {
          window.removeEventListener('focus', handleRouteProviderAuthenticated);

          await analyzeRoute(routeURL, splitBy);
        }
      };
      if (routeProviderAuthenticated) {
        await analyzeRoute(routeURL, splitBy);
      } else {
        if (routeProvider?.consentUrl) {
          window.addEventListener('focus', handleRouteProviderAuthenticated);

          window.open(
            routeProvider.consentUrl,
            '_blank',
            'width=600,height=600;status=yes,toolbar=no,menubar=no,location=no',
          );
        }
      }
    },
    [routeProvider],
  );

  const onVerifyRouteURL = useCallback(async (routeURL: string) => {
    try {
      const provider = await AuthService.routeProvider(routeURL);
      setRouteProvider(provider);
    } catch {
      // Error Omitted
    }
  }, []);

  return (
    <div className="homepage">
      <Container>
        <header>
          <Header as="h1">GPX Analyzer</Header>
        </header>
        <main>
          <p>Welcome to GPX Analyzer!</p>
          <RouteForm
            onVerifyRouteURL={onVerifyRouteURL}
            onAnalyzeRouteClick={onAnalyzeRouteClick}
            splitBy={10}
          />
          {/*<RoutePanel />*/}
        </main>
      </Container>
    </div>
  );
}

export default Homepage;
