import os
import requests
from typing import List

google_api_key= os.getenv("GOOGLE_API_KEY")
google_cse_id= os.getenv("GOOGLE_CSE_ID")

langchain_api_key= os.getenv("LANGCHAIN_API_KEY")
LANGCHAIN_TRACING_V2="true"
LANGCHAIN_PROJECT="grainger-live-search"

os.environ["LANGCHAIN_TRACING_V2"] = "true"

if not os.environ.get("LANGCHAIN_API_KEY"):
    raise RuntimeError("LANGCHAIN_API_KEY is required for tracing")


def grainger_live_search(query: str) -> str:
    """
    Perform a live Google search restricted to grainger.com
    using Google Programmable Search (CSE).
    """
    api_key = os.environ.get("GOOGLE_API_KEY")
    cse_id = os.environ.get("GOOGLE_CSE_ID")

    if not api_key or not cse_id:
        raise RuntimeError("Missing GOOGLE_API_KEY or GOOGLE_CSE_ID")

    url = "https://www.googleapis.com/customsearch/v1"

    params = {
        "key": api_key,
        "cx": cse_id,                     
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


from langchain.tools import Tool

grainger_search_tool = Tool(
    name="Grainger Live Search",
    func=grainger_live_search,
    description=(
        "Search live Grainger.com pages for products, specs, "
        "categories, and industrial solutions. "
        "This tool MUST be used for any Grainger-related question."
    ),
)


from langchain_google_vertexai import ChatVertexAI

llm = ChatVertexAI(
    model_name="gemini-2.5-flash",
    temperature=0.0,
    max_output_tokens=4096,
)


from langchain.agents import initialize_agent, AgentType

agent = initialize_agent(
    tools=[grainger_search_tool],
    llm=llm,
    agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
    verbose=True,   
)

if __name__ == "__main__":
    print("Test\n")

    user_query = (
        "test"
    )

    response = agent.run(
        f"""
        Test
        {user_query}
        """
    )

    print("\ntest\n")
    print(response)

