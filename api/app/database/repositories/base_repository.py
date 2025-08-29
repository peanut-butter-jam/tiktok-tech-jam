from typing import Generic, TypeVar
from uuid import UUID

from pydantic import BaseModel
from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.orm.interfaces import ORMOption


Model = TypeVar("Model", bound=DeclarativeBase)


class BaseRepository(Generic[Model]):
    """Repository for performing database queries."""

    def __init__(self, model: type[Model], session: AsyncSession) -> None:
        self.model = model
        self.session = session

    async def create(self, instance: Model) -> Model:
        """
        Create a new instance of the model in the database.

        Args:
            data (BaseModel): Data to create the model instance.

        Returns:
            Model: The created model instance.
        """
        return (await self.create_many([instance]))[0]

    async def create_many(self, instances: list[Model]) -> list[Model]:
        """
        Create multiple instances of the model in the database.

        Args:
            data (list[BaseModel]): List of data to create model instances.

        Returns:
            list[Model]: List of created model instances.
        """
        self.session.add_all(instances)
        await self.session.commit()

        for instance in instances:
            await self.session.refresh(instance)

        return instances

    async def get_all(self, options: list[ORMOption] | None = None) -> list[Model]:
        """
        Get all instances of the model.

        Args:
            options (list[ORMOption] | None): Optional ORM options for the query.

        Returns:
            list[Model]: List of all model instances.
        """
        q = select(self.model)
        if options:
            q = q.options(*options)
        rows = await self.session.execute(q)
        return list(rows.unique().scalars().all())

    async def get_one_by_id(
        self, id: UUID | int, options: list[ORMOption] | None = None
    ) -> Model | None:
        """
        Get a single instance of the model by its ID.

        Args:
            id (UUID): The ID of the model instance.

        Returns:
            Model | None: The model instance if found, otherwise None.
        """
        res = await self.get_many_by_ids([id], options)
        return res[0] if res else None

    async def get_many_by_ids(
        self, ids: list[UUID | int], options: list[ORMOption] | None = None
    ) -> list[Model]:
        """
        Get multiple instances of the model by their IDs.

        Args:
            ids (list[UUID]): List of IDs of the model instances.

        Returns:
            list[Model]: List of model instances corresponding to the provided IDs.
        """
        q = select(self.model).where(getattr(self.model, "id").in_(ids))
        if options:
            q = q.options(*options)
        rows = await self.session.execute(q)
        return list(rows.unique().scalars().all())

    async def update_by_id(self, id: UUID | int, data: BaseModel) -> Model | None:
        """
        Update a single instance of the model by its ID.
        Args:
            id (UUID): The ID of the model instance to update.
            data (BaseModel): Data to update the model instance.

        Returns:
            Model | None: The updated model instance if found, otherwise None.
        """
        res = await self.update_many_by_ids([id], data)
        return res[0] if res else None

    async def update_many_by_ids(
        self, ids: list[UUID | int], data: BaseModel
    ) -> list[Model]:
        """
        Update multiple instances of the model by their IDs.

        Args:
            ids (list[UUID]): List of IDs of the model instances to update.
            data (BaseModel): Data to update the model instances.

        Returns:
            list[Model]: List of updated model instances.
        """
        instances = await self.get_many_by_ids(ids)
        if not instances:
            return []

        for instance in instances:
            for key, value in data.model_dump(exclude_unset=True).items():
                setattr(instance, key, value)

        await self.session.commit()
        for instance in instances:
            await self.session.refresh(instance)

        return instances

    async def delete_by_id(self, id: UUID | int) -> int:
        """
        Delete a single instance of the model by its ID.

        Args:
            id (UUID): The ID of the model instance to delete.

        Returns:
            int: The number of rows deleted (should be 1 if the ID exists).
        """
        return await self.delete_many_by_ids([id])

    async def delete_many_by_ids(self, ids: list[UUID | int]) -> int:
        """
        Delete multiple instances of the model by their IDs.

        Args:
            ids (list[UUID]): List of IDs of the model instances to delete.

        Returns:
            int: The number of rows deleted.
        """
        q = delete(self.model).where(getattr(self.model, "id").in_(ids))
        rows = await self.session.execute(q)
        await self.session.commit()
        return rows.rowcount

    async def get_by_filter(self, **kwargs) -> list[Model]:
        """
        Get instances of the model by filtering with keyword arguments.

        Args:
            **kwargs: Filter criteria as keyword arguments.

        Returns:
            list[Model]: List of model instances that match the filter criteria.
        """
        conditions = []

        for key, value in kwargs.items():
            col = getattr(self.model, key)
            if isinstance(value, (list, tuple, set)):
                conditions.append(col.in_(value))
            else:
                conditions.append(col == value)

        q = select(self.model).where(*conditions)
        rows = await self.session.execute(q)
        return list(rows.unique().scalars().all())
