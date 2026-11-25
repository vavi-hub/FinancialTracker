import os

class Config:

    SQLALCHEMY_DATABASE_URI = os.environ.get(
        "DATABASE_URL"
    ) or "mysql+pymysql://flask_user:YOURPASSWORD@localhost/financial_tracker"

    SQLALCHEMY_TRACK_MODIFICATIONS = False

    SECRET_KEY = os.environ.get("SECRET_KEY") or "dev-key-change-in-production"
