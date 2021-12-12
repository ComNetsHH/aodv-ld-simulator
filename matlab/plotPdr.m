clear all;
close all;

east_aodv = getPdr('east', 'aodv');
east_aodv_ld_d = getPdr('east', 'aodv-ld-d');
east_aodv_ld_s = getPdr('east', 'aodv-ld-s');

figure;
hold on;
plot(east_aodv, 'o-', 'LineWidth', 2);
plot(east_aodv_ld_d, 'o-', 'LineWidth', 2);
plot(east_aodv_ld_s, 'o-', 'LineWidth', 2);


%%

clear all;
close all;

east_aodv = getPdr('west', 'aodv');
east_aodv_ld_d = getPdr('west', 'aodv-ld-d');
east_aodv_ld_s = getPdr('west', 'aodv-ld-s');

figure;
hold on;
plot(east_aodv, 'o-', 'LineWidth', 2);
plot(east_aodv_ld_d, 'o-', 'LineWidth', 2);
plot(east_aodv_ld_s, 'o-', 'LineWidth', 2);