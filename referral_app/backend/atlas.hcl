data "external_schema" "sqlalchemy" {
  program = [
    "uv",
    "run",
    "python",
    "atlas_loader.py"
  ]
}

env "local" {
  src = data.external_schema.sqlalchemy.url
  dev = "docker://postgres/15/dev?search_path=public"
  url = getenv("DATABASE_URL")

  migration {
    dir = "file://migrations"
  }

  diff {
    skip {
      drop_schema = true
    }
  }
}

env "docker" {
  src = data.external_schema.sqlalchemy.url
  dev = "postgresql://postgres:postgres@postgres:5432/dev?search_path=public&sslmode=disable"
  url = "postgresql://postgres:postgres@postgres:5432/referral_db?sslmode=disable"

  migration {
    dir = "file://migrations"
  }

  diff {
    skip {
      drop_schema = true
    }
  }
}
