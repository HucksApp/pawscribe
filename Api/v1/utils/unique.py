"""
Module: Unique Key and Filename Generation

This module provides utilities for generating unique keys and creating unique
filenames based on the current timestamp and specified file types.

Functions:
- generate_key: Generates a unique UUID.
- unique_name: Creates a unique filename based on the current timestamp, 
  an optional base filename, and a specified file extension.

Usage:
This module can be used in various applications where unique identifiers and
filenames are required, such as file uploads, logging, or database records.
"""

import os
import datetime
import uuid


def generate_key() -> str:
    """
    Generate a unique identifier using UUID4.

    :return: A string representation of a randomly generated UUID.
    """
    return str(uuid.uuid4())


def unique_name(file_type: str, filename: str = None) -> str:
    """
    Create a unique filename based on the current timestamp and file type.

    The generated filename is structured as: 
    [base_filename]_[current_timestamp]_[file_type]

    :param file_type: The file extension/type (e.g., 'txt', 'pdf').
    :param filename: An optional base filename. If not provided, defaults to 'doc'.
    :return: A unique filename as a string.
    """
    dt = str(datetime.datetime.now().strftime('%Y%m%d_%H%M%S'))
    base_name = filename if filename else 'doc'
    extension = file_type
    new_name = f"{base_name}_{dt}.{extension}"
    return new_name
