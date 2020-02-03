FROM python:3.7

EXPOSE 80

COPY ./app /app

COPY ./requirements.txt ./requirements.txt
RUN pip install -r requirements.txt

WORKDIR /app

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "80"]

#https://fastapi.tiangolo.com/deployment/#raspberry-pi-and-other-architectures