import '../style/HomeIntroduction.css';
import container1 from '../asset/container_1.jpg'

function Container1() {
    return (
        <div className="container-1">
            <div className="container-1-content">
                <p id="main-content">
                    <span>E</span>
                    <span>X</span>
                    <span>P</span>
                    <span>L</span>
                    <span>O</span>
                    <span>R</span>
                    <span>I</span>
                    <span>N</span>
                    <span>G</span> <br />
                    <span>E</span>
                    <span>V</span>
                    <span>E</span>
                    <span>R</span>
                    <span>Y</span> <br />
                    <span>T</span>
                    <span>R</span>
                    <span>A</span>
                    <span>N</span>
                    <span>S</span>
                    <span>A</span>
                    <span>C</span>
                    <span>T</span>
                    <span>I</span>
                    <span>O</span>
                    <span>N</span> <br />
                    <span>W</span>
                    <span>I</span>
                    <span>T</span>
                    <span>H</span>&nbsp;
                    <span>U</span>
                    <span>S</span>
                </p>
                <p id="supporting-content">
                    Trace and visualize transactions on the blockchain <br />
                    with powerful insights and analytics.
                </p>
            </div>
            <div>
                <img id="container-1-img" src={container1} alt="container_1" />
            </div>
        </div>
    )
}

export default Container1