function d = getExpectedPathDurations(dir, type, v)
d = [];
for i=0:72
    try
        data = getData(['../server_results/v' v '/' dir '/' type '/expectedPathDurations-4h-' num2str(i) '.json']);
        d = [d; data];
    catch
    end
end
end

