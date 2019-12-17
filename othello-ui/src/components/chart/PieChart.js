import React, { Component } from 'react';
import Chart from 'chart.js';


class PieChart extends Component {
    constructor(props) {
        super(props);

        this.state = {
            datasets: props.datasets,
            labels: props.labels,
            title: props.title,
            width: props.width
        };
    }

    componentDidMount() {
        const node = this.node;

        var myChart = new Chart(node, {
            type: "doughnut",
            data: {
                labels: this.state.labels,
                datasets: this.state.datasets
            },
            options: {
                responsive: true,
                title: {
                    text: this.state.title
                },
                legend: {
                  display: true,
                  position: "left"
                }
            }

        });
    }

    render() {
        return (
            <div>
              
              <canvas ref={node => (this.node = node)} />
            </div>
        );
    }
}

export default PieChart;
