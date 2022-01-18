import LifecycleCost from './AERO401/Slide4.png'
import NASAModel from './AERO401/Slide3.png'
import Approaches from './AERO401/Slide5.png'



import AERO401Slide6 from './AERO401/Slide6.png'
import AERO401Slide7 from './AERO401/Slide7.png'
import AERO401Slide30 from './AERO401/Slide30.png'



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
    else if(src === 'AERO401Slide6'){
        return AERO401Slide6;
    }
    else if(src === 'AERO401Slide7'){
        return AERO401Slide7;
    }
    else if(src === 'AERO401Slide30'){
        return AERO401Slide30;
    }

}
