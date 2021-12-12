import fs from 'fs';

const v = 401;

function getData(direction, mode) {
    let data = [];

    for (let d = 0; d <= 9; d++) {
        const dailyDataString = fs.readFileSync(`./server_results/v${v}/${direction}/aodv/linkDurations${mode}-6h-${d}.json`, 'utf-8');
        const dailyData = JSON.parse(dailyDataString);
        data = [...data, ...dailyData];
    }

    return data;
}

function getPdf(data, tMin = 0, tMax = 18000 * 1000, deltaT = 60 * 1000) {
    const size = data.length;
    const pdf = [];
    for (let t = tMin; t <= tMax; t += deltaT) {
        const count = data.filter(d => d >= t && d < t + deltaT).length;
        pdf.push({
            t,
            p: count / size
        });
    }

    return pdf;
}

async function main(dir, mode) {
    const data = getData(dir, mode);
    const pdf = getPdf(data, 0, 18000 * 1000, 120 * 1000);
    fs.writeFileSync(`./src/data/link_durations_${mode}_${dir}_380_min_v2.json`, JSON.stringify(pdf));
}

main('east', 'A2A');
main('east', 'A2G');
main('west', 'A2A');
main('west', 'A2G');
