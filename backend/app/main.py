from fastapi import FastAPI
from routers import calculator
from starlette.middleware.cors import CORSMiddleware
from starlette.responses import RedirectResponse

DOCS_URL = "/docs"

# Run from /app folder: uvicorn main:app --reload 
app = FastAPI(docs_url=DOCS_URL, redoc_url=None)

# Routers
app.include_router(calculator.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if __name__ == "__main__":
    import os
    # Bind to env variable PORT if defined, otherwise default to 5000.
    port = int(os.environ.get('PORT', 5000))        
    # Set default value to True to enable hot reloading when running the app directly without Docker (python main.py)
    reload = os.environ.get('RELOAD', True)         
    print('Port is:', port)
    print('Reload is:', reload)
    # https://www.uvicorn.org/
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=port, log_level="info", reload=reload)