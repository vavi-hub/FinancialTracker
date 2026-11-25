from flask import Flask
from config import Config
from extensions import db


def create_app():

    app = Flask(__name__)

    # Load configuration
    app.config.from_object(Config)

    # Initialize database
    db.init_app(app)

    # Register routes
    from routes import expenses_bp
    app.register_blueprint(expenses_bp)

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)