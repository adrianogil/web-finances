from datetime import datetime, timedelta
import requests
import random
import time
import json

backend_url = "http://localhost:3000"

initial_date = "2021-01-01"
final_date = "2025-12-31"

# Parse the initial and final dates
start_date = datetime.strptime(initial_date, "%Y-%m-%d")
end_date = datetime.strptime(final_date, "%Y-%m-%d")

# Constants for inflation and adjustments
IPCA = 0.06  # Annual inflation rate for rent
starting_salary = 3000
salary_percent_increase_each_year = 0.05


def request_get(url, query_params=None, bearer_token=None, is_response_json=True, raise_for_status=True, headers={}):
    """
    Send a GET request to the specified URL with optional query parameters and bearer token authorization.

    :param url: The URL to send the GET request to
    :param query_params: A dictionary of query parameters to include in the request
    :param bearer_token: A bearer token for authorization (optional)
    :return: The JSON response from the server
    """
    if not headers:
        headers = {}
    headers["Content-Type"] = "application/json"

    if bearer_token:
        headers["Authorization"] = "Bearer " + bearer_token

    start_time = time.time()  # Record the start time

    try:
        response = requests.get(url, headers=headers, params=query_params)
        if raise_for_status:
            response.raise_for_status()  # Check if the request was successful
    except requests.RequestException as e:
        print(f"Request error: {e}")
        return None
    finally:
        end_time = time.time()  # Record the end time
        elapsed_time = end_time - start_time  # Calculate the total time taken
        print(f"Total time taken for the request: {elapsed_time:.2f} seconds")

    if is_response_json:
        try:
            response_data = response.json()  # Parse JSON response directly
        except json.JSONDecodeError as e:
            print(f"Error decoding JSON response: {e}")
            return None
    else:
        response_data = {
            "status_code": response.status_code,
            "response": response.text
        }

    print(f"Response status code: {response.status_code}")
    print(f"Response content: {response_data}")

    return response_data


def request_post(url, payload, bearer_token=None, api_token=None):
    # Set the content type header to JSON
    headers = {
        "Content-Type": "application/json"
    }
    if bearer_token:
        headers["Authorization"] = "Bearer " + bearer_token

    if api_token:
      for api_key in api_token:
            headers[api_key] = api_token[api_key]

    # Send the POST request with the JSON payload in the request body
    response = requests.post(url, data=json.dumps(payload), headers=headers)

    # Print the response status code and content
    print("Response status code:", response.status_code)
    print("Response content:", response.content)

    response_data = response.content
    response_data = response_data.decode("utf-8")

    response_json = json.loads(response_data)

    return response_json


def create_user(user_email="teste@email.com", password="jyw7axj8zfz3huj.PBU"):
    user_data = {
        "full_name": "João da Silva",
        "email": user_email,
        "password": password
    }
    response = request_post(url=f"{backend_url}/api/auth/register", payload=user_data)
    print(response)


def login(user_email="teste@email.com", password="jyw7axj8zfz3huj.PBU"):
    ## Login
    user_data = {
        "email": user_email,
        "password": password
    }
    response = request_post(url=f"{backend_url}/api/auth/login", payload=user_data)
    print(response)
    token = response["token"]
    return token

def create_account(token, account_name, account_type="Conta Corrente", balance=0):
    account_data = {
        "name": account_name,
        "type": account_type,
        "balance": 0
    }
    response = request_post(url=f"{backend_url}/api/accounts", payload=account_data, bearer_token=token)
    print(response)

def create_category(token, category_name):
    category_data = {
        "name": category_name
    }
    response = request_post(url=f"{backend_url}/api/categories", payload=category_data, bearer_token=token)
    print(response)

def create_transaction(token, account="", category="", amount=0, date="", description="", type=""):
    transaction_data = {
        "account": account,
        "category": category,
        "amount": amount,
        "date": date,
        "description": description,
        "type": type
    }
    response = request_post(url=f"{backend_url}/api/financial-records", payload=transaction_data, bearer_token=token)
    print(response)

