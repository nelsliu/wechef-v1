import { z } from 'zod';

import { CATEGORY_OPTIONS, UNIT_OPTIONS } from '../features/recipes/constants';

const numericField = z.preprocess(
  (value) => (value === '' || value === null || value === undefined ? 0 : value),
  z.number().nonnegative()
);

export const IngredientZ = z.object({
  name: z.string().min(1, 'Required'),
  category: z
    .enum(CATEGORY_OPTIONS)
    .optional()
    .nullable()
    .transform((value) => value ?? undefined),
  unit: z
    .enum(UNIT_OPTIONS)
    .optional()
    .nullable()
    .transform((value) => value ?? undefined),
  purchase_cost: numericField,
  purchase_qty: numericField,
  unit_cost: numericField,
  quantity: numericField
});

export const recipeSchema = z.object({
  name: z.string().trim().min(1, 'Recipe name is required'),
  servings: z.coerce.number().int().min(1, 'Servings must be at least 1'),
  ingredients: z
    .array(IngredientZ)
    .transform((items) =>
      items.filter((item) =>
        Boolean(
          item?.name ||
            item?.category ||
            item?.unit ||
            (item?.quantity ?? 0) !== 0 ||
            (item?.unit_cost ?? 0) !== 0 ||
            (item?.purchase_cost ?? 0) !== 0 ||
            (item?.purchase_qty ?? 0) !== 0
        )
      )
    )
    .refine((items) => items.length > 0, 'Add at least one ingredient')
});

export type RecipeInput = z.infer<typeof recipeSchema>;
export type IngredientInput = z.infer<typeof IngredientZ>;

export interface IngredientFormValues extends IngredientInput {}
export interface RecipeFormValues {
  name: string;
  servings: number;
  ingredients: IngredientFormValues[];
}

export const defaultRecipeValues: RecipeFormValues = {
  name: '',
  servings: 1,
  ingredients: [
    {
      name: '',
      category: undefined,
      unit: undefined,
      purchase_cost: 0,
      purchase_qty: 0,
      unit_cost: 0,
      quantity: 0
    }
  ]
};
