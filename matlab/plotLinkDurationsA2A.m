clear all;
close all;

east_aodv = getLinkDurationsA2A('east', 'aodv');
east_aodv_ld_d = getLinkDurationsA2A('east', 'aodv-ld-d');
east_aodv_ld_s = getLinkDurationsA2A('east', 'aodv-ld-s');

figure;
hold on;
plot(east_aodv, 'o-', 'LineWidth', 2);
plot(east_aodv_ld_d, 'o-', 'LineWidth', 2);
plot(east_aodv_ld_s, 'o-', 'LineWidth', 2);

legend('AODV', 'AODV-LD-D', 'AODV-LD-S');


%%

clear all;
close all;

east_aodv = getLinkDurationsA2A('west', 'aodv');
east_aodv_ld_d = getLinkDurationsA2A('west', 'aodv-ld-d');
east_aodv_ld_s = getLinkDurationsA2A('west', 'aodv-ld-s');

figure;
hold on;
plot(east_aodv, 'o-', 'LineWidth', 2);
plot(east_aodv_ld_d, 'o-', 'LineWidth', 2);
plot(east_aodv_ld_s, 'o-', 'LineWidth', 2);

legend('AODV', 'AODV-LD-D', 'AODV-LD-S');