FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

RUN apt-get update && apt-get install -y --no-install-recommends \
    libcairo2 \
    libffi8 \
    libgdk-pixbuf-2.0-0 \
    libharfbuzz-subset0 \
    libjpeg62-turbo \
    liblcms2-2 \
    libopenjp2-7 \
    libpango-1.0-0 \
    libpangoft2-1.0-0 \
    libtiff6 \
    libwebp7 \
    fontconfig \
    fonts-dejavu-core \
    shared-mime-info \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

COPY app ./app

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
