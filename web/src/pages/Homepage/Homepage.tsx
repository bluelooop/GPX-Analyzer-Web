import RouteForm from '../../components/RouteForm/RouteForm.tsx';
import { Container, Header } from 'semantic-ui-react';
import { useCallback } from 'react';

function Homepage() {

  const onAnalyzeRouteClick = useCallback((routeURL: string, splitBy: number) => {
    return Promise.resolve(true);
  }, []);

  const onVerifyRouteURL = useCallback((routeURL: string) => {
    return Promise.resolve(true);
  }, []);


  return (
    <div className="homepage">
      <Container>
        <header>
          <Header as="h1">GPX Analyzer</Header>
        </header>
        <main>
          <p>
            Welcome to GPX Analyzer!
          </p>
          <RouteForm onVerifyRouteURL={onVerifyRouteURL}
                     onAnalyzeRouteClick={onAnalyzeRouteClick} />
          {/*<RoutePanel />*/}
        </main>
      </Container>
    </div>
  );
}

export default Homepage;