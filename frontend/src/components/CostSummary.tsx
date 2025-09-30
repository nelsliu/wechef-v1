import React from 'react';

import { formatCurrency, safeDiv, safeMul, truncate } from '../lib/number';
import type { RecipeFormValues } from '../lib/validation';

interface CostSummaryProps {
  servings: number;
  ingredients: RecipeFormValues['ingredients'];
}

const CostSummary: React.FC<CostSummaryProps> = ({ servings, ingredients }) => {
  const lineTotals = React.useMemo(
    () => ingredients.map((item) => safeMul(item?.quantity ?? 0, item?.unit_cost ?? 0)),
    [ingredients]
  );

  const totalCost = lineTotals.reduce((sum, value) => sum + value, 0);
  const costPerServing = safeDiv(totalCost, servings || 0);

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">Cost Summary</h3>
      <div className="mt-4 grid gap-2 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-slate-400">Total Cost</span>
          <span className="font-semibold text-slate-100">{formatCurrency(truncate(totalCost))}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-400">Cost per Serving</span>
          <span className="font-semibold text-slate-100">{formatCurrency(truncate(costPerServing))}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-400">Servings</span>
          <span className="font-semibold text-slate-100">{servings || 0}</span>
        </div>
      </div>
    </div>
  );
};

export default CostSummary;
