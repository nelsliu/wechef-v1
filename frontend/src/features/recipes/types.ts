import type { RecipeInput } from '../../lib/validation';

export interface Ingredient {
  id: number;
  name: string;
  category?: string;
  unit?: string;
  quantity: number;
  unit_cost: number;
}

export interface Recipe {
  id: number;
  name: string;
  servings: number;
  ingredients: Ingredient[];
  created_at: string;
  updated_at: string;
}

export interface RecipeListItem {
  id: number;
  name: string;
  updated_at: string;
}

export type RecipePayload = RecipeInput;
