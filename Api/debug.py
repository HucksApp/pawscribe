

def Api_urls(app):
    allowed_url = app.url_map.__dict__['_rules_by_endpoint']
    print("\n\n[*] ACCESSIBLE URL CONFIGURATION [*]\n")
    for k,v in allowed_url.items():
        m = f"{k}: {v}\n"
        print(m)
