import os
from pathlib import Path

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.engine import URL
from sqlalchemy.orm import declarative_base, sessionmaker

load_dotenv(dotenv_path=Path(__file__).with_name(".env"), override=False)

required_variables = ("DB_USER", "DB_PASSWORD", "DB_HOST", "DB_PORT", "DB_NAME")
missing_variables = [name for name in required_variables if not os.getenv(name)]
if missing_variables:
    raise RuntimeError(
        "Missing required database environment variables: "
        + ", ".join(missing_variables)
    )

try:
    database_port = int(os.environ["DB_PORT"])
except ValueError:
    raise RuntimeError("DB_PORT must be an integer") from None

if not 1 <= database_port <= 65535:
    raise RuntimeError("DB_PORT must be between 1 and 65535")

database_url = URL.create(
    drivername="mysql+pymysql",
    username=os.environ["DB_USER"],
    password=os.environ["DB_PASSWORD"],
    host=os.environ["DB_HOST"],
    port=database_port,
    database=os.environ["DB_NAME"],
)

engine = create_engine(database_url, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
