data "external_schema" "sqlalchemy" {
  program = [
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
  dev = "docker://postgres/15/dev?search_path=public"
  url = "postgresql://postgres:postgres@postgres:5432/referral_db"

  migration {
    dir = "file://migrations"
  }

  diff {
    skip {
      drop_schema = true
    }
  }
}
