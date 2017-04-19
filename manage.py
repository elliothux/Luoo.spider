from app import app
from flask_script import Manager


manager = Manager(app)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port='80')

