# Running Alembic Autogenerate and Applying Migrations

To autogenerate and apply migrations using Alembic, follow these steps:

1. **Autogenerate the migration script**:
    ```bash
    uv run alembic revision --autogenerate -m "your_migration_message"
    ```

2. **Apply the migration**:
    ```bash
    uv run alembic upgrade head
    ```

Replace `"your_migration_message"` with a descriptive message for the migration.

**Note**: Ensure that your Alembic configuration is correctly set up before running these commands.