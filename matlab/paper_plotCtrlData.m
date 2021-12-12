clear all;
close all;
set_defaults;

[pdrEastAodv_l, pdrEastAodv_m, pdrEastAodv_h] = getCI(getCtrlDataBytes('east', 'aodv', version) / 10^6);
[pdrEastAodvLdD_l, pdrEastAodvLdD_m, pdrEastAodvLdD_h] = getCI(getCtrlDataBytes('east', 'aodv-ld-d', version)/ 10^6);
[pdrEastAodvLdS_l, pdrEastAodvLdS_m, pdrEastAodvLdS_h] = getCI(getCtrlDataBytes('east', 'aodv-ld-s', version)/ 10^6);
[pdrWestAodv_l, pdrWestAodv_m, pdrWestAodv_h] = getCI(getCtrlDataBytes('west', 'aodv', version)/ 10^6);
[pdrWestAodvLdD_l, pdrWestAodvLdD_m, pdrWestAodvLdD_h] = getCI(getCtrlDataBytes('west', 'aodv-ld-d', version)/ 10^6);
[pdrWestAodvLdS_l, pdrWestAodvLdS_m, pdrWestAodvLdS_h] = getCI(getCtrlDataBytes('west', 'aodv-ld-s', version)/ 10^6);

fig = figure('units','normalized','outerposition',[0 0 0.85 1]);
subplot(1,2,1);
hold on;
grid on;
errorbar(1, pdrEastAodv_m, pdrEastAodv_l, pdrEastAodv_h, 'o', 'LineWidth', line_width, 'CapSize', cap_size, 'Color', color_aodv, 'MarkerSize', marker_size);
errorbar(2, pdrEastAodvLdD_m, pdrEastAodvLdD_l, pdrEastAodvLdD_h, 'o', 'LineWidth', line_width, 'CapSize', cap_size, 'Color', color_aodv_ld_d, 'MarkerSize', marker_size);
errorbar(3, pdrEastAodvLdS_m, pdrEastAodvLdS_l, pdrEastAodvLdS_h, 'o', 'LineWidth', line_width, 'CapSize', cap_size, 'Color', color_aodv_ld_s, 'MarkerSize', marker_size);

axis([0.5 3.5 0 25])
xticks([1,2,3])
xticklabels({'AODV', '\begin{tabular}{c} AODV-LD \\ (Deterministic) \end{tabular}', '\begin{tabular}{c} AODV-LD \\ (Stochastic) \end{tabular}'})
title('Control Data, Eastbound', 'Interpreter','latex');
ylabel('Control Data [MB]');
set(gca,'FontSize', font_size);
set(0, 'defaultTextInterpreter', 'latex');
set(gca, 'TickLabelInterpreter', 'latex');


subplot(1,2,2);
hold on;
grid on;
errorbar(1, pdrWestAodv_m, pdrWestAodv_l, pdrWestAodv_h, 'o', 'LineWidth', line_width, 'CapSize', cap_size, 'Color', color_aodv_light, 'MarkerSize', marker_size);
errorbar(2, pdrWestAodvLdD_m, pdrWestAodvLdD_l, pdrWestAodvLdD_h, 'o', 'LineWidth', line_width, 'CapSize', cap_size, 'Color', color_aodv_ld_d_light, 'MarkerSize', marker_size);
errorbar(3, pdrWestAodvLdS_m, pdrWestAodvLdS_l, pdrWestAodvLdS_h, 'o', 'LineWidth', line_width, 'CapSize', cap_size,'Color', color_aodv_ld_s_light, 'MarkerSize', marker_size);

axis([0.5 3.5 0 25])
xticks([1,2,3])
xticklabels({'AODV', '\begin{tabular}{c} AODV-LD \\ (Deterministic) \end{tabular}', '\begin{tabular}{c} AODV-LD \\ (Stochastic) \end{tabular}'})
title('Control Data, Westbound', 'Interpreter','latex')
ylabel('Control Data [MB]');
set(gca,'FontSize', font_size);
set(0, 'defaultTextInterpreter', 'latex');
set(gca, 'TickLabelInterpreter', 'latex');

saveas(fig,['../figures/ctrl_data_v' version '.png']);
saveas(fig,['../figures/ctrl_data_v' version '.fig']);
saveas(fig,['../figures/ctrl_data_v' version '.eps'], 'epsc');