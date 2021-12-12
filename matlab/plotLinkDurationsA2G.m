clear all;
close all;

east_aodv = getLinkDurationsA2G('east', 'aodv');
east_aodv_ld_d = getLinkDurationsA2G('east', 'aodv-ld-d');
east_aodv_ld_s = getLinkDurationsA2G('east', 'aodv-ld-s');

figure;
hold on;
plot(east_aodv, 'o-', 'LineWidth', 2);
plot(east_aodv_ld_d, 'o-', 'LineWidth', 2);
plot(east_aodv_ld_s, 'o-', 'LineWidth', 2);

legend('AODV', 'AODV-LD-D', 'AODV-LD-S');


%%

clear all;
close all;

east_aodv = getLinkDurationsA2G('west', 'aodv');
east_aodv_ld_d = getLinkDurationsA2G('west', 'aodv-ld-d');
east_aodv_ld_s = getLinkDurationsA2G('west', 'aodv-ld-s');

figure;
hold on;
plot(east_aodv, 'o-', 'LineWidth', 2);
plot(east_aodv_ld_d, 'o-', 'LineWidth', 2);
plot(east_aodv_ld_s, 'o-', 'LineWidth', 2);

legend('AODV', 'AODV-LD-D', 'AODV-LD-S');