import React, { useCallback, useState } from 'react';
import RouteForm from '../../components/RouteForm/RouteForm.tsx';
import { Container, Grid, Header, Message, MessageHeader } from 'semantic-ui-react';
import AuthService from '../../services/AuthService.ts';
import { GPXRoute, RouteProvider } from '../../models.ts';
import { getCookie } from '../../utils.ts';
import GpxService from '../../services/GpxService.ts';
import RoutePanel from '../../components/RoutePanel/RoutePanel.tsx';

const Homepage: React.FC = () => {
  const [routeProvider, setRouteProvider] = useState<RouteProvider>({ name: '' });
  const [route, setRoute] = useState<GPXRoute | null>();
  const [analyzeFeedbackMessage, setAnalyzeFeedbackMessage] = useState<string>();

  const analyzeRoute = async (routeURL: URL, splitBy: number) => {
    setAnalyzeFeedbackMessage('');
    setRoute(null);
    try {
      const routeData = await GpxService.analyze(routeURL, splitBy);
      setRoute(routeData);
    } catch (error: Error | any) {
      setAnalyzeFeedbackMessage(error.message);
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
          <Grid stackable>
            <Grid.Row>
              <Grid.Column>
                <p>Welcome to GPX Analyzer!</p>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <RouteForm
                  onVerifyRouteURL={onVerifyRouteURL}
                  onAnalyzeRouteClick={onAnalyzeRouteClick}
                />
              </Grid.Column>
            </Grid.Row>
            {analyzeFeedbackMessage && (
              <Grid.Row>
                <Grid.Column>
                  <Message error>
                    <MessageHeader>Oops... something went wrong</MessageHeader>
                    <p>{analyzeFeedbackMessage}</p>
                  </Message>
                </Grid.Column>
              </Grid.Row>
            )}
            <Grid.Row>
              <Grid.Column>
                {route && !analyzeFeedbackMessage && <RoutePanel route={route} />}
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </main>
      </Container>
    </div>
  );
};

export default Homepage;
