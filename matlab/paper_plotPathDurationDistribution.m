clear all;
close all;
set_defaults;

east_aodv = getPathDurations('east', 'aodv', version) / 1000;
east_aodv_ld_d = getPathDurations('east', 'aodv-ld-d', version)/ 1000;
east_aodv_ld_s = getPathDurations('east', 'aodv-ld-s', version)/ 1000;
west_aodv = getPathDurations('west', 'aodv', version)/ 1000;
west_aodv_ld_d = getPathDurations('west', 'aodv-ld-d', version)/ 1000;
west_aodv_ld_s = getPathDurations('west', 'aodv-ld-s', version)/ 1000;

fig = figure('units','normalized','outerposition',[0 0 0.85 0.75]);
subplot(1,2,1);
hold on;
grid on;
[y,x] = ecdf(east_aodv);
plot(x,1-y, 'LineWidth', line_width, 'Color', color_aodv);
[y,x] = ecdf(east_aodv_ld_d);
plot(x,1-y, 'LineWidth', line_width, 'Color', color_aodv_ld_d);
[y,x] = ecdf(east_aodv_ld_s);
plot(x,1-y, 'LineWidth', line_width, 'Color', color_aodv_ld_s);
axis([0 4000 0 1])
title('Path Duration CCDF, Eastbound', 'Interpreter','latex');
ylabel('CCDF');
legend('AODV', 'AODV-LD (Deterministic)', 'AODV-LD (Stochastic)', 'Interpreter', 'latex');
xlabel('Path Duration [s]')
set(gca,'FontSize', font_size);
set(0, 'defaultTextInterpreter', 'latex');
set(gca, 'TickLabelInterpreter', 'latex');


subplot(1,2,2);
hold on;
grid on;
[y,x] = ecdf(west_aodv);
plot(x,1-y, 'LineWidth', line_width, 'Color', color_aodv);
[y,x] = ecdf(west_aodv_ld_d);
plot(x,1-y, 'LineWidth', line_width, 'Color', color_aodv_ld_d);
[y,x] = ecdf(west_aodv_ld_s);
plot(x,1-y, 'LineWidth', line_width, 'Color', color_aodv_ld_s);
axis([0 4000 0 1])
title('Path Duration CCDF, Westbound', 'Interpreter','latex');
ylabel('CCDF');
legend('AODV', 'AODV-LD (Deterministic)', 'AODV-LD (Stochastic)', 'Interpreter', 'latex');
xlabel('Path Duration [s]')
set(gca,'FontSize', font_size);
set(0, 'defaultTextInterpreter', 'latex');
set(gca, 'TickLabelInterpreter', 'latex');

saveas(fig,['../figures/path_durations_ccdf_v' version '.png']);
saveas(fig,['../figures/path_durations_ccdf_v' version '.fig']);
saveas(fig,['../figures/path_durations_ccdf_v' version '.eps'], 'epsc');