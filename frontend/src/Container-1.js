import './Container-1.css';
import container1 from './asset/container_1.jpg' 

function Container1() {
    return (
        <div className="container-1">
            <div className="container-1-content">
                <p id="main-content">
                    EXPLORING <br/> EVERY TRANSACTION <br/> WITH US
                </p>
                <p id="supporting-content">
                    Trace and visualize transactions on the blockchain <br/>
                    with powerful insights and analytics.
                </p>
            </div>
            <div>
                <img id="container-1-img" src={container1} alt="container_1" />
            </div>
            <label for="check" class="open-menu"><i class="fas fa-bars"></i></label>
            <label for="check" class="close-menu"><i class="fas fa-times"></i></label>
        </div>
    )
}

export default Container1