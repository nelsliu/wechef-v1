from flask_sqlalchemy import SQLAlchemy

# Global database instance used across the app once initialized.
db = SQLAlchemy()


def init_db(app) -> None:
    """Bind the SQLAlchemy instance to the Flask application."""
    db.init_app(app)
