from flask import Flask, render_template, send_from_directory, abort, jsonify
import os

app = Flask(name__, static_folder='static', template_folder='templates')


@app.route('/debug')
def debug():
    files = os.listdir('.')
    html_files = [f for f in files if f.endswith('.html')]
    return jsonify({
        'all_files': files,
        'html_files': html_files,
        'current_directory': os.getcwd()
    })


@app.route('/')
def dashboard():
    return render_template('dashboard.html')


@app.route('/game')
def game():
    return render_template('index.html')


@app.route('/static/<path:filename>')
def static_files(filename):
    return send_from_directory('static', filename)


if name == 'main':
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)
