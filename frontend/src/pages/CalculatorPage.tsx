import React from 'react';

import RecipeForm from '../components/RecipeForm';
import { Button, useToast } from '../components/UI';
import { useCreateRecipe, useRecipe, useUpdateRecipe } from '../features/recipes/hooks';
import type { Recipe } from '../features/recipes/types';
import type { RecipeFormValues, RecipeInput } from '../lib/validation';

interface CalculatorPageProps {
  recipeId?: number;
  onNavigateHome: () => void;
}

const convertToFormValues = (recipe?: Recipe): RecipeFormValues => ({
  name: recipe?.name ?? '',
  servings: recipe?.servings ?? 1,
  ingredients:
    recipe?.ingredients.map((ingredient) => ({
      name: ingredient.name ?? '',
      category: ingredient.category ?? '',
      unit: ingredient.unit ?? '',
      quantity: ingredient.quantity ?? 0,
      unit_cost: ingredient.unit_cost ?? 0
    })) ?? []
});

const CalculatorPage: React.FC<CalculatorPageProps> = ({ recipeId, onNavigateHome }) => {
  const createRecipe = useCreateRecipe();
  const updateRecipe = useUpdateRecipe();
  const recipeQuery = useRecipe(recipeId);
  const { toast } = useToast();

  const formValues = React.useMemo(() => {
    if (!recipeId) {
      return undefined;
    }
    if (!recipeQuery.data) {
      return undefined;
    }
    return convertToFormValues(recipeQuery.data);
  }, [recipeId, recipeQuery.data]);

  const isSaving = createRecipe.isPending || updateRecipe.isPending;

  const handleSubmit = React.useCallback(
    async (values: RecipeInput) => {
      try {
        if (recipeId) {
          await updateRecipe.mutateAsync({ id: recipeId, payload: values });
          toast({ title: 'Recipe updated', variant: 'success' });
        } else {
          await createRecipe.mutateAsync(values);
          toast({ title: 'Recipe created', variant: 'success' });
        }
        onNavigateHome();
      } catch (error) {
        console.error(error);
        toast({
          title: 'Something went wrong',
          description: error instanceof Error ? error.message : 'Unable to save recipe',
          variant: 'error'
        });
      }
    },
    [createRecipe, onNavigateHome, recipeId, toast, updateRecipe]
  );

  const pageTitle = recipeId ? 'Edit Recipe' : 'New Recipe';

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">{pageTitle}</h1>
          <p className="text-sm text-slate-400">Cost recipes quickly and keep your team aligned.</p>
        </div>
        <Button variant="ghost" onClick={onNavigateHome}>
          Back
        </Button>
      </header>

      {recipeId && recipeQuery.isLoading ? (
        <section className="flex h-40 items-center justify-center rounded-xl border border-slate-800 bg-slate-900/60">
          <p className="text-sm text-slate-400">Loading recipe…</p>
        </section>
      ) : null}

      {recipeId && recipeQuery.isError ? (
        <section className="flex flex-col items-center justify-center gap-3 rounded-xl border border-red-800 bg-red-950/40 p-6 text-sm text-red-200">
          <p>Could not load the recipe. It may have been removed.</p>
          <Button variant="secondary" size="sm" onClick={onNavigateHome}>
            Back to Recipes
          </Button>
        </section>
      ) : null}

      {(!recipeId || recipeQuery.data) && !recipeQuery.isError ? (
        <RecipeForm
          initialValues={formValues}
          onSubmit={handleSubmit}
          onCancel={onNavigateHome}
          isSaving={isSaving}
        />
      ) : null}
    </main>
  );
};

export default CalculatorPage;
