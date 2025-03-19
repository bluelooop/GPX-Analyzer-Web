import RouteForm from '../../components/RouteForm/RouteForm.tsx';
import RouteData from '../../components/RouteData/RouteData.tsx';

function Homepage() {
  return (
    <div className="homepage">
      <header>
        <h1>GPX Analyzer</h1>
      </header>
      <main>
        <p>
          Welcome to GPX Analyzer!
        </p>
        <RouteForm />
        <RouteData />
      </main>
    </div>
  );
}

export default Homepage;