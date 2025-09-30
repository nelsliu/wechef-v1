import React from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import IngredientRow from './IngredientRow';
import CostSummary from './CostSummary';
import { Button, Input, Label } from './UI';
import {
  defaultRecipeValues,
  recipeSchema,
  type RecipeFormValues,
  type RecipeInput
} from '../lib/validation';

interface RecipeFormProps {
  initialValues?: RecipeFormValues;
  onSubmit: (values: RecipeInput) => Promise<void> | void;
  onCancel?: () => void;
  isSaving?: boolean;
}

const emptyIngredient: RecipeFormValues['ingredients'][number] = {
  name: '',
  category: '',
  unit: '',
  quantity: 0,
  unit_cost: 0
};

const RecipeForm: React.FC<RecipeFormProps> = ({ initialValues, onSubmit, onCancel, isSaving }) => {
  const form = useForm<RecipeFormValues, undefined, RecipeInput>({
    resolver: zodResolver(recipeSchema),
    defaultValues: initialValues ?? defaultRecipeValues,
    mode: 'onBlur'
  });

  const { control, register, handleSubmit, formState, reset, watch } = form;

  const fieldArray = useFieldArray({
    control,
    name: 'ingredients'
  });

  React.useEffect(() => {
    if (initialValues) {
      reset(initialValues);
    } else {
      reset(defaultRecipeValues);
    }
  }, [initialValues, reset]);

  React.useEffect(() => {
    if (fieldArray.fields.length === 0) {
      fieldArray.append(emptyIngredient);
    }
  }, [fieldArray]);

  const ingredients = watch('ingredients');
  const servings = watch('servings');

  const submitHandler = handleSubmit(async (values) => {
    await onSubmit(values);
  });

  const ingredientErrors = formState.errors.ingredients;
  const rootIngredientError =
    ingredientErrors && typeof ingredientErrors === 'object' && 'root' in ingredientErrors
      ? (ingredientErrors as { root?: { message?: string } }).root?.message
      : undefined;
  const hasIngredientFieldErrors = Array.isArray(ingredientErrors)
    ? ingredientErrors.some((error) => Boolean(error && Object.keys(error).length))
    : false;

  return (
    <form className="flex flex-col gap-6" onSubmit={submitHandler}>
      <section className="grid gap-4 md:grid-cols-[2fr_1fr] md:items-end">
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">Recipe Name</Label>
          <Input id="name" placeholder="Beef Pho" {...register('name')} />
          {formState.errors.name ? (
            <p className="text-xs text-red-400">{formState.errors.name.message}</p>
          ) : null}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="servings">Servings</Label>
          <Input id="servings" type="number" min={1} {...register('servings', { valueAsNumber: true })} />
          {formState.errors.servings ? (
            <p className="text-xs text-red-400">{formState.errors.servings.message}</p>
          ) : null}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-100">Ingredients</h2>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => fieldArray.append(emptyIngredient)}
          >
            Add Ingredient
          </Button>
        </div>
        <div className="flex flex-col gap-4">
          {fieldArray.fields.map((field, index) => (
            <IngredientRow
              key={field.id}
              index={index}
              register={register}
              watchValues={ingredients?.[index] ?? emptyIngredient}
              onRemove={() => fieldArray.remove(index)}
              canRemove={fieldArray.fields.length > 1}
              errors={formState.errors}
            />
          ))}
        </div>
        {rootIngredientError ? (
          <p className="text-xs text-red-400">{rootIngredientError}</p>
        ) : null}
        {hasIngredientFieldErrors ? (
          <p className="text-xs text-red-400">Please review ingredient errors above.</p>
        ) : null}
      </section>

      <CostSummary servings={servings ?? 0} ingredients={ingredients ?? []} />

      <div className="flex flex-col gap-3 md:flex-row md:justify-end">
        {onCancel ? (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Back to Recipes
          </Button>
        ) : null}
        <Button type="submit" disabled={formState.isSubmitting || isSaving}>
          {isSaving ? 'Saving…' : 'Save Recipe'}
        </Button>
      </div>
    </form>
  );
};

export default RecipeForm;
