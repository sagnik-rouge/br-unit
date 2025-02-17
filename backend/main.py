from fastapi import FastAPI, Form
from fastapi.middleware.cors import CORSMiddleware
from langchain_community.document_loaders import WebBaseLoader
import google.generativeai as genai
from typing import Optional

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite's default dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/fetch-company-name")
async def fetch_company_name(job_url: str = Form(...)):
    try:
        # Initialize WebBaseLoader with the URL and scrape page content
        loader = WebBaseLoader([job_url])
        content = loader.load()[0].page_content

        # Here you would process the content and extract relevant information
        # For now, we'll return a simple response
        return {
            "url": job_url,
            "content": content[:500] + "..." if len(content) > 500 else content,
            "status": "success"
        }
    except Exception as e:
        return {"error": str(e), "status": "error"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="localhost", port=8900, reload=True)