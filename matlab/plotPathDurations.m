clear all;
close all;

east_aodv = getAvgPathDuration('east', 'aodv');
east_aodv_ld_d = getAvgPathDuration('east', 'aodv-ld-d');
east_aodv_ld_s = getAvgPathDuration('east', 'aodv-ld-s');

figure;
hold on;
plot(east_aodv, 'o-', 'LineWidth', 2);
plot(east_aodv_ld_d, 'o-', 'LineWidth', 2);
plot(east_aodv_ld_s, 'o-', 'LineWidth', 2);


%%

clear all;
close all;

east_aodv = getAvgPathDuration('west', 'aodv');
east_aodv_ld_d = getAvgPathDuration('west', 'aodv-ld-d');
east_aodv_ld_s = getAvgPathDuration('west', 'aodv-ld-s');

figure;
hold on;
plot(east_aodv, 'o-', 'LineWidth', 2);
plot(east_aodv_ld_d, 'o-', 'LineWidth', 2);
plot(east_aodv_ld_s, 'o-', 'LineWidth', 2);
