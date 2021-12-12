clear all;
close all;

east_aodv = getE2EDelay('east', 'aodv');
east_aodv_ld_d = getE2EDelay('east', 'aodv-ld-d');
east_aodv_ld_s = getE2EDelay('east', 'aodv-ld-s');

figure;
hold on;
plot(east_aodv, 'o-', 'LineWidth', 2);
plot(east_aodv_ld_d, 'o-', 'LineWidth', 2);
plot(east_aodv_ld_s, 'o-', 'LineWidth', 2);
legend('AODV', 'AODV-LD-D', 'AODV-LD-S');


%%

clear all;
close all;

east_aodv = getE2EDelay('west', 'aodv');
east_aodv_ld_d = getE2EDelay('west', 'aodv-ld-d');
east_aodv_ld_s = getE2EDelay('west', 'aodv-ld-s');

figure;
hold on;
plot(east_aodv, 'o-', 'LineWidth', 2);
plot(east_aodv_ld_d, 'o-', 'LineWidth', 2);
plot(east_aodv_ld_s, 'o-', 'LineWidth', 2);
legend('AODV', 'AODV-LD-D', 'AODV-LD-S');