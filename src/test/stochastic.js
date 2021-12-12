import PathDurationUtils from '../utils/PathDurationUtils';

import linkDurationPdfA2AEast from '../data/link_durations_A2A_east.json';
import linkDurationPdfA2GEast from '../data/link_durations_A2G_east.json';
import MathUtils from '../utils/MathUtils';


async function main() {
    // console.log(PathDurationUtils.getExpectedValue(linkDurationPdfA2GEast));
    // console.log(PathDurationUtils.getExpectedValue(linkDurationPdfA2AEast));
    for(let i = 0; i< 4000000; i+=10000) {

    console.log(PathDurationUtils.getExpectedResidualPathDuration([i], null));
    }

    //console.log(PathDurationUtils.getExpectedResidualPathDuration([], 4000000));
}

main();