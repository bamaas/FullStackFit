FROM python:3.7.4-stretch

WORKDIR /src

CMD ["robot"]

# Copy requirements separately, because only if the requirements are changed, it will run again. Otherwise the
# requirements are in the cache and won't be installed again.
COPY requirements.txt /

## installing the requirements in the docker images
RUN pip install -r /requirements.txt

COPY chrome /usr/bin/chrome

ARG chromium_version=73.0.3683.75-1~deb9u1
ARG chromedriver_version=73.0.3683.68

RUN apt-get update \
    && apt-get install -y chromium=${chromium_version} xvfb \
    && chmod +rx /usr/bin/chrome

RUN wget -q "https://chromedriver.storage.googleapis.com/${chromedriver_version}/chromedriver_linux64.zip" -O /tmp/chromedriver.zip \
    && unzip /tmp/chromedriver.zip -d /usr/bin/ \
    && chmod +rx /usr/bin/chromedriver \
    && rm /tmp/chromedriver.zip

ENV HEADLESS=no \
    WINDOWSIZE=1920x1080 \
    HOME=/tmp

# Make folder for log files
RUN mkdir /src/logs
RUN chmod 755 /src/logs