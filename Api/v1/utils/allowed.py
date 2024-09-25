"""
Module: File Type Validation and Language Matching

This module provides utility functions to validate uploaded file types 
and to map programming languages to their corresponding file extensions.

Functions:
- allowed_file: Checks if the uploaded file has an allowed extension.
- supported_language_match: Matches a programming language to its corresponding file extension.

Usage:
- Use `allowed_file` to validate file uploads before processing them.
- Use `supported_language_match` to get the appropriate file extension for a given programming language.
"""

import os

# Set of allowed file extensions for uploads
ALLOWED_EXTENSIONS = {'.txt', '.pdf', '.png', '.jpg', '.jpeg', '.gif', '.py',
                      '.ts', '.html', '.js', '.svg', '.sh', '.java',
                      '.c', '.cpp', '.css', '.php', '.jsx', '.rb'}


def allowed_file(filename, message):
    """
    Check if the uploaded file has an allowed extension.

    Parameters:
    - filename (str): The name of the file to check.
    - message (dict): A dictionary to store error messages if the file type is not allowed.

    Returns:
    - bool: True if the file type is allowed, False otherwise.
    """
    extension = os.path.splitext(filename)[1]  # Get the file extension
    if extension in ALLOWED_EXTENSIONS:
        return True
    # Update message if type is not supported
    message.update({"message": "File Type is not supported"})
    return False


def supported_language_match(language):
    """
    Match a programming language to its corresponding file extension.

    Parameters:
    - language (str): The programming language to match.

    Returns:
    - str: The corresponding file extension or '.txt' if no match is found.
    """
    match language:
        case 'plaintext':
            return 'txt'  # Return txt for plaintext
        case 'python':
            return 'py'  # Return py for Python
        case 'javascript':
            return 'js'  # Return js for JavaScript
        case 'php':
            return 'php'  # Return php for PHP
        case 'ruby':
            return 'rb'  # Return rb for Ruby
        case 'html':
            return 'html'  # Return html for HTML
        case 'css':
            return 'css'  # Return css for CSS
        case 'bash':
            return 'sh'  # Return sh for Bash
        case 'java':
            return 'java'  # Return java for Java
        case 'cpp':
            return 'cpp'  # Return cpp for C++
        case 'c':
            return 'c'  # Return c for C
        case _:
            return '.txt'  # Default to txt if no match is found
