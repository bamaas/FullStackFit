from fastapi import FastAPI
from routers import calculator
from starlette.middleware.cors import CORSMiddleware

# Run from /app folder: uvicorn main:app --reload 
app = FastAPI()
app.include_router(calculator.router)

origins = [
    "http://localhost",
    "https://localhost"
    "https://localhost:4200"
    "http://localhost:4200"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if __name__ == "__main__":
    import os
    port = int(os.environ.get('PORT', 5000))        # Bind to env variable PORT if defined, otherwise default to 5000.
    reload = os.environ.get('RELOAD', False)
    print('Port is:', port)
    print('Reload is:', reload)
    # https://www.uvicorn.org/
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=port, log_level="info", reload=reload)