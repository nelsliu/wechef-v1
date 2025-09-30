import React from 'react';
import type { FieldErrors, UseFormRegister } from 'react-hook-form';

import { Button, Input, Label } from './UI';
import { formatCurrency, safeMul, toNum } from '../lib/number';
import type { RecipeFormValues } from '../lib/validation';

interface IngredientRowProps {
  index: number;
  register: UseFormRegister<RecipeFormValues>;
  onRemove: () => void;
  canRemove: boolean;
  errors?: FieldErrors<RecipeFormValues>;
  watchValues: RecipeFormValues['ingredients'][number];
}

const IngredientRow: React.FC<IngredientRowProps> = ({ index, register, onRemove, canRemove, errors, watchValues }) => {
  const fieldPrefix = `ingredients.${index}` as const;
  const nameField = `${fieldPrefix}.name` as const;
  const categoryField = `${fieldPrefix}.category` as const;
  const unitField = `${fieldPrefix}.unit` as const;
  const quantityField = `${fieldPrefix}.quantity` as const;
  const unitCostField = `${fieldPrefix}.unit_cost` as const;

  const nameError = errors?.ingredients?.[index]?.name?.message;
  const quantityError = errors?.ingredients?.[index]?.quantity?.message;
  const costError = errors?.ingredients?.[index]?.unit_cost?.message;
  const lineCost = safeMul(watchValues?.quantity ?? 0, watchValues?.unit_cost ?? 0);

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-slate-800 bg-slate-900/60 p-4 md:grid md:grid-cols-[2fr_repeat(3,_1fr)_auto] md:items-end">
      <div className="flex flex-col gap-2">
        <Label htmlFor={nameField}>Ingredient</Label>
        <Input id={nameField} placeholder="Chicken thigh" {...register(nameField)} />
        {nameError ? <p className="text-xs text-red-400">{String(nameError)}</p> : null}
      </div>
      <div className="flex flex-col gap-2 md:flex">
        <Label htmlFor={categoryField}>Category</Label>
        <Input id={categoryField} placeholder="Meat" {...register(categoryField)} />
      </div>
      <div className="flex flex-col gap-2 md:flex">
        <Label htmlFor={unitField}>Unit</Label>
        <Input id={unitField} placeholder="kg" {...register(unitField)} />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor={quantityField}>Qty</Label>
        <Input
          id={quantityField}
          type="number"
          step="any"
          min={0}
          {...register(quantityField, { valueAsNumber: true })}
        />
        {quantityError ? <p className="text-xs text-red-400">{String(quantityError)}</p> : null}
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor={unitCostField}>Unit Cost</Label>
        <Input
          id={unitCostField}
          type="number"
          step="any"
          min={0}
          {...register(unitCostField, { valueAsNumber: true })}
        />
        {costError ? <p className="text-xs text-red-400">{String(costError)}</p> : null}
      </div>
      <div className="flex flex-col items-start gap-3 md:items-end">
        <p className="text-sm text-slate-400">Line Cost</p>
        <p className="text-base font-semibold text-slate-100">{formatCurrency(lineCost)}</p>
        <div className="flex gap-2">
          {canRemove ? (
            <Button type="button" variant="ghost" size="sm" onClick={onRemove}>
              Remove
            </Button>
          ) : null}
        </div>
      </div>
      <div className="md:hidden">
        <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-400">
          <span>Total Qty</span>
          <span className="text-right text-slate-200">{toNum(watchValues?.quantity ?? 0)}</span>
          <span>Unit Cost</span>
          <span className="text-right text-slate-200">{formatCurrency(watchValues?.unit_cost ?? 0)}</span>
          <span>Line Cost</span>
          <span className="text-right text-slate-200">{formatCurrency(lineCost)}</span>
        </div>
      </div>
    </div>
  );
};

export default IngredientRow;
