from flask import Blueprint


app = Blueprint('v1', __name__)
from  .routes.auth import auth_bp
from  .routes.user import user_bp
from  .routes.files import files_bp
from  .routes.text import text_bp
from  .routes.folder import folders_bp
from  .routes.run import run_bp

app.register_blueprint(auth_bp)
app.register_blueprint(files_bp)
app.register_blueprint(user_bp)
app.register_blueprint(text_bp)
app.register_blueprint(folders_bp)
app.register_blueprint(run_bp)