import React from 'react';

import { Button, Table, TableBody, TableCell, TableHeader, TableRow } from '../components/UI';
import { useRecipes } from '../features/recipes/hooks';

interface RecipesPageProps {
  onSelectRecipe: (id: number) => void;
  onCreateNew: () => void;
}

const RecipesPage: React.FC<RecipesPageProps> = ({ onCreateNew, onSelectRecipe }) => {
  const { data, isLoading, isError, refetch } = useRecipes();

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-8">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Recipes</h1>
          <p className="text-sm text-slate-400">Manage your WeChef recipes and keep costing aligned with the kitchen.</p>
        </div>
        <Button onClick={onCreateNew}>New Recipe</Button>
      </header>

      {isLoading ? (
        <section className="flex h-40 items-center justify-center rounded-xl border border-slate-800 bg-slate-900/60">
          <p className="text-sm text-slate-400">Loading recipes…</p>
        </section>
      ) : null}

      {isError ? (
        <section className="flex flex-col items-center justify-center gap-3 rounded-xl border border-red-800 bg-red-950/40 p-6 text-sm text-red-200">
          <p>Could not load recipes.</p>
          <Button variant="secondary" size="sm" onClick={() => refetch()}>
            Try Again
          </Button>
        </section>
      ) : null}

      {!isLoading && !isError ? (
        <Table>
          <TableHeader className="grid-cols-[2fr_1fr_auto]">
            <span>Name</span>
            <span>Updated</span>
            <span className="text-right">Actions</span>
          </TableHeader>
          <TableBody>
            {data && data.length > 0 ? (
              data.map((recipe) => (
                <TableRow key={recipe.id} className="grid-cols-[2fr_1fr_auto]">
                  <TableCell className="font-semibold text-slate-100">{recipe.name}</TableCell>
                  <TableCell className="text-sm text-slate-400">
                    {new Date(recipe.updated_at).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => onSelectRecipe(recipe.id)}>
                      Open
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center gap-2 px-4 py-12 text-center text-sm text-slate-400">
                <p>No recipes yet.</p>
                <Button variant="secondary" size="sm" onClick={onCreateNew}>
                  Create your first recipe
                </Button>
              </div>
            )}
          </TableBody>
        </Table>
      ) : null}
    </main>
  );
};

export default RecipesPage;
