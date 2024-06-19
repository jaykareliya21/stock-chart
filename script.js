class StockChart {
    /**
     * Constructor to initialize the StockChart with CSV URL and canvas IDs.
     * @param {string} csvUrl - The URL to fetch CSV data.
     * @param {string} stockCanvasId - The ID of the stock chart canvas element.
     * @param {string} overlayCanvasId - The ID of the overlay canvas element.
     */
    constructor(csvUrl, stockCanvasId, overlayCanvasId) {
        this.csvUrl = csvUrl;
        this.stockCanvas = document.getElementById(stockCanvasId);
        this.overlayCanvas = document.getElementById(overlayCanvasId);
        this.ctx = this.stockCanvas.getContext('2d');
        this.overlayCtx = this.overlayCanvas.getContext('2d');
        this.padding = 60;
        this.fullData = [];
        this.closingPrices = [];
        this.movingAverage = [];
        this.fetchCSVData();
    }

    /**
     * Fetches CSV data from the specified URL, processes it, calculates the moving average, and plots the chart.
     */
    async fetchCSVData() {
        try {
            const response = await fetch(this.csvUrl);
            const csvData = await response.text();
            this.processCSVData(csvData);
            this.calculateMovingAverage();
            this.plotChart(true);
            this.addEventListeners();
        } catch (error) {
            console.error("Error fetching CSV data:", error);
        }
    }


    /**
     * Processes the CSV data to extract full data and closing prices.
     * @param {string} csvData - The raw CSV data as a string.
     */
    processCSVData(csvData) {
        const lines = csvData.trim().split('\n').slice(1);
        lines.forEach(line => {
            const [date, open, high, low, close] = line.split(',').map((field, index) => index === 0 ? field : parseFloat(field));
            this.fullData.push({ date, open, high, low, close });
            this.closingPrices.push({ date, close });
        });
    }


    /**
     * Calculates the 20-day moving average of the closing prices.
     */
    calculateMovingAverage() {
        const period = 20;
        for (let i = 0; i < this.closingPrices.length; i++) {
            if (i >= period - 1) {
                const sum = this.closingPrices.slice(i - (period - 1), i + 1).reduce((acc, val) => acc + val.close, 0);
                const avg = sum / period;
                this.movingAverage.push({ date: this.closingPrices[i].date, avg });
            }
        }
    }


    /**
     * Plots the stock chart including grid lines, axis labels, closing prices, and moving average.
     * @param {boolean} showCrosshairs - Flag to show crosshairs.
     */
    plotChart(showCrosshairs = true) {
        const width = this.stockCanvas.width - 2 * this.padding;
        const height = this.stockCanvas.height - 2 * this.padding;
        const maxPrice = Math.max(...this.fullData.map(p => p.close));
        const minPrice = Math.min(...this.fullData.map(p => p.close));
        const xScale = width / this.fullData.length;
        const yScale = height / (maxPrice - minPrice);

        // Clear the canvas
        this.ctx.clearRect(0, 0, this.stockCanvas.width, this.stockCanvas.height);
        this.overlayCtx.clearRect(0, 0, this.overlayCanvas.width, this.overlayCanvas.height);

        // Draw grid lines
        this.drawGridLines(height, width);
        this.drawAxisLabels(height, maxPrice, minPrice, width);

        // Plot closing prices
        this.plotClosingPrices(xScale, yScale, height, minPrice);

        // Plot moving average
        this.plotMovingAverage(xScale, yScale, height, minPrice);

        // Crosshairs functionality
        if (showCrosshairs) {
            this.addCrosshairsFunctionality(xScale, height);
        }
    }


    /**
     * Draws grid lines on the canvas.
     * @param {number} height - The height of the canvas content area.
     * @param {number} width - The width of the canvas content area.
     */
    drawGridLines(height, width) {
        this.ctx.strokeStyle = '#e0e0e0';
        this.ctx.lineWidth = 1;
        for (let i = 0; i <= 5; i++) {
            const y = this.padding + i * (height / 5);
            this.ctx.beginPath();
            this.ctx.moveTo(this.padding, y);
            this.ctx.lineTo(width + this.padding, y);
            this.ctx.stroke();
        }
    }

    /**
     * Draws Y-axis and X-axis labels on the canvas.
     * @param {number} height - The height of the canvas content area.
     * @param {number} maxPrice - The maximum price to display on the Y-axis.
     * @param {number} minPrice - The minimum price to display on the Y-axis.
     * @param {number} width - The width of the canvas content area.
     */
    drawAxisLabels(height, maxPrice, minPrice, width) {
        this.ctx.textAlign = 'right';
        this.ctx.fillStyle = '#000';
        this.ctx.font = '12px Arial';
        for (let i = 0; i <= 5; i++) {
            const y = this.padding + i * (height / 5);
            const price = maxPrice - i * ((maxPrice - minPrice) / 5);
            this.ctx.fillText(price.toFixed(2), this.padding - 10, y + 3);
        }
        this.ctx.textAlign = 'center';
        for (let i = 0; i < this.fullData.length; i += Math.floor(this.fullData.length / 10)) {
            const x = this.padding + i * (width / this.fullData.length);
            const date = this.fullData[i].date;
            this.ctx.fillText(date, x, height + this.padding + 20);
        }
    }

    /**
     * Plots the closing prices as a mountain chart.
     * @param {number} xScale - The scale factor for the x-axis.
     * @param {number} yScale - The scale factor for the y-axis.
     * @param {number} height - The height of the canvas content area.
     * @param {number} minPrice - The minimum price to display on the Y-axis.
     */
    plotClosingPrices(xScale, yScale, height, minPrice) {
        this.ctx.fillStyle = 'rgba(0, 0, 255, 0.2)';
        this.ctx.strokeStyle = 'blue';
        this.ctx.beginPath();
        this.fullData.forEach((price, index) => {
            const x = this.padding + index * xScale;
            const y = this.padding + height - (price.close - minPrice) * yScale;
            if (index === 0) {
                this.ctx.moveTo(x, height + this.padding);
                this.ctx.lineTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        });
        this.ctx.lineTo(this.padding + (this.fullData.length - 1) * xScale, height + this.padding);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();
    }

    /**
     * Plots the 20-day moving average line.
     * @param {number} xScale - The scale factor for the x-axis.
     * @param {number} yScale - The scale factor for the y-axis.
     * @param {number} height - The height of the canvas content area.
     * @param {number} minPrice - The minimum price to display on the Y-axis.
     */
    plotMovingAverage(xScale, yScale, height, minPrice) {
        this.ctx.strokeStyle = 'red';
        this.ctx.beginPath();
        this.movingAverage.forEach((ma, index) => {
            const x = this.padding + index * xScale;
            const y = this.padding + height - (ma.avg - minPrice) * yScale;
            if (index === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        });
        this.ctx.stroke();
    }


    /**
     * Adds crosshairs and OHLC values display functionality.
     * @param {number} xScale - The scale factor for the x-axis.
     * @param {number} height - The height of the canvas content area.
     */
    addCrosshairsFunctionality(xScale, height) {
        this.overlayCanvas.addEventListener('mousemove', (event) => {
            const rect = this.overlayCanvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            this.overlayCtx.clearRect(0, 0, this.overlayCanvas.width, this.overlayCanvas.height);
            this.overlayCtx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
            this.overlayCtx.beginPath();
            this.overlayCtx.moveTo(x, this.padding);
            this.overlayCtx.lineTo(x, height + this.padding);
            this.overlayCtx.stroke();

            this.overlayCtx.beginPath();
            this.overlayCtx.moveTo(this.padding, y);
            this.overlayCtx.lineTo(this.stockCanvas.width - this.padding, y);
            this.overlayCtx.stroke();

            const dataIndex = Math.floor((x - this.padding) / xScale);
            if (dataIndex >= 0 && dataIndex < this.fullData.length) {
                const ohlc = this.fullData[dataIndex];
                this.overlayCtx.fillStyle = 'black';
                this.overlayCtx.fillText(`O: ${ohlc.open.toFixed(2)} H: ${ohlc.high.toFixed(2)} L: ${ohlc.low.toFixed(2)} C: ${ohlc.close.toFixed(2)}`, x + 10, y - 10);
            }
        });

        this.overlayCanvas.addEventListener('mouseout', () => {
            this.overlayCtx.clearRect(0, 0, this.overlayCanvas.width, this.overlayCanvas.height);
        });
    }

    /**
     * Adds event listeners for scrolling and zooming functionality.
     */
    addEventListeners() {
        document.querySelector('.chart-container').addEventListener('wheel', (event) => {
            event.preventDefault();
            const zoomFactor = 1.1;
            if (event.deltaY < 0) {
                this.stockCanvas.width *= zoomFactor;
            } else {
                this.stockCanvas.width /= zoomFactor;
            }
            this.plotChart(true);
        });
    }
}

// Initialize the stock chart when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    new StockChart('chart.csv', 'stockChart', 'overlay');
});






