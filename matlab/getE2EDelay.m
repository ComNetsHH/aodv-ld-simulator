function delay = getE2EDelay(dir, type, v)
delay = [];
for i=0:72
    try
        data = getData(['../server_results/v' v '/' dir '/' type '/e2eDelays-4h-' num2str(i) '.json']);
        delay(end+1) = mean(data(data < 1000));
    catch
    end
end
end

