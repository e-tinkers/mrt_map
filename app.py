import json
from graph import load_graph, shortest_path
from flask import Flask, request, render_template, jsonify


stations = load_graph('static/stations_sg.json')
app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/api/v1/')
def api():
    req = request.args
    route = shortest_path(stations, req['start'], req['end'])
    if route==None:
       return jsonify({'route': 'null'}), 400
    else:
       return jsonify({'route': route}), 200


app.run(debug=True)
