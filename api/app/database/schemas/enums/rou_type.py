from enum import StrEnum, auto


class RouType(StrEnum):
    """
    Enumeration for Regulation Obligation Unit (ROU) types.
    """

    HUMAN = auto()  # Manual created by human
    AI = auto()  # Automatically extracted by AI
