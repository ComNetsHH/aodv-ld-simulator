clear all;
close all;
set_defaults;

data_east_aodv = getCtrlDataChannelAccess('east', 'aodv', version);
data_east_aodv_ld_d = getCtrlDataChannelAccess('east', 'aodv-ld-d', version);
data_east_aodv_ld_s = getCtrlDataChannelAccess('east', 'aodv-ld-s', version);

data_west_aodv = getCtrlDataChannelAccess('west', 'aodv', version);
data_west_aodv_ld_d = getCtrlDataChannelAccess('west', 'aodv-ld-d', version);
data_west_aodv_ld_s = getCtrlDataChannelAccess('west', 'aodv-ld-s', version);

[caEastAodv_l, caEastAodv_m, caEastAodv_h] = getCI(data_east_aodv ./ data_east_aodv * 100);
[caEastAodvLdD_l, caEastAodvLdD_m, caEastAodvLdD_h] = getCI(data_east_aodv_ld_d ./ data_east_aodv * 100);
[caEastAodvLdS_l, caEastAodvLdS_m, caEastAodvLdS_h] = getCI(data_east_aodv_ld_s ./ data_east_aodv * 100);
[caWestAodv_l, caWestAodv_m, caWestAodv_h] = getCI(data_west_aodv ./ data_west_aodv * 100);
[caWestAodvLdD_l, caWestAodvLdD_m, caWestAodvLdD_h] = getCI(data_west_aodv_ld_d ./ data_west_aodv * 100);
[caWestAodvLdS_l, caWestAodvLdS_m, caWestAodvLdS_h] = getCI(data_west_aodv_ld_s ./ data_west_aodv * 100);

data_east_aodv = getCtrlDataBytes('east', 'aodv', version);
data_east_aodv_ld_d = getCtrlDataBytes('east', 'aodv-ld-d', version);
data_east_aodv_ld_s = getCtrlDataBytes('east', 'aodv-ld-s', version);

data_west_aodv = getCtrlDataBytes('west', 'aodv', version);
data_west_aodv_ld_d = getCtrlDataBytes('west', 'aodv-ld-d', version);
data_west_aodv_ld_s = getCtrlDataBytes('west', 'aodv-ld-s', version);

[cdEastAodv_l, cdEastAodv_m, cdEastAodv_h] = getCI(data_east_aodv ./ data_east_aodv * 100);
[cdEastAodvLdD_l, cdEastAodvLdD_m, cdEastAodvLdD_h] = getCI(data_east_aodv_ld_d ./ data_east_aodv * 100);
[cdEastAodvLdS_l, cdEastAodvLdS_m, cdEastAodvLdS_h] = getCI(data_east_aodv_ld_s ./ data_east_aodv * 100);
[cdWestAodv_l, cdWestAodv_m, cdWestAodv_h] = getCI(data_west_aodv ./ data_west_aodv * 100);
[cdWestAodvLdD_l, cdWestAodvLdD_m, cdWestAodvLdD_h] = getCI(data_west_aodv_ld_d ./ data_west_aodv * 100);
[cdWestAodvLdS_l, cdWestAodvLdS_m, cdWestAodvLdS_h] = getCI(data_west_aodv_ld_s ./ data_west_aodv * 100);


fig = figure('units','normalized','outerposition',[0 0 0.85 0.75]);

hold on;
grid on;

errorbar(cdEastAodvLdD_m - 100, caEastAodvLdD_m - 100, cdEastAodvLdD_l, cdEastAodvLdD_h, caEastAodvLdD_l, caEastAodvLdD_h , 'o', 'LineWidth', line_width, 'CapSize', cap_size, 'Color', color_aodv_ld_d, 'MarkerSize', marker_size);
errorbar(cdEastAodvLdS_m - 100, caEastAodvLdS_m -100, cdEastAodvLdS_l, cdEastAodvLdS_h, caEastAodvLdS_l, caEastAodvLdS_h , 'o', 'LineWidth', line_width, 'CapSize', cap_size, 'Color', color_aodv_ld_s, 'MarkerSize', marker_size);

errorbar(cdWestAodvLdD_m - 100, caWestAodvLdD_m - 100, cdWestAodvLdD_l, cdWestAodvLdD_h, caWestAodvLdD_l, caWestAodvLdD_h , 'o', 'LineWidth', line_width, 'CapSize', cap_size, 'Color', color_aodv_ld_d_light, 'MarkerSize', marker_size);
errorbar(cdWestAodvLdS_m - 100, caWestAodvLdS_m -100, cdWestAodvLdS_l, cdWestAodvLdS_h, caWestAodvLdS_l, caWestAodvLdS_h , 'o', 'LineWidth', line_width, 'CapSize', cap_size, 'Color', color_aodv_ld_s_light, 'MarkerSize', marker_size);


legend('Deterministic, East', 'Stochastic, East', 'Deterministic, West', 'Stochastic, West', 'Interpreter', 'latex')
%errorbar(1, pdrWestAodvLdD_m -100, pdrWestAodvLdD_l, pdrWestAodvLdD_h, 'o', 'LineWidth', line_width, 'CapSize', cap_size, 'Color', color_aodv_ld_d);
%errorbar(2, pdrWestAodvLdS_m -100, pdrWestAodvLdS_l, pdrWestAodvLdS_h, 'o', 'LineWidth', line_width, 'CapSize', cap_size,'Color', color_aodv_ld_s);

axis([-20 120 -60 0])
%xticks([1,2,3])
%xticklabels({'\begin{tabular}{c} AODV-LD \\ (Deterministic) \end{tabular}', '\begin{tabular}{c} AODV-LD \\ (Stochastic) \end{tabular}'})
title('Control Data, Westbound', 'Interpreter','latex');
ylabel('Change in \# Packets [\%]');
xlabel('Change in Data Size [\%]');
set(gca,'FontSize', font_size);
set(0, 'defaultTextInterpreter', 'latex');
set(gca, 'TickLabelInterpreter', 'latex');

saveas(fig,['../figures/ctrl_data_comparison_v' version '.png']);
saveas(fig,['../figures/ctrl_data_comparison_v' version '.fig']);
saveas(fig,['../figures/ctrl_data_comparison_v' version '.eps'], 'epsc');