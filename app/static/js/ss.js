class TabGenerator {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        this.options = {
            strings: 6,
            measures: 4,  // Initial number of measures
            spaceBetweenStrings: 50,  // Space between strings (in pixels)
            fretWidth: 40,  // Width of each fret (in pixels)
            fretHeight: 400, // Height of the fretboard area
            fontSize: 14, // Font size for note labels
            ...options
        };

        this.state = {
            tabs: [],
            currentMeasure: 0,
            isDragging: false,
            dragNote: null,
            dragPosition: null
        };

        this.init();
        this.setupDragAndDrop();
    }

    init() {
        this.container.style.position = 'relative';
        this.container.style.fontFamily = 'monospace';
        this.container.style.fontSize = `${this.options.fontSize}px`;
        this.container.style.userSelect = 'none';

        // Create SVG for the guitar tab
        this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        this.svg.setAttribute('width', '100%');
        this.svg.setAttribute('height', this.options.fretHeight);
        this.container.appendChild(this.svg);

        this.createEmptyTab();
        this.createNoteSelector();
        this.createAddMeasureButton();
        this.render();
    }

    createNoteSelector() {
        // Create a palette for notes (0-24 frets)
        const palette = document.createElement('div');
        palette.className = 'note-palette';
        palette.style.cssText = `
            position: absolute;
            top: -50px;
            left: 0;
            display: flex;
            gap: 10px;
            background: #f0f0f0;
            padding: 10px;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        `;

        // Add draggable notes (0-24 frets)
        for (let i = 0; i <= 24; i++) {
            const note = document.createElement('div');
            note.className = 'draggable-note';
            note.textContent = i;
            note.draggable = true;
            note.style.cssText = `
                cursor: move;
                padding: 5px 10px;
                background: white;
                border: 1px solid #ccc;
                border-radius: 3px;
                display: inline-block;
            `;

            note.addEventListener('dragstart', (e) => {
                this.state.isDragging = true;
                this.state.dragNote = i;
                e.dataTransfer.setData('text/plain', i.toString());
                e.dataTransfer.effectAllowed = 'move';
                note.style.opacity = '0.5';  // Visual feedback during drag
            });

            note.addEventListener('dragend', () => {
                this.state.isDragging = false;
                this.state.dragNote = null;
                note.style.opacity = '1';  // Reset opacity after drag ends
            });

            palette.appendChild(note);
        }

        this.container.appendChild(palette);
    }

    createAddMeasureButton() {
        const addButton = document.createElement('button');
        addButton.innerText = 'Add Measure';
        addButton.style.cssText = 'position: absolute; bottom: 10px; left: 10px; padding: 10px 20px;';
        addButton.addEventListener('click', () => this.addMeasure());
        this.container.appendChild(addButton);
    }

    setupDragAndDrop() {
        // Set up the SVG to capture the drag-and-drop actions
        this.svg.addEventListener('dragover', (e) => {
            e.preventDefault();
            if (this.state.isDragging) {
                const rect = this.svg.getBoundingClientRect();
                this.state.dragPosition = {
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top
                };
                this.render(); // Update the visual feedback for the drag
            }
        });

        this.svg.addEventListener('drop', (e) => {
            e.preventDefault();
            if (this.state.isDragging && this.state.dragPosition) {
                // Calculate which string and fret the note was dropped onto
                const fret = Math.floor(this.state.dragPosition.x / this.options.fretWidth);
                const string = Math.floor(this.state.dragPosition.y / this.options.spaceBetweenStrings);
                this.addNote(string, this.state.dragNote, fret);
            }
        });
    }

    createEmptyTab() {
        // Initialize empty tab structure with measures
        for (let i = 0; i < this.options.strings; i++) {
            this.state.tabs[i] = Array(this.options.measures).fill().map(() => ({
                notes: [] // We will dynamically add notes
            }));
        }
    }

    addNote(string, fret, position) {
        if (string < 0 || string >= this.options.strings || fret < 0 || fret > 24) return;

        const measure = this.state.currentMeasure;
        if (measure >= this.options.measures) return;

        // Adding note as an object with specific position (fret number)
        this.state.tabs[string][measure].notes.push({
            fret: fret,
            position: position
        });

        this.render(); // Re-render the tab after adding the note
    }

    addMeasure() {
        this.options.measures++;
        for (let i = 0; i < this.options.strings; i++) {
            this.state.tabs[i].push({
                notes: [] // New empty notes array for the measure
            });
        }
        this.render();
    }

    render() {
        // Clear the SVG
        this.svg.innerHTML = '';

        // Calculate the total width of the grid (based on the number of measures)
        const totalWidth = this.options.fretWidth * 5 * this.options.measures;

        // Draw the guitar strings (horizontal lines)
        for (let i = 0; i < this.options.strings; i++) {
            const y = i * this.options.spaceBetweenStrings;
            const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
            line.setAttribute('x1', 0);
            line.setAttribute('y1', y);
            line.setAttribute('x2', totalWidth);
            line.setAttribute('y2', y);
            line.setAttribute('stroke', '#000');
            line.setAttribute('stroke-width', '2');
            this.svg.appendChild(line);
        }

        // Draw the notes on the grid
        for (let string = 0; string < this.options.strings; string++) {
            const tab = this.state.tabs[string][this.state.currentMeasure];

            tab.notes.forEach((note, i) => {
                if (note.fret !== null) {
                    const x = i * this.options.fretWidth + 10; // Horizontal positioning of the note
                    const y = string * this.options.spaceBetweenStrings;

                    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                    circle.setAttribute('cx', x);
                    circle.setAttribute('cy', y);
                    circle.setAttribute('r', 10);
                    circle.setAttribute('fill', 'blue');
                    circle.setAttribute('data-note', note.fret);

                    this.svg.appendChild(circle);

                    // Draw the fret number above the circle
                    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
                    text.setAttribute('x', x);
                    text.setAttribute('y', y - 10);
                    text.setAttribute('text-anchor', 'middle');
                    text.setAttribute('font-size', '14');
                    text.setAttribute('fill', '#000');
                    text.textContent = note.fret;
                    this.svg.appendChild(text);
                }
            });
        }

        // Draw the feedback for the currently dragged note
        if (this.state.isDragging && this.state.dragPosition) {
            const feedbackCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            feedbackCircle.setAttribute('cx', this.state.dragPosition.x);
            feedbackCircle.setAttribute('cy', this.state.dragPosition.y);
            feedbackCircle.setAttribute('r', 10);
            feedbackCircle.setAttribute('fill', 'red');
            feedbackCircle.setAttribute('stroke', 'black');
            feedbackCircle.setAttribute('stroke-width', '2');
            this.svg.appendChild(feedbackCircle);
        }
    }
}
