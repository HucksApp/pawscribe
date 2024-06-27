from Api.app import app , socketio
from Api.debug import Api_urls

if __name__ == "__main__":
    Api_urls(app)
    socketio.run(app,host='0.0.0.0', port=8000, debug=True)





#
#"scripts": {
#    "start": "react-scripts start",
#    "build": "react-scripts build",
#    "test": "react-scripts test",
#    "eject": "react-scripts eject"
#  }