
# Try Your Luck 99% Win - Spin Game

A fun and interactive spinning game with scratch cards and lucky draws.

## Features
- Interactive spin wheel
- Scratch cards with random offers
- Multiple telecom operators (Airtel, VI, Jio)
- Responsive design
- Real-time animations

## Technologies Used
- Python Flask
- HTML5/CSS3
- JavaScript
- Bootstrap (optional)

## Local Development

1. Clone the repository
```bash
git clone <your-repo-url>
cd <project-directory>
```

2. Install dependencies
```bash
pip install -r requirements.txt
```

3. Run the application
```bash
python main.py
```

4. Open your browser and visit `http://localhost:5000`

## Deployment on Render

1. Push your code to GitHub
2. Connect your GitHub repository to Render
3. Use the following settings:
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn main:app --bind 0.0.0.0:$PORT`

## File Structure
```
├── main.py              # Flask application
├── dashboard.html       # Landing page
├── index.html          # Main game page
├── dashboard.css       # Landing page styles
├── styles.css          # Game page styles
├── dashboard.js        # Landing page scripts
├── script.js           # Game logic
├── requirements.txt    # Python dependencies
├── Procfile           # Render deployment config
└── README.md          # Project documentation
```

## License
This project is for educational purposes only.
