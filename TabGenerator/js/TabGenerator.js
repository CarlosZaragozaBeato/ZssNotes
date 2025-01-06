class TabGenerator{
    constructor(containerId, options={}){
        this.containerId = document.getElementById(containerId);
        this.options = {
            lines: 6,
            ...options
        };
        
        this.state = {
            tabs: []
        };
        this.init();
    }

    init(){
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
        this.render();
    }
    
    createEmptyTab() {
        // Initialize empty tab structure with measures
        for (let i = 0; i < this.options.strings; i++) {
            this.state.tabs[i] = Array(this.options.measures).fill().map(() => ({
                notes: [] // We will dynamically add notes
            }));
        }
    }

    render(){
                // Clear the SVG
                this.svg.innerHTML = '';
                // // Calculate the total width of the grid (based on the number of measures)
                // const totalWidth = this.options.fretWidth * 5 * this.options.measures;
        
                // // Draw the guitar strings (horizontal lines)
                // for (let i = 0; i < this.options.strings; i++) {
                //     const y = i * this.options.spaceBetweenStrings;
                //     const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
                //     line.setAttribute('x1', 0);
                //     line.setAttribute('y1', y);
                //     line.setAttribute('x2', totalWidth);
                //     line.setAttribute('y2', y);
                //     line.setAttribute('stroke', '#000');
                //     line.setAttribute('stroke-width', '2');
                //     this.svg.appendChild(line);
                // }
        
                // // Draw the notes on the grid
                // for (let string = 0; string < this.options.strings; string++) {
                //     const tab = this.state.tabs[string][this.state.currentMeasure];
        
                //     tab.notes.forEach((note, i) => {
                //         if (note.fret !== null) {
                //             const x = i * this.options.fretWidth + 10; // Horizontal positioning of the note
                //             const y = string * this.options.spaceBetweenStrings;
        
                //             const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                //             circle.setAttribute('cx', x);
                //             circle.setAttribute('cy', y);
                //             circle.setAttribute('r', 10);
                //             circle.setAttribute('fill', 'blue');
                //             circle.setAttribute('data-note', note.fret);
        
                //             this.svg.appendChild(circle);
        
                //             // Draw the fret number above the circle
                //             const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
                //             text.setAttribute('x', x);
                //             text.setAttribute('y', y - 10);
                //             text.setAttribute('text-anchor', 'middle');
                //             text.setAttribute('font-size', '14');
                //             text.setAttribute('fill', '#000');
                //             text.textContent = note.fret;
                //             this.svg.appendChild(text);
                //         }
                //     });
                // }
        
                // // Draw the feedback for the currently dragged note
                // if (this.state.isDragging && this.state.dragPosition) {
                //     const feedbackCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                //     feedbackCircle.setAttribute('cx', this.state.dragPosition.x);
                //     feedbackCircle.setAttribute('cy', this.state.dragPosition.y);
                //     feedbackCircle.setAttribute('r', 10);
                //     feedbackCircle.setAttribute('fill', 'red');
                //     feedbackCircle.setAttribute('stroke', 'black');
                //     feedbackCircle.setAttribute('stroke-width', '2');
                //     this.svg.appendChild(feedbackCircle);
                // }
    }
}