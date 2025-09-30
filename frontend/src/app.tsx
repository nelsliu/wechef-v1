import React from 'react';

import CalculatorPage from './pages/CalculatorPage';
import RecipesPage from './pages/RecipesPage';

interface LocationState {
  pathname: string;
  search: string;
  searchParams: URLSearchParams;
}

const getLocationState = (): LocationState => {
  return {
    pathname: window.location.pathname,
    search: window.location.search,
    searchParams: new URLSearchParams(window.location.search)
  };
};

const navigate = (path: string) => {
  window.history.pushState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
};

const useLocationState = (): LocationState => {
  const [state, setState] = React.useState<LocationState>(() => getLocationState());

  React.useEffect(() => {
    const handleLocationChange = () => {
      setState(getLocationState());
    };

    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  return state;
};

const App: React.FC = () => {
  const location = useLocationState();

  const goToRecipes = React.useCallback(() => navigate('/'), []);
  const goToCalculator = React.useCallback((id?: number) => {
    const path = id ? `/calculator?id=${id}` : '/calculator';
    navigate(path);
  }, []);

  if (location.pathname === '/calculator') {
    const idParam = location.searchParams.get('id');
    const recipeId = idParam ? Number(idParam) : undefined;

    return (
      <CalculatorPage
        recipeId={Number.isFinite(recipeId) ? recipeId : undefined}
        onNavigateHome={goToRecipes}
      />
    );
  }

  return (
    <RecipesPage
      onCreateNew={() => goToCalculator()}
      onSelectRecipe={(id) => goToCalculator(id)}
    />
  );
};

export default App;
