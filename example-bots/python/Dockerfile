FROM python:3.7
RUN pip install pipenv
RUN apt-get update && apt-get install -y netcat
WORKDIR /app
COPY Pipfile* ./
RUN pipenv install
RUN mkdir /bot-data
COPY . ./
CMD ./run-etimo-bots.sh
