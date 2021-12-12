function ctrlData = getCtrlDataBytes(dir, type, v)
ctrlData = [];
for i=0:72
    try
        data = getData(['../server_results/v' v '/' dir '/' type '/summary-4h-' num2str(i) '.json']);
        ctrlData(end+1) = data.ctrlPacketBytes;
    catch
        ctrlData(end+1) = NaN;
    end
end
end

