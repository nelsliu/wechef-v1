# WeChef Backend

Flask-based API for the WeChef project.

## Prerequisites
- Python 3.9+
- `pip`

## Local Setup
1. Change into the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python3 -m venv .venv
   source .venv/bin/activate
   ```
   On Windows PowerShell:
   ```powershell
   python -m venv .venv
   .venv\Scripts\Activate.ps1
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. (Optional) copy the environment template:
   ```bash
   cp .env.example .env
   ```
5. Start the development server:
   ```bash
   flask run
   ```

The app auto-creates its SQLite tables on startup. Default database location is `wechef.db` in this directory.

## API Overview
- `GET /health` – service health check (`{"status": "ok"}`)
- `GET /recipes` – list recipes with `id`, `name`, and `updated_at`
- `POST /recipes` – create a recipe with ingredients
- `GET /recipes/<id>` – fetch a full recipe record
- `PUT /recipes/<id>` – replace an existing recipe and its ingredient list

### Example Payload
```json
{
  "name": "Chicken Katsu",
  "servings": 10,
  "ingredients": [
    {
      "name": "Chicken thigh",
      "category": "meat",
      "unit": "kg",
      "quantity": 1.2,
      "unit_cost": 120000
    }
  ]
}
```

### Sample Requests
List recipes:
```bash
curl http://127.0.0.1:5000/recipes
```

Create a recipe:
```bash
curl -X POST http://127.0.0.1:5000/recipes \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "Chicken Katsu",
    "servings": 10,
    "ingredients": [
      {
        "name": "Chicken thigh",
        "category": "meat",
        "unit": "kg",
        "quantity": 1.2,
        "unit_cost": 120000
      }
    ]
  }'
```

Update a recipe:
```bash
curl -X PUT http://127.0.0.1:5000/recipes/1 \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "Chicken Katsu Deluxe",
    "servings": 12,
    "ingredients": [
      {
        "name": "Chicken thigh",
        "category": "meat",
        "unit": "kg",
        "quantity": 1.5,
        "unit_cost": 120000
      }
    ]
  }'
```
