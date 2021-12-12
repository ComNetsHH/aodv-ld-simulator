import PositionUtils from '../utils/PositionUtils';

async function main() {
    const p1 = {
        x: 0,
        y: 0,
        z: 0
    }
    const p2 = {
        x: 100000,
        y: 100000,
        z: 100000
    }

    const v1 = {
        x: 100,
        y: 200,
        z: 200
    }

    const v2 = {
        x: -100,
        y: 0,
        z: 0
    }

    const t = PositionUtils.getLinkDuration(p1, p2, v1, v2);

    console.log(t == 2000)
}

async function westTest() {
    const data = {
        positions:
        [ { x: 3906154.125898066,
            y: -369059.59933471016,
            z: 5024359.066552664 },
          { x: 3626571.7420782223,
            y: -295277.1697560003,
            z: 5233050.141573978 },
          { x: 3367133.3330645827,
            y: -562542.5462306212,
            z: 5381392.834003174 } ],
       velocities:
        [ { x: 0.058861647430923765,
            y: 0.2074335359075349,
            z: -0.030602073770404484 },
          { x: 0.06620254646683267,
            y: 0.20733471648696578,
            z: -0.03422827980554042 },
          { x: 0.10475438568890094,
            y: 0.1547557227329254,
            z: -0.049244323625663916 } ]
    }

    console.log(PositionUtils.norm(PositionUtils.diff(data.positions[1], data.positions[2])));
    //console.log(PositionUtils.getLinkDuration(data.positions[0], data.positions[1], data.velocities[0], data.velocities[1]));
    console.log(PositionUtils.getLinkDuration(data.positions[1], data.positions[2], data.velocities[1], data.velocities[2]));

}

westTest();