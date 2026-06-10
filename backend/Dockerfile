# Gorakhai CMS Backend
# Production-ready FastAPI container

FROM python:3.11-slim

# Security: non-root user
RUN addgroup --system app && adduser --system --group app

WORKDIR /app

# Install dependencies first (layer caching)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy source
COPY . .

# Create uploads directory with correct ownership
RUN mkdir -p /app/uploads && chown -R app:app /app/uploads

USER app

EXPOSE 8001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8001/api/')" || exit 1

CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8001", "--workers", "2"]
