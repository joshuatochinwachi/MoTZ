import os
import requests
from dotenv import load_dotenv
from datetime import datetime
from typing import Optional

load_dotenv()
dune_api_key = os.getenv("DEFI_JOSH_DUNE_QUERY_API_KEY")

url = "https://api.dune.com/api/v1/usage"
headers = {
    "X-DUNE-API-KEY": dune_api_key,
    "Content-Type": "application/json"
}

def prompt_date(prompt_text: str, default: Optional[str] = None) -> str:
    """Prompt the user for a date in YYYY-MM-DD format. If default is provided and
    the user enters nothing, return the default.
    """
    while True:
        prompt = f"{prompt_text} (YYYY-MM-DD)"
        if default:
            prompt += f" [{default}]"
        prompt += ": "
        s = input(prompt).strip()
        if not s:
            if default:
                return default
            print("Please enter a date in YYYY-MM-DD format.")
            continue
        try:
            
            datetime.strptime(s, "%Y-%m-%d")
            return s
        except ValueError:
            print("Invalid date format. Use YYYY-MM-DD.")


end_date = prompt_date("Enter end date", default=datetime.utcnow().strftime("%Y-%m-%d"))

start_date = "2025-11-08"

data = {
    "start_date": start_date,
    "end_date": end_date
}

response = requests.post(url, json=data, headers=headers)
print(response.json())