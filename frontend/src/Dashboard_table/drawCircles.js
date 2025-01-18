import React from "react";

function calculateCirclePoints(a, b, R, numPoints = 20) {
    const points = [];
    for (let i = 0; i < numPoints; i++) {
        const alpha = (2 * Math.PI * i) / numPoints;
        const x = a + R * Math.cos(alpha);
        const y = b + R * Math.sin(alpha);
        points.push({x, y, alpha});
    }
    return points;
}

function Normalization(radii, numRadii) {
    const maxValue = Math.max(...radii);
    const normalizedRadii = [];
    for (let i = 0; i < numRadii; i++) {
        const normalized = (radii[i] / maxValue) * 20 + 10;
        normalizedRadii.push({normalized});
    }
    return normalizedRadii;
}

function DrawCircle() {
    const numPoints = 20;
    const circleCenter = {x: 300 , y: 300};
    const circleRadius = 250;
    const points = calculateCirclePoints(circleCenter.x, circleCenter.y, circleRadius, numPoints);

    const sender = "Chien";
    const name = ["Olivia Carter", "Liam Johnson", "Emma Smith", "Noah Davis", "Ava Wilson", 
        "Jackson Brown", "Lam Dan", "Ethan Moore", "Isabella Taylor", "Lucas Anderson", 
        "Mia Thomas", "Aiden Jackson", "Harper White", "Mason Harris", "Amelia Clark", 
        "James Lewis", "Charlotte Walker", "Benjamin Scott", "Ella Hall", "Alexander Young"];
    const radii = [9133, 5457, 3085, 2746, 4254, 8000, 1907, 8947, 3183, 8323, 7021, 6429, 5252, 7054, 3571, 7741, 4020, 1702, 8688, 8458]
    const normalizedRadii = Normalization(radii, numPoints);

    return (
        <svg width="600" height="600">
            {points.map((point, index) => {
                const adjustedX = point.x - normalizedRadii[index].normalized * Math.cos(point.alpha);
                const adjustedY = point.y - normalizedRadii[index].normalized * Math.sin(point.alpha);

                const midX = (circleCenter.x + point.x) / 2;
                const midY = (circleCenter.y + point.y) / 2;

                // Measure the length of the text (approximation)
                const textLength = radii[index].toString().length * 7; // Rough estimate for text width

                // Add some padding for the background
                const padding = 4;
                const rectWidth = textLength + padding;
                const rectHeight = 18; // Set a fixed height for the background rectangle

                return (
                    <g className="child-nodes" key={index}>
                        <circle cx={point.x} cy={point.y} r={normalizedRadii[index].normalized} fill="none" stroke="black" strokeWidth={3} />
                        <line x1={circleCenter.x} y1={circleCenter.y} x2={adjustedX} y2={adjustedY} stroke="black" strokeWidth={3}/>
                        <rect x={midX - rectWidth / 2} y={midY - rectHeight / 2} width={rectWidth} height={rectHeight} fill="#845fff" />
                        <text x={midX} y={midY} fontSize="13" fill="black" textAnchor="middle" alignmentBaseline="middle">
                            {radii[index]}
                        </text>
                        <text x={point.x+5} y={point.y-37} fontSize="13" fill="black" textAnchor="middle" alignmentBaseline="middle">
                            {name[index]}
                        </text>
                    </g>
                )
            })}
            <circle id="main-circle" cx={300} cy={300} r={30} fill="black" />
            <text id="sender" x="300" y="300" fontSize="15" fill="black" textAnchor="middle" alignmentBaseline="middle">{sender}</text>
        </svg>
    );
}

export default DrawCircle