function hops = getNumHops(dir, type, v)
hops = [];
for i=0:72
    try
        h=[];
        data = getData(['../server_results/v' v '/' dir '/' type '/establishedPaths-4h-' num2str(i) '.json']);
        for j = 1:length(data)
            h(end+1) = length(data(j).path) -1;
        end
        hops(end+1) = mean(h);
    catch
    end
end
end

