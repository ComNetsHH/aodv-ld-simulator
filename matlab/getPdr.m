function pdr = getPdr(dir, type, v)
pdr = [];
for i=0:72
    try
    data = getData(['../server_results/v' v '/' dir '/' type '/summary-4h-' num2str(i) '.json']);
    if(data.packetsReceived > 0)
        pdr(end+1) = data.pdr;
    end
    catch
    end
end
end

