import os

google_api_key = os.getenv("GOOGLE_API_KEY")
os.environ["LANGCHAIN_TRACING_V2"] = "true"
langchain_api_key = os.getenv("LANGCHAIN_API_KEY")


from typing import TypedDict, Dict, Any

from langgraph.graph import StateGraph, END
from langchain.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

from langchain_google_vertexai import ChatVertexAI

class PipelineState(TypedDict):
    """
    Shared state passed through the pipeline.
    """
    keys: Dict[str, Any]


def get_vertex_llm(
    model_name: str = "gemini-2.5-flash",
    temperature: float = 0.2,
    max_output_tokens: int = 4096
):
    """
    Create a Gemini model hosted on Google AI.
    """
    return ChatVertexAI(
        model_name=model_name,
        temperature=temperature,
        max_output_tokens=max_output_tokens,
    )

def run_llm(state: PipelineState):
    """
    Executes the Gemini model on user input.
    """
    llm = state["keys"]["llm"]
    user_input = state["keys"]["input"]

    prompt = ChatPromptTemplate.from_template(
        """Respond clearly and concisely to the following input. User input will almost always be Grainger Company related. 
        If user inputs a problem they are having, suggest different Grainger products (with full name) that may solve issue. 
        If user asks questions about product, first look for answer in the Grainger website listing of product and if no viable answer found, search on reputable forums:

        {input}
        """
    )

    chain = prompt | llm | StrOutputParser()

    response = chain.invoke({"input": user_input})

    return {
        "keys": {
            **state["keys"],
            "llm_output": response
        }
    }

pipeline = StateGraph(PipelineState)

pipeline.add_node("run_llm", run_llm)
pipeline.set_entry_point("run_llm")
pipeline.add_edge("run_llm", END)

app = pipeline.compile()

print("LangGraph pipeline built successfully.")

if __name__ == "__main__":
   
    llm = get_vertex_llm(
        model_name="gemini-2.5-flash",
        temperature=0.2
    )

    inputs = {
        "keys": {
            "llm": llm,
            "input": "Generate a short story about two Grainger tools falling love."
        }
    }

    result = app.invoke(inputs)

    print("\nPipeline Generation Test Results\n")
    print(result["keys"]["llm_output"])
