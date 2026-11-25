from extensions import db
from datetime import datetime


class Category(db.Model):

    __tablename__ = "categories"

    category_id = db.Column(
        db.Integer,
        primary_key=True
    )

    category_name = db.Column(
        db.String(50),
        unique=True,
        nullable=False
    )

    expenses = db.relationship(
        "Expense",
        backref="category",
        lazy=True
    )


class Expense(db.Model):

    __tablename__ = "expenses"

    expense_id = db.Column(
        db.Integer,
        primary_key=True
    )

    amount = db.Column(
        db.Numeric(10, 2),
        nullable=False
    )

    category_id = db.Column(
        db.Integer,
        db.ForeignKey("categories.category_id"),
        nullable=False
    )

    notes = db.Column(db.String(255))

    expense_date = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )