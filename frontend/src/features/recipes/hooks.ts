import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { api } from '../../lib/api';
import type { Recipe, RecipeListItem, RecipePayload } from './types';

export const recipeKeys = {
  list: ['recipes'] as const,
  detail: (id: number) => ['recipe', id] as const
};

export function useRecipes() {
  return useQuery({
    queryKey: recipeKeys.list,
    queryFn: () => api<RecipeListItem[]>('/recipes')
  });
}

export function useRecipe(id?: number) {
  return useQuery({
    enabled: typeof id === 'number',
    queryKey: typeof id === 'number' ? recipeKeys.detail(id) : ['recipe', 'placeholder'],
    queryFn: async () => {
      if (typeof id !== 'number') {
        throw new Error('Recipe id is required');
      }
      return api<Recipe>(`/recipes/${id}`);
    }
  });
}

export function useCreateRecipe() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: RecipePayload) => api<Recipe>('/recipes', { method: 'POST', json: payload }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: recipeKeys.list });
      queryClient.invalidateQueries({ queryKey: recipeKeys.detail(data.id) });
    }
  });
}

export function useUpdateRecipe() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: RecipePayload }) =>
      api<Recipe>(`/recipes/${id}`, { method: 'PUT', json: payload }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: recipeKeys.list });
      queryClient.invalidateQueries({ queryKey: recipeKeys.detail(data.id) });
    }
  });
}