# Define the generate_random_transaction function
def generate_random_transaction(token, current_date_str, current_balance):
    print(f"Generating transaction for {current_date_str}")
    current_date = datetime.strptime(current_date_str, "%Y-%m-%d")
    years_since_start = current_date.year - start_date.year

    transactions = []

    # First day of the month: generate salary
    if current_date.day == 1:
        current_salary = starting_salary * ((1 + salary_percent_increase_each_year) ** years_since_start)
        transactions.append({
            "account": "Conta Corrente",
            "category": "Salário",  # Salário
            "amount": current_salary,
            "date": current_date_str,
            "description": "Salário",
            "type": "Receita"
        })
        current_balance += current_salary

    # Rent (increased by IPCA each year)
    if current_date.day == 5:
        base_rent = 1200
        current_rent = base_rent * ((1 + IPCA) ** years_since_start)
        transactions.append({
            "account": "Conta Corrente",
            "category": "Moradia",  # Moradia
            "amount": -current_rent,
            "date": current_date_str,
            "description": "Aluguel",
            "type": "Despesa"
        })
        current_balance -= current_rent

    # Weekly groceries
    if current_date.weekday() == 5:  # Saturday
        groceries_spending = random.uniform(200, 400)
        transactions.append({
            "account": "Conta Corrente",
            "category": "Alimentação",  # Alimentação
            "amount": -groceries_spending,
            "date": current_date_str,
            "description": "Compras de mercado",
            "type": "Despesa"
        })
        current_balance -= groceries_spending

    # Transportation (daily for workdays)
    if current_date.weekday() < 5:  # Monday to Friday
        transport_cost = random.uniform(5, 15)
        transactions.append({
            "account": "Conta Corrente",
            "category": "Transporte",  # Transporte
            "amount": -transport_cost,
            "date": current_date_str,
            "description": "Transporte diário",
            "type": "Despesa"
        })
        current_balance -= transport_cost

    # Leisure (randomly on weekends)
    if current_date.weekday() >= 5 and random.random() < 0.3:  # 30% chance on Saturday or Sunday
        leisure_spending = random.uniform(50, 200)
        if current_balance > leisure_spending:
            transactions.append({
                "account": "Conta Corrente",
                "category": "Lazer",  # Lazer
                "amount": -leisure_spending,
                "date": current_date_str,
                "description": "Lazer",
                "type": "Despesa"
            })
            current_balance -= leisure_spending

    # Education (monthly payments)
    if current_date.day == 10:
        education_fee = 600
        if current_balance > education_fee:
            transactions.append({
                "account": "Conta Corrente",
                "category": "Educação",  # Educação
                "amount": -education_fee,
                "date": current_date_str,
                "description": "Mensalidade Escolar",
                "type": "Despesa"
            })
            current_balance -= education_fee

    # Medical (sporadic spending)
    if random.random() < 0.05:  # 5% chance daily
        medical_spending = random.uniform(100, 500)
        transactions.append({
            "account": "Conta Corrente",
            "category": "Saúde",  # Saúde
            "amount": -medical_spending,
            "date": current_date_str,
            "description": "Despesa médica",
            "type": "Despesa"
        })

    # Create transactions in the system
    for transaction in transactions:
        create_transaction(token, **transaction)


if __name__ == "__main__":
    create_user()
    token = login()

    # Create accounts
    accounts = [
        {
            "name": "Conta Corrente",
            "type": "Conta Corrente",
            "balance": 0
        }
    ]
    for account in accounts:
        create_account(token, account["name"], account["type"], account["balance"])

    # Create categories
    categories = [
        "Salário",
        "Alimentação",
        "Transporte",
        "Moradia",
        "Educação",
        "Saúde",
        "Lazer",
        "Outros"
    ]

    for category in categories:
        create_category(token, category)

    # Create transactions
    # Iterate over each day in the date range
    current_date = start_date
    current_balance = 0.0
    while current_date <= end_date:
        generate_random_transaction(token, current_date.strftime("%Y-%m-%d"), current_balance=current_balance)
        current_date += timedelta(days=1)