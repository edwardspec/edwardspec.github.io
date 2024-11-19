document.addEventListener( 'DOMContentLoaded', function () {
	const baselineResistance = 20,
		resultArea = document.getElementById( 'result' );

	let droneCount, miteCount, beeMiteResistance, frameResistance, biomeLikeness, numTicks,
		totalResistance;

	function round( val ) {
		return Math.round( 100 * val ) / 100;
	}

	function recalculate() {
		// Update variables every time the input form is changed.

		droneCount = parseInt( document.getElementById( 'droneCount' ).value );
		miteCount = parseInt( document.getElementById( 'miteCount' ).value );
		beeMiteResistance = parseFloat( document.getElementById( 'beeMiteResistance' ).value );
		frameResistance = parseFloat( document.getElementById( 'frameResistance' ).value );
		biomeLikeness = parseInt( document.getElementById( 'biomeLikeness' ).value );
		numTicks = parseInt( document.getElementById( 'numTicks' ).value );

		let result = '<b>Baseline Resistance(%)</b> = ' + baselineResistance;

		let totalBaseResistance = baselineResistance * biomeLikeness;
		result += '<br><b>Total Base Resistance(%)</b> = <code>baselineResistance * biomeLikeness</code> = ' + totalBaseResistance;

		let droneCountMaxBonus = droneCount / 100;
		result += '<br><b>Drone Count Maximum Bonus(%)</b> = <code>droneCount / 100</code> = ' + droneCountMaxBonus;

		let beeAndFrameResists = beeMiteResistance + frameResistance;
		result += '<br><b>Bee&Frame Resists(%)</b> = <code>beeMiteResistance + frameResistance</code> = ' + beeAndFrameResists;

		totalResistance = totalBaseResistance + droneCountMaxBonus + beeAndFrameResists;
		result += '<br><b>Total Resistance(%)</b> = <code>totalBaseResistance + droneCountMaxBonus + beeAndFrameResists</code> = ' + totalResistance;

		result += '<br><br>Simulated events:'
		result += '<br>On every tick, there is a <span style="color:green">' + totalResistance + '%</span> chance for miteCount to be decreased by beeMiteResistance=' + beeMiteResistance;
		result += '<br>On every tick, there is a <span style="color:red">' + round( 100.0 - totalResistance ) + '%</span> chance for miteCount to be increased by <code>max(1, 0.05*miteCount)</code>';
		resultArea.innerHTML = result;
	}

	function runSimulation() {
		recalculate();

		// Make the graph of mite growth over time.
		let xValues = [];
		let yValues = [];

		let successRoll = 0.01 * totalResistance; // Number between 0 and 1
		for ( let tick = 1; tick <= numTicks; tick++ ) {
			if ( Math.random() < successRoll ) {
				// Lucky roll: reduction of mites.
				miteCount -= beeMiteResistance;
				if ( miteCount < 0 ) {
					miteCount = 0;
				}
			} else {
				// Unlucky roll: increased mites.
				miteCount += Math.max( 1, 0.05 * miteCount );
			}

			xValues.push( tick );
			yValues.push( round( miteCount ) );
		}


		let oldChart = Chart.getChart('resultChart')
		if ( oldChart ) {
			oldChart.destroy();
		}

		new Chart( 'resultChart', {
			type: 'line',
			data: {
				labels: xValues,
				datasets: [ {
					borderColor: "#f00",
					data: yValues
				} ]
			},
			options: {
				plugins: {
					legend: {
						display: false
					}
				},
				title: {
					display: true,
					text: 'Mite growth',
					fontSize: 16
				},
				scales: {
					y: {
						min: 0,
						title: {
							display: true,
							text: 'Number of mites'
						}
					},
					x: {
						title: {
							display: true,
							text: 'Time (number of ticks)'
						}
					}
				}
			}
		} );
	};

	recalculate();
	document.forms[0].addEventListener( 'change', recalculate );

	runSimulation();
	document.getElementById( 'runSimulation' ).onclick = runSimulation;
} );
