from llama_cpp import Llama
import re
# import pandas as pd
import time

# CONFIG 
LLM_MODEL_NAME = "mistral-7b-instruct-v0.1.Q4_K_M.gguf"
N_CTX = 2048
# DATASET_INPUT = 
# DATASET_OUTPUT = 

LLM_MODEL = Llama(
    model_path = LLM_MODEL_NAME,
    n_ctx = N_CTX,
    n_gpu_layers = -1,
    verbose = False,
    
)

PROMPT = "What parts do I need to build a treehouse?"

OUTPUT = LLM_MODEL("[INST]{PROMPT}[/INST]",
                   max_tokens = 200, temperature= 0.7)

print(OUTPUT["choices"][0]["text"])