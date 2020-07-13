FROM python:3.8-slim-buster

WORKDIR /src

COPY ./requirements.txt /src

# First install the dependencies. Docker will skip the RUN part if it detects that there are no changes on the COPY part
RUN apt-get update \
    && apt-get install -y gcc \
    && apt-get install -y libpq-dev \
    && rm -rf /var/lib/apt/lists/* \
    && pip install -r requirements.txt \
    && apt-get purge -y --auto-remove gcc

# With 'Make dev' we overwrite these copied folders with mounting a host volume to container.
COPY . /src

CMD ["python", "./app/main.py"]