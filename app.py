from flask import Flask, request, jsonify, render_template
from solution import compute_path

app = Flask(__name__)


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/solve", methods=["POST"])
def solve():
    data = request.json
    start = tuple(data["start"])
    items = [tuple(i) for i in data["items"]]
    shelves = [tuple(i) for i in data["shelves"]]

    path = compute_path(start, items, shelves)
    return jsonify({"path": path})


if __name__ == "__main__":
    app.run(debug=True)
