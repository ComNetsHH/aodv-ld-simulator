clear all;
close all;


pathDurationsAODV = getData('../results/vbm/west/aodv/pathDurations-2h-0.json');
pathDurationsAODVLDD = getData('../results/vbm/west/aodv-ld-d/pathDurations-2h-0.json');
pathDurationsAODVLDS = getData('../results/vbm/west/aodv-ld-s/pathDurations-2h-0.json');

figure;
hold on;
histogram(pathDurationsAODV / 1000, 0:200:6000, 'Normalization', 'Probability');
histogram(pathDurationsAODVLDD / 1000, 0:200:6000, 'Normalization', 'Probability');
histogram(pathDurationsAODVLDS / 1000, 0:200:6000, 'Normalization', 'Probability');

%%

pathDurationsAODVLDS = getData('../results/v203/east/aodv-ld-s/pathDurations-2h-0.json');
plot(pathDurationsAODVLDS)


%%

pathDurationsAODVLDS = getData('../server_results/v303/east/aodv-ld-d/pathDurations-4h-1.json');
pathDurationsAODVLDSE = getData('../server_results/v303/east/aodv-ld-d/expectedPathDurations-4h-1.json');
figure;
hold on;
histogram(pathDurationsAODVLDS / 1000, 0:200:6000, 'Normalization', 'Probability');
histogram(pathDurationsAODVLDSE / 1000, 0:200:6000, 'Normalization', 'Probability');