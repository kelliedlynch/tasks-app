# 1
FROM python:3.7

# 2
RUN pip install Flask gunicorn

# 3
RUN ls


# 4
RUN ls
COPY . /app
WORKDIR /app
RUN ls
RUN python init_db.py

# 5
ENV PORT 8080

# 6
CMD exec gunicorn --bind :$PORT --workers 1 --threads 8 app:app
