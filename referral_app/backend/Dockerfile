FROM python:3.11-slim

WORKDIR /app

# Install system dependencies including curl for Atlas installation
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Install uv using the install script
RUN curl -LsSf https://astral.sh/uv/install.sh | sh
ENV PATH="/root/.local/bin:${PATH}"

# Install Atlas CLI
RUN curl -sSf https://atlasgo.sh | sh

# Copy dependency files
COPY pyproject.toml uv.lock* ./

# Install dependencies (including dev for Atlas migrations)
RUN uv sync

# Copy application code - keep app directory structure
COPY app/ ./app/

# Copy Atlas configuration and migrations
COPY atlas.hcl ./
COPY atlas_loader.py ./
COPY migrations/ ./migrations/

# Expose port
EXPOSE 8000

# Run the application with proper module path
CMD ["uv", "run", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
