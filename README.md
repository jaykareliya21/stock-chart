# Stock Chart Visualization

This project visualizes the stock prices of IBM using an HTML5 canvas and JavaScript. It plots the stock prices along with a 20-day moving average.

## Features

- Fetches stock data from a CSV file.
- Plots closing prices as a mountain chart.
- Plots a 20-day moving average line.
- Displays OHLC (Open, High, Low, Close) values on hover with crosshairs.
- Supports zooming in and out using the mouse wheel.

## Installation and Setup

### Prerequisites

- A web browser (latest version recommended)
- A local web server (optional for local testing)

## Usage

- The chart will be displayed with closing prices and a 20-day moving average.
- Hover over the chart to see the OHLC values.
- Use the mouse wheel to zoom in and out.

## Files

- `index.html`: The main HTML file containing the canvas elements.
- `script.js`: The JavaScript file containing the logic for fetching data, processing it, and plotting the chart.
- `data.csv`: The CSV file containing stock data. Ensure it is formatted correctly.

- Serve Files: You need to serve the HTML, CSS, and JavaScript files using a local server to avoid CORS issues.

- If you have Python installed, you can use Python's built-in HTTP server. Run the following command in the project directory:

```
- python3 -m http.server

- Alternatively, you can use any other local server of your choice.

- Open in Browser: Once the server is running, open your web browser and navigate to the following URL:

http://localhost:8000


### View the Chart
- The stock chart visualization should now be displayed in your browser.

### IF you don't have python then choose below option

### Using Live Server Extension (for Visual Studio Code)
- If you're using Visual Studio Code, you can use the Live Server extension to serve your files locally.

- Install the Live Server extension from the Visual Studio Code Marketplace.

- Open your project folder in Visual Studio Code.

- Right-click on index.html and select "Open with Live Server".

- Note: If your project is simple and does not require server-side processing, you can open the HTML file directly in the browser. However, note that this approach may not work if your code relies on fetching data from external sources due to browser security restrictions.
