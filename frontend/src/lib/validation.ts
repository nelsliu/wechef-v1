import { z } from 'zod';

export interface IngredientFormValues {
  name: string;
  category?: string;
  unit?: string;
  quantity: number;
  unit_cost: number;
}

export interface RecipeFormValues {
  name: string;
  servings: number;
  ingredients: IngredientFormValues[];
}

const ingredientBaseSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Ingredient name is required'),
  category: z
    .string()
    .trim()
    .optional()
    .transform((val) => (val ? val : undefined)),
  unit: z
    .string()
    .trim()
    .optional()
    .transform((val) => (val ? val : undefined)),
  quantity: z
    .number()
    .min(0, 'Quantity must be greater than or equal to 0'),
  unit_cost: z
    .number()
    .min(0, 'Unit cost must be greater than or equal to 0')
});

const ingredientInputSchema = z.preprocess((value) => {
  if (!value || typeof value !== 'object') {
    return value;
  }

  const raw = value as Record<string, unknown>;

  const name = (raw.name ?? '').toString().trim();
  const category = (raw.category ?? '').toString().trim();
  const unit = (raw.unit ?? '').toString().trim();
  const quantityRaw = Number(raw.quantity ?? 0);
  const unitCostRaw = Number(raw.unit_cost ?? 0);

  const quantity = Number.isFinite(quantityRaw) ? quantityRaw : 0;
  const unit_cost = Number.isFinite(unitCostRaw) ? unitCostRaw : 0;

  const hasValues =
    name.length > 0 ||
    category.length > 0 ||
    unit.length > 0 ||
    quantity !== 0 ||
    unit_cost !== 0;

  if (!hasValues) {
    return undefined;
  }

  return {
    name,
    category: category || undefined,
    unit: unit || undefined,
    quantity,
    unit_cost
  } satisfies z.infer<typeof ingredientBaseSchema>;
}, ingredientBaseSchema.optional());

const ingredientsArraySchema = z
  .array(ingredientInputSchema)
  .transform((items) => items.filter((item): item is NonNullable<typeof item> => Boolean(item)))
  .pipe(z.array(ingredientBaseSchema).min(1, 'Add at least one ingredient'));

export const recipeSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Recipe name is required'),
  servings: z
    .coerce
    .number()
    .int()
    .min(1, 'Servings must be at least 1'),
  ingredients: ingredientsArraySchema
});

export type RecipeInput = z.infer<typeof recipeSchema>;
export type IngredientInput = z.infer<typeof ingredientBaseSchema>;

export const defaultRecipeValues: RecipeFormValues = {
  name: '',
  servings: 1,
  ingredients: [
    {
      name: '',
      category: '',
      unit: '',
      quantity: 0,
      unit_cost: 0
    }
  ]
};
