clear all;
close all;

east_aodv = getCtrlOverhead('east', 'aodv');
east_aodv_ld_d = getCtrlOverhead('east', 'aodv-ld-d');
east_aodv_ld_s = getCtrlOverhead('east', 'aodv-ld-s');

figure;
hold on;
plot(east_aodv, 'o-', 'LineWidth', 2);
plot(east_aodv_ld_d, 'o-', 'LineWidth', 2);
plot(east_aodv_ld_s, 'o-', 'LineWidth', 2);
legend('AODV', 'AODV-LD-D', 'AODV-LD-S');


%%

clear all;
close all;

east_aodv = getCtrlOverhead('west', 'aodv');
east_aodv_ld_d = getCtrlOverhead('west', 'aodv-ld-d');
east_aodv_ld_s = getCtrlOverhead('west', 'aodv-ld-s');

figure;
hold on;
plot(east_aodv, 'o-', 'LineWidth', 2);
plot(east_aodv_ld_d, 'o-', 'LineWidth', 2);
plot(east_aodv_ld_s, 'o-', 'LineWidth', 2);
legend('AODV', 'AODV-LD-D', 'AODV-LD-S');