
export default class TrajectoryService {
    static getTrajectories(direction, day) {
        const data = require(`../../input/${direction}-8h-${day}-motion.json`);
        return data;
    }
}