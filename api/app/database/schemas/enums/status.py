from enum import StrEnum, auto


class Status(StrEnum):
    """
    Enumeration for the status of a Check.
    """

    PENDING = auto()  # Check is pending and not yet started
    COMPLETED = auto()  # Check has been completed successfully
    FAILED = auto()  # Check has failed
