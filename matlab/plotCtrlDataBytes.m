clear all;
close all;

east_aodv = getCtrlDataBytes('east', 'aodv');
east_aodv_ld_d = getCtrlDataBytes('east', 'aodv-ld-d');
east_aodv_ld_s = getCtrlDataBytes('east', 'aodv-ld-s');

figure;
hold on;
plot(east_aodv, 'o-', 'LineWidth', 2);
plot(east_aodv_ld_d, 'o-', 'LineWidth', 2);
plot(east_aodv_ld_s, 'o-', 'LineWidth', 2);
legend('AODV', 'AODV-LD-D', 'AODV-LD-S');


%%

clear all;
close all;

east_aodv = getCtrlDataBytes('west', 'aodv');
east_aodv_ld_d = getCtrlDataBytes('west', 'aodv-ld-d');
east_aodv_ld_s = getCtrlDataBytes('west', 'aodv-ld-s');

figure;
hold on;
plot(east_aodv, 'o-', 'LineWidth', 2);
plot(east_aodv_ld_d, 'o-', 'LineWidth', 2);
plot(east_aodv_ld_s, 'o-', 'LineWidth', 2);
legend('AODV', 'AODV-LD-D', 'AODV-LD-S');