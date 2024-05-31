from . import app, socketio

# Adding v1 Blueprint
from Api.v1 import app as v1_app
app.register_blueprint(v1_app, url_prefix='/Api/v1')


if __name__ == "__main__":
    socketio.run(app, debug=True)
#    app.run(debug=True)