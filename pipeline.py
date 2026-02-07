import os
import requests
from typing import List
from dotenv import load_dotenv

load_dotenv()

google_api_key = os.getenv("GOOGLE_API_KEY")
google_cse_id = os.getenv("GOOGLE_CSE_ID")
langchain_api_key = os.getenv("LANGCHAIN_API_KEY")

os.environ["LANGCHAIN_TRACING_V2"] = "true"
os.environ["LANGCHAIN_PROJECT"] = "grainger-live-search"

if not langchain_api_key:
    raise RuntimeError("LANGCHAIN_API_KEY is required for tracing")
if not google_api_key or not google_cse_id:
    raise RuntimeError("GOOGLE_API_KEY and GOOGLE_CSE_ID are required")

def grainger_live_search(query: str) -> str:
    """
    Perform a live Google search restricted to grainger.com
    using Google Programmable Search (CSE). 

    - Suggest products that may be beneficial.
    - Provide available product info from Grainger.
    - If no results, fallback to verifiable sources.
    """
    url = "https://www.googleapis.com/customsearch/v1"
    params = {
        "key": google_api_key,
        "cx": google_cse_id,
        "q": f"site:grainger.com {query}",
        "num": 5,
    }

    response = requests.get(url, params=params, timeout=10)
    response.raise_for_status()
    data = response.json()

    if "items" not in data:
        return "No relevant Grainger results found."

    results: List[str] = []
    for item in data["items"]:
        results.append(
            f"Product/Page Title: {item.get('title')}\n"
            f"Snippet: {item.get('snippet')}\n"
            f"URL: {item.get('link')}\n"
        )

    return "\n".join(results)

from langchain.tools import tool

@tool
def grainger_search(query: str) -> str:
    """
    Search live Grainger.com pages for products, specs, categories, and industrial solutions.
    This tool MUST be used for any Grainger-related question.
    """
    return grainger_live_search(query)


from langchain_google_vertexai import ChatVertexAI

llm = ChatVertexAI(
    model_name="gemini-2.5-flash",
    temperature=0.2,
    max_output_tokens=4096,
)

from langchain.agents import initialize_agent, AgentType

agent = initialize_agent(
    tools=[grainger_search],
    llm=llm,
    agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
    verbose=True,
)

if __name__ == "__main__":
    print("Test\n")
    user_query = "test"
    response = agent.run(user_query)
    print("\nTest response:\n")
    print(response)
