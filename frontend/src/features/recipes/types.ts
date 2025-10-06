import type { RecipeInput } from '../../lib/validation';
import { CATEGORY_OPTIONS, UNIT_OPTIONS } from './constants';

export type Category = (typeof CATEGORY_OPTIONS)[number];
export type Unit = (typeof UNIT_OPTIONS)[number];

export interface Ingredient {
  id: number;
  name: string;
  category?: Category;
  unit?: Unit;
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
