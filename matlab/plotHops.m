clear all;
close all;

east_aodv = getNumHops('east', 'aodv');
east_aodv_ld_d = getNumHops('east', 'aodv-ld-d');
east_aodv_ld_s = getNumHops('east', 'aodv-ld-s');

figure;
hold on;
plot(east_aodv, 'o-', 'LineWidth', 2);
plot(east_aodv_ld_d, 'o-', 'LineWidth', 2);
plot(east_aodv_ld_s, 'o-', 'LineWidth', 2);

legend('AODV', 'AODV-LD-D', 'AODV-LD-S');


%%

clear all;
close all;

east_aodv = getNumHops('west', 'aodv');
east_aodv_ld_d = getNumHops('west', 'aodv-ld-d');
east_aodv_ld_s = getNumHops('west', 'aodv-ld-s');

figure;
hold on;
plot(east_aodv, 'o-', 'LineWidth', 2);
plot(east_aodv_ld_d, 'o-', 'LineWidth', 2);
plot(east_aodv_ld_s, 'o-', 'LineWidth', 2);

legend('AODV', 'AODV-LD-D', 'AODV-LD-S');