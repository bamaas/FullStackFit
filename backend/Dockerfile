FROM python:3.7.4-stretch

WORKDIR /src

# First install the dependencies. Docker will skip the RUN part if it detects that there are no changes on the COPY part
COPY ./requirements.txt /src
RUN pip install -r ./requirements.txt

# With 'Make dev' we overwrite these copied folders with mounting a host volume to container.
COPY . /src

CMD ["python", "./app/main.py"]