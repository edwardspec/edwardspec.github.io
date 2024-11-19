

function simulateMites() {
	const baselineResistance = 20;

	function round( val ) {
		return Math.round( 100 * val ) / 100;
	}

	let resultArea = document.getElementById( 'result' ),
		droneCount = parseInt( document.getElementById( 'droneCount' ).value ),
		miteCount = parseInt( document.getElementById( 'miteCount' ).value ),
		beeMiteResistance = parseFloat( document.getElementById( 'beeMiteResistance' ).value ),
		frameResistance = parseFloat( document.getElementById( 'frameResistance' ).value ),
		biomeLikeness = parseInt( document.getElementById( 'biomeLikeness' ).value ),
		numTicks = parseInt( document.getElementById( 'numTicks' ).value );

	let result = '';
	result += '<br>Baseline Resistance(%) = ' + baselineResistance;

	let totalBaseResistance = baselineResistance * biomeLikeness;
	result += '<br>Total Base Resistance(%) = baselineResistance*biomeLikeness = ' + totalBaseResistance;

	let droneCountMaxBonus = droneCount / 100;
	result += '<br>Drone Count Maximum Bonus(%) = droneCount/100 = ' + droneCountMaxBonus;

	let beeAndFrameResists = beeMiteResistance + frameResistance;
	result += '<br>Bee&Frame Resists(%) = beeMiteResistance+frameResistance = ' + beeAndFrameResists;

	window.a = [ totalBaseResistance, droneCountMaxBonus, beeAndFrameResists ];

	let totalResistance = totalBaseResistance + droneCountMaxBonus + beeAndFrameResists;
	result += '<br>Total Resistance(%) = totalBaseResistance+droneCountMaxBonus+beeAndFrameResists=' + totalResistance;

	result += '<br><br>Simulated events:'
	result += '<br>On every tick, there is a ' + totalResistance + '% chance for miteCount to be decreased by beeMiteResistance=' + beeMiteResistance;
	result += '<br>On every tick, there is a ' + round( 100.0 - totalResistance ) + '% chance for miteCount to be increased by max(1, 0.05*miteCount)';
	resultArea.innerHTML = result;

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
			legend: { display: false },
			title: {
				display: true,
				text: 'Mite growth',
				fontSize: 16
			},
			scales: {
				y: {
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
}
