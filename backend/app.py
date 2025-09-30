from datetime import datetime
import os

from dotenv import load_dotenv
from flask import Flask, abort, jsonify, request
from flask_cors import CORS
from pydantic import ValidationError
from sqlalchemy.exc import SQLAlchemyError

from db import db, init_db
from models import Ingredient, Recipe
from schemas import RecipeIn, RecipeListItem, RecipeOut


def create_app() -> Flask:
    """Application factory for the WeChef backend."""
    load_dotenv()

    app = Flask(__name__)

    database_url = os.getenv("DATABASE_URL", "sqlite:///wechef.db")
    app.config["SQLALCHEMY_DATABASE_URI"] = database_url
    app.config.setdefault("SQLALCHEMY_TRACK_MODIFICATIONS", False)
    app.config["MAX_CONTENT_LENGTH"] = 2 * 1024 * 1024

    init_db(app)

    with app.app_context():
        db.create_all()

    frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
    CORS(app, resources={r"/*": {"origins": [frontend_url]}})

    @app.route("/health", methods=["GET"])
    def health() -> tuple[dict[str, str], int]:
        return {"status": "ok"}, 200

    @app.route("/recipes", methods=["GET"])
    def list_recipes():
        recipes = Recipe.query.order_by(Recipe.updated_at.desc()).all()
        data = [
            RecipeListItem.model_validate(recipe, from_attributes=True).model_dump()
            for recipe in recipes
        ]
        return jsonify(data)

    @app.route("/recipes", methods=["POST"])
    def create_recipe():
        try:
            payload = request.get_json(force=True) or {}
            recipe_in = RecipeIn(**payload)
        except (TypeError, ValidationError, ValueError) as exc:
            return jsonify({"error": str(exc)}), 400

        try:
            with db.session.begin():
                recipe = Recipe(name=recipe_in.name, servings=recipe_in.servings)

                for ingredient in recipe_in.ingredients:
                    recipe.ingredients.append(
                        Ingredient(
                            name=ingredient.name,
                            category=ingredient.category,
                            unit=ingredient.unit,
                            quantity=ingredient.quantity,
                            unit_cost=ingredient.unit_cost,
                        )
                    )

                db.session.add(recipe)

            db.session.refresh(recipe)
            data = RecipeOut.model_validate(recipe, from_attributes=True).model_dump()
            return jsonify(data), 201
        except SQLAlchemyError as exc:
            db.session.rollback()
            return jsonify({"error": str(exc)}), 400

    @app.route("/recipes/<int:recipe_id>", methods=["GET"])
    def get_recipe(recipe_id: int):
        recipe = Recipe.query.get_or_404(recipe_id)
        data = RecipeOut.model_validate(recipe, from_attributes=True).model_dump()
        return jsonify(data)

    @app.put("/recipes/<int:rid>")
    def update_recipe(rid: int):
        try:
            payload = request.get_json(force=True) or {}
            recipe_in = RecipeIn(**payload)

            with db.session.begin():
                recipe = db.session.get(Recipe, rid)
                if recipe is None:
                    abort(404, description="Recipe not found")

                recipe.name = recipe_in.name
                recipe.servings = recipe_in.servings
                recipe.updated_at = datetime.utcnow()

                recipe.ingredients.clear()
                for ing in recipe_in.ingredients:
                    recipe.ingredients.append(
                        Ingredient(
                            name=ing.name,
                            category=ing.category,
                            unit=ing.unit,
                            quantity=ing.quantity,
                            unit_cost=ing.unit_cost,
                        )
                    )

            db.session.refresh(recipe)
            out = RecipeOut.model_validate(recipe, from_attributes=True)
            return jsonify(out.model_dump()), 200

        except (ValueError, ValidationError, SQLAlchemyError) as e:
            db.session.rollback()
            return jsonify({"error": str(e)}), 400

    return app


app = create_app()


if __name__ == "__main__":
    app.run(debug=app.config.get("ENV") == "development")
