# Financial Tracker

A simple and interactive web application designed to help users track their daily expenses, manage transactions, and monitor spending across different categories.

## Features

- **Expense Management:** Add and manage daily expenses.
- **Category-wise Tracking:** Organize expenses into different categories.
- **Expense Visualization:** View spending patterns through an interactive doughnut chart.
- **Transaction History:** Display recorded expenses in a structured table.
- **Database Integration:** Store expense records and categories in MySQL.
- **Responsive Design:** User-friendly interface for different screen sizes.

## Tech Stack

**Frontend:**

- HTML5
- CSS3
- JavaScript
- Chart.js

**Backend:**

- Python
- Flask

**Database:**

- MySQL

## Expense Categories

The application organizes expenses into the following categories:

- Food
- Transport
- Shopping
- Bills
- Health
- Entertainment
- Miscellaneous

## Project Structure

```text
Financial-Tracker/
│
├── app.py
├── requirements.txt
│
├── templates/
│   └── index.html
│
├── static/
│   ├── style.css
│   └── script.js
│
├── database/
│   └── schema.sql
│
└── README.md
```

## Installation and Setup

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd Financial-Tracker
```

### 2. Create a Virtual Environment

```bash
python3 -m venv venv
```

Activate the virtual environment:

**Ubuntu/Linux:**

```bash
source venv/bin/activate
```

**Windows:**

```bash
venv\Scripts\activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure MySQL Database

Create the database in MySQL:

```sql
CREATE DATABASE financial_tracker;
```

Configure your database connection settings in the Flask application.

Make sure the required database tables are created before running the application.

### 5. Run the Application

```bash
python app.py
```

Open your browser and visit:

```text
http://127.0.0.1:5000/
```

## Database Structure

The application uses two main tables:

**Categories**

- category_id
- category_name

**Expenses**

- expense_id
- amount
- category_id
- notes
- expense_date

The `category_id` in the Expenses table references the Categories table through a foreign key relationship.

## Future Improvements

- Monthly and yearly expense reports.
- Budget planning and spending limits.
- User authentication and individual accounts.
- Export transaction history to CSV.
- Improved expense analytics.

## Author

**Vibhu Vats**

- GitHub: [vavi-hub](https://github.com/vavi-hub)
