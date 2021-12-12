clear all;
close all;
set_defaults;

data_east_aodv = getCtrlDataBytes('east', 'aodv', version);
data_east_aodv_ld_d = getCtrlDataBytes('east', 'aodv-ld-d', version);
data_east_aodv_ld_s = getCtrlDataBytes('east', 'aodv-ld-s', version);

data_west_aodv = getCtrlDataBytes('west', 'aodv', version);
data_west_aodv_ld_d = getCtrlDataBytes('west', 'aodv-ld-d', version);
data_west_aodv_ld_s = getCtrlDataBytes('west', 'aodv-ld-s', version);

[pdrEastAodv_l, pdrEastAodv_m, pdrEastAodv_h] = getCI(data_east_aodv ./ data_east_aodv * 100);
[pdrEastAodvLdD_l, pdrEastAodvLdD_m, pdrEastAodvLdD_h] = getCI(data_east_aodv_ld_d ./ data_east_aodv * 100);
[pdrEastAodvLdS_l, pdrEastAodvLdS_m, pdrEastAodvLdS_h] = getCI(data_east_aodv_ld_s ./ data_east_aodv * 100);
[pdrWestAodv_l, pdrWestAodv_m, pdrWestAodv_h] = getCI(data_west_aodv ./ data_west_aodv * 100);
[pdrWestAodvLdD_l, pdrWestAodvLdD_m, pdrWestAodvLdD_h] = getCI(data_west_aodv_ld_d ./ data_west_aodv * 100);
[pdrWestAodvLdS_l, pdrWestAodvLdS_m, pdrWestAodvLdS_h] = getCI(data_west_aodv_ld_s ./ data_west_aodv * 100);

fig = figure('units','normalized','outerposition',[0 0 0.85 1]);
subplot(1,2,1);
hold on;
grid on;
errorbar(1, pdrEastAodvLdD_m - 100, pdrEastAodvLdD_l, pdrEastAodvLdD_h, 'o', 'LineWidth', line_width, 'CapSize', cap_size, 'Color', color_aodv_ld_d, 'MarkerSize', marker_size);
errorbar(2, pdrEastAodvLdS_m - 100, pdrEastAodvLdS_l, pdrEastAodvLdS_h, 'o', 'LineWidth', line_width, 'CapSize', cap_size, 'Color', color_aodv_ld_s, 'MarkerSize', marker_size);

axis([0.5 2.5 -50 150])
xticks([1,2,3])
xticklabels({'\begin{tabular}{c} AODV-LD \\ (Deterministic) \end{tabular}', '\begin{tabular}{c} AODV-LD \\ (Stochastic) \end{tabular}'})
title('Control Data, Eastbound', 'Interpreter','latex');
ylabel('Change in Control Data Size [\%]');
set(gca,'FontSize', font_size);
set(0, 'defaultTextInterpreter', 'latex');
set(gca, 'TickLabelInterpreter', 'latex');


subplot(1,2,2);
hold on;
grid on;
errorbar(1, pdrWestAodvLdD_m - 100, pdrWestAodvLdD_l, pdrWestAodvLdD_h, 'o', 'LineWidth', line_width, 'CapSize', cap_size, 'Color', color_aodv_ld_d, 'MarkerSize', marker_size);
errorbar(2, pdrWestAodvLdS_m - 100, pdrWestAodvLdS_l, pdrWestAodvLdS_h, 'o', 'LineWidth', line_width, 'CapSize', cap_size,'Color', color_aodv_ld_s, 'MarkerSize', marker_size);

axis([0.5 2.5 -50 150])
xticks([1,2,3])
xticklabels({'\begin{tabular}{c} AODV-LD \\ (Deterministic) \end{tabular}', '\begin{tabular}{c} AODV-LD \\ (Stochastic) \end{tabular}'})
title('Control Data, Westbound', 'Interpreter','latex')
ylabel('Change in Control Data Size [\%]');
set(gca,'FontSize', font_size);
set(0, 'defaultTextInterpreter', 'latex');
set(gca, 'TickLabelInterpreter', 'latex');

saveas(fig,['../figures/ctrl_data_percentage_v' version '.png']);
saveas(fig,['../figures/ctrl_data_percentage_v' version '.fig']);
saveas(fig,['../figures/ctrl_data_percentage_v' version '.eps'], 'epsc');