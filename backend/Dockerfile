# 1
FROM python:3.7

# 2
RUN pip install Flask gunicorn

# 3
RUN python init_db.py

# 4
COPY . /app
WORKDIR /app

# 5
ENV PORT 8080

# 6
CMD exec gunicorn --bind :$PORT --workers 1 --threads 8 app:app
