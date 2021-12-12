function [pd, epd] = getAvgPathDuration(dir, type, v)
pd = [];
epd = [];
for i=0:49
        try 
        data = getData(['../server_results/v' v '/' dir '/' type '/summary-4h-' num2str(i) '.json']);
        avgPathDuration = data.avgPathDuration;
        if data.packetsReceived > 0
            pd(end+1) = avgPathDuration;
        end
        if strcmp(type, 'aodv') ~= 1   
            avgExpectedPathDuration = data.avgExpectedPathDuration;
            if data.packetsReceived > 0
                epd(end+1) = avgExpectedPathDuration;
            end
        end
        catch
        end
end
end

