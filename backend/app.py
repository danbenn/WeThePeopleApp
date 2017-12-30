"""Main routes for reps, stories and events handling."""

from flask import Flask, request, jsonify
from get_posts import get_recent_posts

app = Flask(__name__)

@app.route('/recent_posts/', methods=['GET'])
def index():
    """Find recent posts from representatives at given address."""
    if 'address' in request.args and 'uid' in request.args:
        address = request.args['address']
        uid = request.args['uid']
        posts = get_recent_posts(address, uid)
        return jsonify(posts)
    return 400

# We only need this for local development.
if __name__ == '__main__':
    app.run(debug=True)