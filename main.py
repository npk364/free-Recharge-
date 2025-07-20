from flask import Flask, render_template

app = Flask(name, template_folder='templates')

@app.route('/')
def home():
    return render_template("dashboard.html")

if name == 'main':
    app.run()
    return jsonify({
        'all_files': files,
        'html_files': html_files,
        'current_directory': os.getcwd()
    })

@app.route('/')
def dashboard():
    if not os.path.exists('dashboard.html'):
        return f"dashboard.html file not found. Available files: {os.listdir('.')}", 404
    return send_from_directory('.', 'dashboard.html')

@app.route('/game')
def game():
    if not os.path.exists('index.html'):
        return f"index.html file not found. Available files: {os.listdir('.')}", 404
    return send_from_directory('.', 'index.html')

@app.route('/<path:filename>')
def static_files(filename):
    try:
        return send_from_directory('.', filename)
    except FileNotFoundError:
        abort(404)

@app.after_request
def after_request(response):
    response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
    response.headers['Pragma'] = 'no-cache'
    response.headers['Expires'] = '0'
    return response

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
