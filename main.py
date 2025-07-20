
from flask import Flask, render_template, send_from_directory, abort, jsonify, redirect, url_for
import os

app = Flask(__name__)

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
    # Check if dashboard.html exists in current directory
    if os.path.exists('dashboard.html'):
        return send_from_directory('.', 'dashboard.html')
    
    # Check if dashboard.html exists in templates directory
    if os.path.exists('templates/dashboard.html'):
        return render_template('dashboard.html')
    
    # If neither exists, create a simple HTML response
    return '''
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Try Your Luck 99% Win</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0;
                color: white;
                text-align: center;
            }
            .container {
                background: rgba(255, 255, 255, 0.1);
                padding: 40px;
                border-radius: 20px;
                backdrop-filter: blur(10px);
            }
            h1 { font-size: 2.5rem; margin-bottom: 20px; }
            .btn {
                background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
                color: white;
                padding: 15px 30px;
                border: none;
                border-radius: 10px;
                font-size: 1.2rem;
                cursor: pointer;
                text-decoration: none;
                display: inline-block;
                margin: 10px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🎰 Try Your Luck 99% Win 🎰</h1>
            <p>Your Lucky Recharge Destination</p>
            <a href="/game" class="btn">Play Now</a>
        </div>
    </body>
    </html>
    '''

@app.route('/game')
def game():
    # Check if index.html exists in current directory
    if os.path.exists('index.html'):
        return send_from_directory('.', 'index.html')
    
    # Check if index.html exists in templates directory
    if os.path.exists('templates/index.html'):
        return render_template('index.html')
    
    return "Game page not found", 404

@app.route('/<path:filename>')
def static_files(filename):
    try:
        # First try current directory
        if os.path.exists(filename):
            return send_from_directory('.', filename)
        
        # Then try static directory
        if os.path.exists(f'static/{filename}'):
            return send_from_directory('static', filename)
        
        abort(404)
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
