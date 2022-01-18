import LifecycleCost from './AERO401/Slide4.png'
import NASAModel from './AERO401/Slide3.png'
import Approaches from './AERO401/Slide5.png'



export function get_slide_src(src){
    if(src === 'LifecycleCost'){
        return LifecycleCost;
    }
    else if(src === 'NASAModel'){
        return NASAModel;
    }
    else if(src === 'Approaches'){
        return Approaches;
    }
}
