#from flask import Blueprint

#app = Blueprint('v1', __name__)
#from Api.v1.routes import  auth, files, user
#from Api.v1.routes.auth import auth
#from Api.v1.routes.user import user_bp
#from Api.v1.routes.files import files

#app.register_blueprint(auth, url_prefix='/auth')
#app.register_blueprint(files, url_prefix='/files')
#app.register_blueprint(user_bp, url_prefix='/user')
from flask import Blueprint


app = Blueprint('v1', __name__)
from  .routes.auth import auth_bp
from  .routes.user import user_bp
from  .routes.files import files_bp
from  .routes.text import text_bp

app.register_blueprint(auth_bp)
app.register_blueprint(files_bp)
app.register_blueprint(user_bp)
app.register_blueprint(text_bp)