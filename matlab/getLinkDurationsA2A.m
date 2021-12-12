function d = getLinkDurationsA2A(dir, type, v)
d = [];
for i=0:9
    try
        data = getData(['../server_results/v' v '/' dir '/' type '/linkDurationsA2A-6h-' num2str(i) '.json']);
        d = [d; data];
    catch
    end
end
end

