def Api_urls(app):
    """
    Function: Api_urls
    This function retrieves and prints the accessible URL configuration of the given Flask application.

    Parameters:
    - app: The Flask application instance from which to retrieve the URL configuration.

    Usage:
    Call this function with the Flask application instance to display all accessible routes and their endpoints.
    It is particularly useful for debugging purposes to confirm that the desired routes are correctly registered.
    """

    # Retrieve the URL configuration from the Flask application
    allowed_url = app.url_map.__dict__['_rules_by_endpoint']

    print("\n\n[*] ACCESSIBLE URL CONFIGURATION [*]\n")

    # Iterate through the URL rules and print them
    for k, v in allowed_url.items():
        m = f"{k}: {v}\n"
        print(m)
