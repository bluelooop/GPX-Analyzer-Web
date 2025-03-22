import React, { useCallback, useState } from 'react';
import RouteForm from '../../components/RouteForm/RouteForm.tsx';
import { Container, Grid, Header, Segment } from 'semantic-ui-react';
import AuthService from '../../services/AuthService.ts';
import { GPXRoute, RouteProvider } from '../../models.ts';
import { getCookie } from '../../utils.ts';
import GpxService from '../../services/GpxService.ts';
import RoutePanel from '../../components/RoutePanel/RoutePanel.tsx';

import FeedbackMessage from '../../components/FeedbackMessage/FeedbackMessage.tsx';
import './Homepage.scss';

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
    } catch (error: Error | unknown) {
      setAnalyzeFeedbackMessage((error as Error).message);
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
      <div className="content">
        <Container>
          <Header as="h1">
            GPX Analyzer
            <Header.Subheader>Analyze any strava route, splitting by kms</Header.Subheader>
          </Header>
          <Grid stackable>
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
                  <FeedbackMessage
                    error
                    title="Oops... something went wrong"
                    message={analyzeFeedbackMessage}
                  />
                </Grid.Column>
              </Grid.Row>
            )}
            <Grid.Row>
              <Grid.Column>
                {route && !analyzeFeedbackMessage && <RoutePanel route={route} />}
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>
      </div>
      <Segment vertical className="footer">
        <Grid container>
          <Grid.Row columns={2}>
            <Grid.Column floated="left">
              <p>
                <a
                  href="https://github.com/bluelooop/GPX-Analyzer-Web"
                  target="_blank"
                  rel="noreferrer"
                >
                  Github
                </a>
              </p>
            </Grid.Column>
            <Grid.Column floated="right" textAlign="right">
              <p>
                Made with ❤️ by{' '}
                <a href="https://blueloop.io" target="_blank" rel="noreferrer">
                  Blue Loop
                </a>
              </p>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    </div>
  );
};

export default Homepage;
