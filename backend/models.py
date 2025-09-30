from datetime import datetime

from db import db


class Recipe(db.Model):
    __tablename__ = "recipes"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    servings = db.Column(db.Integer, nullable=False, default=1)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(
        db.DateTime,
        nullable=False,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
    )

    ingredients = db.relationship(
        "Ingredient",
        back_populates="recipe",
        cascade="all, delete-orphan",
        order_by="Ingredient.id",
    )


class Ingredient(db.Model):
    __tablename__ = "ingredients"

    id = db.Column(db.Integer, primary_key=True)
    recipe_id = db.Column(
        db.Integer,
        db.ForeignKey("recipes.id", ondelete="CASCADE"),
        nullable=False,
    )
    name = db.Column(db.String(255), nullable=False)
    category = db.Column(db.String(100))
    unit = db.Column(db.String(50))
    quantity = db.Column(db.Float, nullable=False, default=0.0)
    unit_cost = db.Column(db.Float, nullable=False, default=0.0)

    recipe = db.relationship("Recipe", back_populates="ingredients")
