# 1
FROM python:3.7

# 2
RUN pip install gunicorn

# 3
COPY . /app
WORKDIR /app
RUN pip install -r requirements.txt

# 4
RUN python3.7 init_db.py

# 5
ENV PORT 8080

# 6
CMD exec gunicorn --bind :$PORT --workers 1 --threads 8 app:app
