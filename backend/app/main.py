from fastapi import FastAPI
from routers import calculator
from starlette.middleware.cors import CORSMiddleware

# Run from /app folder: uvicorn main:app --reload 
app = FastAPI()
app.include_router(calculator.router)

origins = [
    "http://localhost:4200",
    "https://localhost:4200"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

###########################
# OLD FLASK STUFF
###########################
# if __name__ == '__main__':
#     port = int(os.environ.get('PORT', 5000))        # Bind to env variable PORT if defined, otherwise default to 5000.
#     debug=os.environ.get('DEBUG', False)
#     if debug == 'True':
#         debug = True
#     else:
#         debug = False
#     print('Port is:', port)
#     print('Debug is:', debug)
#     app.run(debug=debug, host='0.0.0.0', port=port)      # The defbug=fTrue causes the application to restart on changes