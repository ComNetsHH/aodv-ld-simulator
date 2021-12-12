import MathUtils from "./MathUtils";

import linkDurationPdfA2AEast400 from '../data/link_durations_A2A_east_min_v2.json';
import linkDurationPdfA2GEast400 from '../data/link_durations_A2G_east_min_v2.json';
import linkDurationPdfA2AWest400 from '../data/link_durations_A2A_west_min_v2.json';
import linkDurationPdfA2GWest400 from '../data/link_durations_A2G_west_min_v2.json';

import linkDurationPdfA2AEast180 from '../data/link_durations_A2A_east_180_min_v2.json';
import linkDurationPdfA2GEast180 from '../data/link_durations_A2G_east_180_min_v2.json';
import linkDurationPdfA2AWest180 from '../data/link_durations_A2A_west_180_min_v2.json';
import linkDurationPdfA2GWest180 from '../data/link_durations_A2G_west_180_min_v2.json';

import linkDurationPdfA2AEast380 from '../data/link_durations_A2A_east_380_min_v2.json';
import linkDurationPdfA2GEast380 from '../data/link_durations_A2G_east_380_min_v2.json';
import linkDurationPdfA2AWest380 from '../data/link_durations_A2A_west_380_min_v2.json';
import linkDurationPdfA2GWest380 from '../data/link_durations_A2G_west_380_min_v2.json';

import linkDurationPdfA2AEast800 from '../data/link_durations_A2A_east_800_min_v2.json';
import linkDurationPdfA2GEast800 from '../data/link_durations_A2G_east_800_min_v2.json';
import linkDurationPdfA2AWest800 from '../data/link_durations_A2A_west_800_min_v2.json';
import linkDurationPdfA2GWest800 from '../data/link_durations_A2G_west_800_min_v2.json';


const PDFs = {
    linkDurationPdfA2AEast180,
    linkDurationPdfA2GEast180,
    linkDurationPdfA2AWest180,
    linkDurationPdfA2GWest180,
    linkDurationPdfA2AEast400,
    linkDurationPdfA2GEast400,
    linkDurationPdfA2AWest400,
    linkDurationPdfA2GWest400,
    linkDurationPdfA2AEast380,
    linkDurationPdfA2GEast380,
    linkDurationPdfA2AWest380,
    linkDurationPdfA2GWest380,
    linkDurationPdfA2AEast800,
    linkDurationPdfA2GEast800,
    linkDurationPdfA2AWest800,
    linkDurationPdfA2GWest800
}


const getPdf = (radioRange, mode, direction) => {

    const dir = direction === 'EAST' ? 'East' : 'West';
    const r = radioRange / 1000;
    const key = `linkDurationPdf${mode}${dir}${r}`;
    return PDFs[key];
}

const ACCURACY = 60000;

const cache = {
    set: () => null,
    get: () => null
}; //new Map();

const getKey = (a2a, a2g) => {
    const keys = a2a.map(a => Math.round(a / ACCURACY) * ACCURACY).sort();
    let key = keys.join('-');
    if (a2g) {
        const t = Math.round(a2g / ACCURACY) * ACCURACY;
        key += `a2g_${t}`;
    }

    return key;
}
export default class PathDurationUtils {

    static getResidualA2ALinkDurationPdf(linkDuration, direction, radioRange = 400000) {
        const t = Math.round(linkDuration / ACCURACY) * ACCURACY;
        const key = `a2a-${t}`;
        let result = cache.get(key);
        if (result) {
            return result;
        }
        const pdf = getPdf(radioRange, 'A2A', direction);
        result = PathDurationUtils.getResidualLinkDurationPdf(linkDuration, pdf);
        cache.set(key, result);
        return result;
    }

    static getResidualA2GLinkDurationPdf(linkDuration, direction, radioRange = 400000) {
        const t = Math.round(linkDuration / ACCURACY) * ACCURACY;
        const key = `a2g-${t}`;
        let result = cache.get(key);
        if (result) {
            return result;
        }
        const pdf = getPdf(radioRange, 'A2G', direction);
        result = PathDurationUtils.getResidualLinkDurationPdf(linkDuration, pdf);
        cache.set(key, result);
        return result;
    }

    static getResidualLinkDurationPdf(linkDuration, pdf) {
        const residualPdf = [];
        const c = linkDuration;

        for (let i = 0; i < pdf.length; i++) {
            const { t } = pdf[i];
            const p = PathDurationUtils.getPdfValue(pdf, t + c) * (t + c);
            residualPdf.push({
                t,
                p
            });
        }

        return PathDurationUtils.normalizePdf(residualPdf);
    }

    static normalizePdf(pdf) {
        const sum = MathUtils.sum(pdf.map(e => e.p));
        if (sum === 0) {
            return pdf;
        }
        return pdf.map(entry => ({
            ...entry,
            p: entry.p / sum
        }));
    }

    static getPdfValue(pdf, t) {
        const maxT = Math.max(...pdf.map(e => e.t));
        if (t >= maxT) {
            return 0;
        }
        const upIdx = pdf.findIndex(entry => entry.t > t);
        const up = pdf[upIdx];
        const downIdx = upIdx - 1;
        const down = pdf[downIdx];
        return down.p + (up.p - down.p) * (t - down.t) / (up.t - down.t)
    }

    static getCdfValue(pdf, t) {
        const startIdx = pdf.findIndex(entry => entry.t > t);
        let sum = 0;
        for (let i = 0; i < startIdx; i++) {
            sum += pdf[i].p;
        }

        return sum;
    }

    static getCcdfValue(pdf, t) {
        return 1 - PathDurationUtils.getCdfValue(pdf, t);
    }


    static getExpectedValue(pdf) {
        let sum = 0;
        for (let i = 0; i < pdf.length; i++) {
            sum += pdf[i].t * pdf[i].p;
        }

        return sum;
    }


    static getExpectedResidualPathDuration(a2aLinks, a2gLink, direction, radioRange) {
        // if (a2gLink && a2gLink <= 1000) {
        //     console.log(a2gLink);
        //     return 1;
        // }
        a2gLink = a2gLink ? Math.max(0, a2gLink) : null;
        const key = getKey(a2aLinks, a2gLink);
        const cached = cache.get(key);
        if (cached) {
            return cached;
        }
        const pdfs = [];
        if (a2gLink !== null) {
            const pdf = PathDurationUtils.getResidualA2GLinkDurationPdf(a2gLink, direction, radioRange);
            pdfs.push(pdf)
        }
        a2aLinks.forEach(ld => {
            const pdf = PathDurationUtils.getResidualA2ALinkDurationPdf(ld, direction, radioRange);
            pdfs.push(pdf)
        });


        const totalPdf = pdfs[0].map(({ t }) => {
            let p = 0;
            for (let i = 0; i < pdfs.length; i++) {
                const p1 = PathDurationUtils.getPdfValue(pdfs[i], t);
                let p2 = 1;
                for (let j = 0; j < pdfs.length; j++) {
                    if (i == j) {
                        continue;
                    }
                    p2 *= PathDurationUtils.getCcdfValue(pdfs[j], t)
                }
                p += p1 * p2;
            }

            return {
                t,
                p
            }
        });

        const v = PathDurationUtils.getExpectedValue(PathDurationUtils.normalizePdf(totalPdf));
        cache.set(key, v);
        return v;

    }
}