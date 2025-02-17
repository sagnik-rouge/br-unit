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
async def fetch_company_name(job_url: str = Form(...), api_key: str = Form(...)):
    try:
        # Initialize WebBaseLoader with the URL and scrape page content
        loader = WebBaseLoader([job_url])
        content = loader.load()[0].page_content

        # Configure Gemini AI
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel("gemini-pro")

        # Create a prompt for analysis
        prompt = f"""
        Analyze the following company website content and provide key information:
        {content[:10000]}  # Limit content length to avoid token limits
        
        Please provide:
        1. Company name
        2. Main industry/sector
        3. Key products or services
        4. Company size (if mentioned)
        5. Notable achievements or unique selling points
        """

        # Generate response using Gemini
        response = model.generate_content(prompt)

        return {"url": job_url, "analysis": response.text, "status": "success"}
    except Exception as e:
        return {"error": str(e), "status": "error"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="localhost", port=8900, reload=True)
