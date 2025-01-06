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
        this.dragState = {
            isDragging: false,
            currentFret: null,
            currentElement: null
        };
        this.svg_state = [];

        this.init();
        this.setupDragAndDrop();
    }
    setupDragAndDrop() {
        // Make fret buttons draggable
        const buttons = this.settings.getElementsByClassName('fret-button');
        Array.from(buttons).forEach(button => {
            button.draggable = true;
            button.addEventListener('dragstart', (e) => this.handleDragStart(e));
            button.addEventListener('dragend', () => this.handleDragEnd());
        });

        // Make SVG areas droppable
        this.container.addEventListener('dragover', (e) => this.handleDragOver(e));
        this.container.addEventListener('drop', (e) => this.handleDrop(e));
    }

    handleDragStart(e) {
        this.dragState.isDragging = true;
        this.dragState.currentFret = e.target.dataset.fret;
        e.dataTransfer.setData('text/plain', e.target.dataset.fret);
        e.dataTransfer.effectAllowed = 'move';
    }

    handleDragEnd() {
        this.dragState.isDragging = false;
        this.dragState.currentFret = null;
    }

    handleDragOver(e) {
        e.preventDefault();
        if (this.dragState.isDragging) {
            // Show visual feedback
            const position = this.calculateNotePosition(e);
            this.showDropPreview(position);
        }
    }

    handleDrop(e) {
        e.preventDefault();
        const fret = e.dataTransfer.getData('text/plain');
        const position = this.calculateNotePosition(e);
        if (position) {
            this.addNote(position.measureIndex, position.stringIndex, fret, position.x);
        }
        
        this.hideDropPreview();
    }

    calculateNotePosition(e) {
        const rect = this.container.getBoundingClientRect();
        const mouseY = e.clientY - rect.top;
        const mouseX = e.clientX - rect.left;
    
        // Snap to nearest line position
        const measureHeight = this.options.fretHeight + 10;
        const measureIndex = Math.floor(mouseY / measureHeight);
        const relativeY = mouseY % measureHeight;
        const stringIndex = Math.round(relativeY / this.options.spaceBetweenStrings);
    
        // Snap X to a grid
        const gridSize = 40; // Adjust this value to change horizontal spacing
        const snappedX = Math.round(mouseX / gridSize) * gridSize;
    
        return {
            measureIndex,
            stringIndex,
            x: snappedX,
            y: relativeY
        };
    }

    addNote(measureIndex, stringIndex, fret, x) {
        if (measureIndex < 0 || measureIndex >= this.options.measures ||
            stringIndex < 0 || stringIndex >= this.options.lines) {
            return;
        }

        const svg = this.container.getElementsByClassName(this.options.svgClass)[measureIndex];
        
        // Create note circle
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", x);
        circle.setAttribute("cy", stringIndex * this.options.spaceBetweenStrings);
        circle.setAttribute("r", 10);
        circle.setAttribute("fill", "#000");

        // Create text for fret number
        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute("x", x);
        text.setAttribute("y", stringIndex * this.options.spaceBetweenStrings + 5);
        text.setAttribute("text-anchor", "middle");
        text.setAttribute("fill", "white");
        text.setAttribute("font-size", "12px");
        text.textContent = fret;

        svg.appendChild(circle);
        svg.appendChild(text);

        // Store note in state
        this.svg_state[measureIndex].tabs.push({
            stringIndex,
            fret,
            x,
            elements: { circle, text }
        });
    }

    showDropPreview(position) {
        // Remove existing preview
        this.hideDropPreview();

        if (position.measureIndex >= 0 && position.stringIndex >= 0) {
            const preview = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            preview.setAttribute("cx", position.x);
            preview.setAttribute("cy", position.stringIndex * this.options.spaceBetweenStrings);
            preview.setAttribute("r", 10);
            preview.setAttribute("fill", "rgba(0,0,0,0.2)");
            preview.classList.add("drop-preview");

            const svg = this.container.getElementsByClassName(this.options.svgClass)[position.measureIndex];
            svg.appendChild(preview);
        }
    }

    hideDropPreview() {
        const previews = this.container.getElementsByClassName("drop-preview");
        Array.from(previews).forEach(preview => preview.remove());
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
