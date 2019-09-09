function createConfigurationParameters(numRows, numColumns) {

    const configAttributes = {
        svg_width: 800,
        svg_height: 800,
        margins: {
            left: 20,
            right: 20,
            top: 50,
            bottom: 30
        },
        svg_margins: {
            top: 100,
            left: 100
        },

        board_cell_size: 40,
        board_cell_gap: 5,
        board_cell_stroke: 'darkgrey',
        board_cell_fill: 'white',
        main_board_stroke: 'black',
        mine_circle_radius: 8,
        mine_size: 5,
    };

    configAttributes['svg_width'] = configAttributes.margins.left + configAttributes.margins.right +
        (configAttributes.board_cell_size + configAttributes.board_cell_gap) * numRows;
    configAttributes['svg_height'] = configAttributes.margins.top + configAttributes.margins.bottom +
        (configAttributes.board_cell_size + configAttributes.board_cell_gap) * numColumns;

    return configAttributes;
}


function playMinesweeper(rows, columns, percentageOfMines) {
    // create a two dimensional array with "rows" rows and "columns" columns.
    const board = d3.range(rows).map(d => []).map((row, i) => {
        return d3.range(columns).map((col, j) => ({
            row: i,
            column: j,
            adjacent_mines: 0,
            is_mine_cell: Math.random() <= percentageOfMines
        }))
    });


    const numMines = board.reduce((rowAccu, row) => rowAccu + row.reduce((colAccu, v) => colAccu + (v.is_mine_cell ? 1 : 0), 0), 0);
    console.log(`${numMines} mines were added to the board.`);

    const configAttrs = createConfigurationParameters(rows, columns);
    // create the main svg

    const svg = d3.select('body')
        .append('svg')
        .attr('class', 'main-svg')
        .attr('width', configAttrs.svg_width)
        .attr('height', configAttrs.svg_height)
        .attr('transform', `translate(${configAttrs.svg_margins.left}, ${configAttrs.svg_margins.top})`);


    // create the board

    const rowGroups = svg
        .selectAll('.row-group')
        .data(board)
        .enter()
        .append('g')
        .attr('class', 'row-group')
        .attr('transform', (d, i) => `translate(${configAttrs.margins.left}, 
                    ${configAttrs.margins.top + i * (configAttrs.board_cell_size + configAttrs.board_cell_gap)})`);

    const allCells = rowGroups.selectAll('.board-cell')
        .data(d => d)
        .enter()
        .append('g')
        .attr('class', d => `board-cell board-cell-g-${d.row}-${d.column}`)
        .attr('transform', (d, i) => `translate(${i * (configAttrs.board_cell_size + configAttrs.board_cell_gap)}, 0)`);


    // append rectangles and add click handlers.
    allCells.append('rect')
        .attr('width', configAttrs.board_cell_size)
        .attr('height', configAttrs.board_cell_size)
        .attr('stroke', configAttrs.board_cell_stroke)
        .attr('fill', configAttrs.board_cell_fill)
        .attr('class', 'board-rect')
        .on("click", function(d) {
            d3.event.preventDefault();
            d3.select(this).attr('fill', 'lightgrey');
        })
        .on("contextmenu", function(d) {  // right-click
            d3.event.preventDefault();
            const g = d3.select(`.board-cell-g-${d.row}-${d.column}`);
            g.append('path')
                .attr('d', "M 0 0 L 3 0 L 3 25 M 3 0 L 15 8 L 3 15 L 3 25 L 0 25 L 0 0")
                .attr('transform', 'translate(12, 8)')
                .attr('stroke', 'white')
                .attr('stroke-width', 1)
                .attr('fill', 'red')
                .attr('class', `flag-${d.row}-${d.column}`);

        });

    d3.selectAll('.board-rect')
        //.filter(d => d.row % 2 === 0 && d.column % 2 === 1 || d.row % 2 === 1 && d.column % 2 === 0)
        .attr('fill', 'grey');
}