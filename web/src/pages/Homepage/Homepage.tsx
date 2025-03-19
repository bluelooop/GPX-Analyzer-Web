import RouteForm from '../../components/RouteForm/RouteForm.tsx';
import { Container, Header } from 'semantic-ui-react';
import { useCallback, useState } from 'react';

function Homepage() {
  const [analyzing, setAnalyzing] = useState(false);
  const [verifyingRouteURL, setVerifyingRouteURL] = useState(false);
  const [routeURL, setRouteURL] = useState<string>();
  const [splitBy, setSplitBy] = useState<number>();


  const onAnalyzeRouteClick = useCallback((routeURL: string, splitBy: number) => {
    setAnalyzing(true);
    return Promise.resolve(true);
  }, []);

  const onVerifyRouteURL = useCallback((routeURL: string) => {
    setVerifyingRouteURL(true);
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
          <RouteForm analyzing={analyzing}
                     verifyingRouteURL={verifyingRouteURL}
                     onVerifyRouteURL={onVerifyRouteURL}
                     onAnalyzeRouteClick={onAnalyzeRouteClick} />
          {/*<RoutePanel />*/}
        </main>
      </Container>
    </div>
  );
}

export default Homepage;