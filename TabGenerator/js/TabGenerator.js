class TabGenerator {
    constructor(containerId, settingsId, options = {}) {
        this.settings = document.getElementById(settingsId);
        this.container = document.getElementById(containerId);
        this.options = {
            lines: 6,
            fretWidth: 40,
            fretHeight: 200,
            measures: 0,
            spaceBetweenStrings: 50,
            svgClass: 'guitar-tab', // Default class for SVGs
            ...options,
        };

        this.state = {
            tabs: [],
        };

        this.svg_state = [];

        this.init();
    }

    init() {
        this.container.style.position = "relative";
        this.container.style.fontFamily = "monospace";
        this.container.style.userSelect = "none";

        this.createEmptyTab();
        this.generateSettings();
    }

    generateSettings() {
        // Generate buttons for frets 0 to 24
        for (let fret = 0; fret <= 24; fret++) {
            const button = document.createElement("button");
            button.textContent = `${fret}`;
            button.classList.add("fret-button");
            button.dataset.fret = fret; // Store fret number as data attribute

            // Add event listener to handle button click
            button.addEventListener("click", () => this.handleFretButtonClick(fret));

            // Append the button to the settings container
            this.settings.appendChild(button);
        }
    }

    handleFretButtonClick(fret) {
        console.log(`Fret ${fret} button clicked`);
        // Add your logic here for what happens when a fret button is clicked
    }

    createEmptyTab() {
        // Initialize empty tab structure with measures
        for (let i = 0; i < this.options.lines; i++) {
            this.state.tabs[i] = Array(this.options.measures).fill().map(() => ({
                notes: [],
            }));
        }
    }

    render() {
        // Clear the container
        this.container.innerHTML = "";

        // Render each SVG measure
        for (let measureIndex = 0; measureIndex < this.options.measures; measureIndex++) {
            this.renderMeasure(measureIndex);
        }
    }

    renderMeasure(measureIndex) {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("width", "100%");
        svg.setAttribute("height", this.options.fretHeight);
        svg.setAttribute("class", this.options.svgClass); // Add class to SVG
        svg.style.marginBottom = "10px"; // Space between SVGs

        // Calculate the total width of the grid (based on container width)
        const totalWidth = this.container.offsetWidth;

        // Draw the guitar strings (horizontal lines)
        for (let i = 0; i < this.options.lines; i++) {
            const y = i * this.options.spaceBetweenStrings;
            const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
            line.setAttribute("x1", 0);
            line.setAttribute("y1", y);
            line.setAttribute("x2", totalWidth);
            line.setAttribute("y2", y);
            line.setAttribute("stroke", "#000");
            line.setAttribute("stroke-width", "2");
            svg.appendChild(line);
        }

        this.container.appendChild(svg);
        this.svg_state.push({
            measureIndex: measureIndex,
            tabs: []
        });
    }

    addMeasure() {
        this.options.measures++;
        this.state.tabs.forEach(line => line.push({ notes: [] })); // Add an empty measure for each string
        this.renderMeasure(this.options.measures - 1); // Render only the new measure
        console.log(this.svg_state);
    }
}
