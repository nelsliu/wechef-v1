import React from 'react';
import type {
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
  UseFormUnregister
} from 'react-hook-form';

import { Button, Input, Label } from './UI';
import { formatCurrency, safeDiv, safeMul, to2, toNum } from '../lib/number';
import type { RecipeFormValues } from '../lib/validation';
import { CATEGORY_OPTIONS, UNIT_OPTIONS } from '../features/recipes/constants';

interface IngredientRowProps {
  index: number;
  register: UseFormRegister<RecipeFormValues>;
  unregister: UseFormUnregister<RecipeFormValues>;
  setValue: UseFormSetValue<RecipeFormValues>;
  onRemove: () => void;
  canRemove: boolean;
  errors?: FieldErrors<RecipeFormValues>;
  watchValues: RecipeFormValues['ingredients'][number];
}

const IngredientRow: React.FC<IngredientRowProps> = ({
  index,
  register,
  unregister,
  setValue,
  onRemove,
  canRemove,
  errors,
  watchValues
}) => {
  const fieldPrefix = `ingredients.${index}` as const;
  const nameField = `${fieldPrefix}.name` as const;
  const categoryField = `${fieldPrefix}.category` as const;
  const unitField = `${fieldPrefix}.unit` as const;
  const purchaseCostField = `${fieldPrefix}.purchase_cost` as const;
  const purchaseQtyField = `${fieldPrefix}.purchase_qty` as const;
  const quantityField = `${fieldPrefix}.quantity` as const;
  const unitCostField = `${fieldPrefix}.unit_cost` as const;

  const nameError = errors?.ingredients?.[index]?.name?.message;
  const categoryError = errors?.ingredients?.[index]?.category?.message;
  const purchaseCostError = errors?.ingredients?.[index]?.purchase_cost?.message;
  const purchaseQtyError = errors?.ingredients?.[index]?.purchase_qty?.message;
  const quantityError = errors?.ingredients?.[index]?.quantity?.message;
  const unitCostError = errors?.ingredients?.[index]?.unit_cost?.message;
  const unitError = errors?.ingredients?.[index]?.unit?.message;

  const purchaseCost = watchValues?.purchase_cost ?? 0;
  const purchaseQty = watchValues?.purchase_qty ?? 0;
  const fallbackUnitCost = watchValues?.unit_cost ?? 0;
  const derivedUnitCost = purchaseQty > 0 ? safeDiv(purchaseCost, purchaseQty) : fallbackUnitCost;
  const lineCost = safeMul(watchValues?.quantity ?? 0, derivedUnitCost);

  React.useEffect(() => {
    register(unitCostField, { valueAsNumber: true });
    return () => unregister(unitCostField);
  }, [register, unregister, unitCostField]);

  React.useEffect(() => {
    const isDifferent = Math.abs((watchValues?.unit_cost ?? 0) - derivedUnitCost) > 1e-9;
    setValue(unitCostField, derivedUnitCost, {
      shouldDirty: isDifferent,
      shouldValidate: false
    });
  }, [derivedUnitCost, setValue, unitCostField, watchValues?.unit_cost]);

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-slate-800 bg-slate-900/60 p-4 md:grid md:grid-cols-[2fr_repeat(6,_1fr)_auto] md:items-end">
      <div className="flex flex-col gap-2">
        <Label htmlFor={nameField}>Ingredients</Label>
        <Input id={nameField} placeholder="Chicken thigh" {...register(nameField)} />
        {nameError ? <p className="text-xs text-red-400">{String(nameError)}</p> : null}
      </div>
      <div className="flex flex-col gap-2 md:flex">
        <Label htmlFor={categoryField}>Category</Label>
        <select
          id={categoryField}
          className="h-10 w-full rounded-md border border-border bg-slate-950 px-3 text-sm text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          {...register(categoryField)}
        >
          <option value="">Select…</option>
          {CATEGORY_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {categoryError ? <p className="text-xs text-red-400">{String(categoryError)}</p> : null}
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor={purchaseCostField}>Purchase Cost ($)</Label>
        <Input
          id={purchaseCostField}
          type="number"
          step="any"
          min={0}
          {...register(purchaseCostField, { valueAsNumber: true })}
        />
        {purchaseCostError ? <p className="text-xs text-red-400">{String(purchaseCostError)}</p> : null}
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor={purchaseQtyField}>Purchase Qty</Label>
        <Input
          id={purchaseQtyField}
          type="number"
          step="any"
          min={0}
          {...register(purchaseQtyField, { valueAsNumber: true })}
        />
        {purchaseQtyError ? <p className="text-xs text-red-400">{String(purchaseQtyError)}</p> : null}
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor={quantityField}>Qty per Serving</Label>
        <Input
          id={quantityField}
          type="number"
          step="any"
          min={0}
          {...register(quantityField, { valueAsNumber: true })}
        />
        {quantityError ? <p className="text-xs text-red-400">{String(quantityError)}</p> : null}
      </div>
      <div className="flex flex-col gap-2 md:flex">
        <Label htmlFor={unitField}>Unit</Label>
        <select
          id={unitField}
          className="h-10 w-full rounded-md border border-border bg-slate-950 px-3 text-sm text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          {...register(unitField)}
        >
          <option value="">Select…</option>
          {UNIT_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {unitError ? <p className="text-xs text-red-400">{String(unitError)}</p> : null}
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor={unitCostField}>Unit Cost</Label>
        <Input id={unitCostField} value={to2(derivedUnitCost)} readOnly className="bg-slate-950/70" />
        {unitCostError ? <p className="text-xs text-red-400">{String(unitCostError)}</p> : null}
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
          <span className="text-right text-slate-200">{formatCurrency(derivedUnitCost)}</span>
          <span>Line Cost</span>
          <span className="text-right text-slate-200">{formatCurrency(lineCost)}</span>
        </div>
      </div>
    </div>
  );
};

export default IngredientRow;
