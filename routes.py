from flask import Blueprint, render_template, request, jsonify
from extensions import db
from models import Expense, Category

expenses_bp = Blueprint("expenses", __name__)


@expenses_bp.route("/")
def home():
    return render_template("index.html")


# Fetch all expenses
@expenses_bp.route("/api/expenses", methods=["GET"])
def get_expenses():

    expenses = Expense.query.order_by(
        Expense.expense_date.desc()
    ).all()

    result = []

    for expense in expenses:

        result.append({
            "expense_id": expense.expense_id,
            "amount": float(expense.amount),
            "category_id": expense.category_id,
            "category": expense.category.category_name,
            "notes": expense.notes,
            "expense_date": expense.expense_date.strftime(
                "%d %b %Y %I:%M %p"
            )
        })

    return jsonify(result)


# Add new expense
@expenses_bp.route("/api/expenses", methods=["POST"])
def add_expense():

    data = request.get_json(silent=True) or {}

    amount = data.get("amount")
    category_id = data.get("category_id")
    notes = (data.get("notes") or "").strip()

    try:
        amount = float(amount)
        category_id = int(category_id)
    except (TypeError, ValueError):
        return jsonify({"error": "Invalid amount or category"}), 400

    if amount <= 0:
        return jsonify({"error": "Amount must be greater than zero"}), 400

    category = db.session.get(Category, category_id)

    if not category:
        return jsonify({"error": "Category not found"}), 404

    expense = Expense(
        amount=amount,
        category_id=category_id,
        notes=notes
    )

    db.session.add(expense)
    db.session.commit()

    return jsonify({
        "message": "Expense added successfully",
        "expense_id": expense.expense_id
    }), 201


# Delete expense
@expenses_bp.route("/api/expenses/<int:expense_id>", methods=["DELETE"])
def delete_expense(expense_id):

    expense = db.session.get(Expense, expense_id)

    if not expense:
        return jsonify({"error": "Expense not found"}), 404

    db.session.delete(expense)
    db.session.commit()

    return jsonify({"message": "Expense deleted successfully"})

# Update an existing expense
@expenses_bp.route("/api/expenses/<int:expense_id>", methods=["PUT"])
def update_expense(expense_id):

    expense = db.session.get(Expense, expense_id)

    if not expense:
        return jsonify({"error": "Expense not found"}), 404

    data = request.get_json(silent=True) or {}

    try:
        amount = float(data.get("amount"))
        category_id = int(data.get("category_id"))
    except (TypeError, ValueError):
        return jsonify({"error": "Invalid amount or category"}), 400

    if amount <= 0:
        return jsonify({"error": "Amount must be greater than zero"}), 400

    category = db.session.get(Category, category_id)

    if not category:
        return jsonify({"error": "Category not found"}), 404

    expense.amount = amount
    expense.category_id = category_id
    expense.notes = (data.get("notes") or "").strip()

    db.session.commit()

    return jsonify({
        "message": "Expense updated successfully"
    }), 200