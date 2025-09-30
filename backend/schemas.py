from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, field_serializer, field_validator


class IngredientIn(BaseModel):
    name: str
    category: Optional[str] = None
    unit: Optional[str] = None
    quantity: float = 0
    unit_cost: float = 0

    @field_validator("name")
    @classmethod
    def _name_ok(cls, v: str) -> str:
        v = (v or "").strip()
        if not v:
            raise ValueError("Name cannot be empty")
        return v[:255]


class IngredientOut(IngredientIn):
    id: int

    model_config = {"from_attributes": True}


class RecipeIn(BaseModel):
    name: str
    servings: int = 1
    ingredients: List[IngredientIn] = []


class RecipeOut(BaseModel):
    id: int
    name: str
    servings: int
    ingredients: List[IngredientOut]
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}

    @field_serializer("created_at", "updated_at")
    def _ser_dt(self, dt: datetime) -> str:
        return dt.isoformat()


class RecipeListItem(BaseModel):
    id: int
    name: str
    updated_at: datetime

    model_config = {"from_attributes": True}

    @field_serializer("updated_at")
    def _ser_updated(self, dt: datetime) -> str:
        return dt.isoformat()
