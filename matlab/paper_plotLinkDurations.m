clear all;
close all;
set_defaults;

linkDurationsA2Awest = getLinkDurationsA2A('west', 'aodv', version);
linkDurationsA2Aeast = getLinkDurationsA2A('east', 'aodv', version);
linkDurationsA2Gwest = getLinkDurationsA2G('west', 'aodv', version);
linkDurationsA2Geast = getLinkDurationsA2G('east', 'aodv', version);

fig = figure('units','normalized','outerposition',[0 0 0.85 1]);
subplot(2,1,1);
histogram(linkDurationsA2Aeast / 1000, 0:60:18000, 'Normalization', 'Probability', 'FaceColor', color_aodv_ld_d);
hold on;
grid on;
histogram(linkDurationsA2Geast / 1000, 0:60:18000, 'Normalization', 'Probability', 'FaceColor', color_aodv_ld_s);
axis([0 18000 0 0.1])
title('Link Durations Eastbound', 'Interpreter','latex')
xlabel('Duration [s]', 'Interpreter','latex');
legend('A2A', 'A2G', 'Interpreter', 'latex');
ylabel('Probability');
set(gca,'FontSize', font_size);
set(0, 'defaultTextInterpreter', 'latex');
set(gca, 'TickLabelInterpreter', 'latex');

subplot(2,1,2);
histogram(linkDurationsA2Awest / 1000, 0:60:18000, 'Normalization', 'Probability', 'FaceColor', color_aodv_ld_d);
hold on;
grid on;
histogram(linkDurationsA2Gwest / 1000, 0:60:18000, 'Normalization', 'Probability', 'FaceColor', color_aodv_ld_s);
axis([0 18000 0 0.1])
title('Link Durations Westbound', 'Interpreter','latex')
xlabel('Duration [s]', 'Interpreter','latex');
legend('A2A', 'A2G', 'Interpreter', 'latex');
ylabel('Probability');
set(gca,'FontSize', font_size);
set(0, 'defaultTextInterpreter', 'latex');
set(gca, 'TickLabelInterpreter', 'latex');


saveas(fig,['../figures/link_durations_v' version '.png']);
saveas(fig,['../figures/link_durations_v' version '.fig']);
saveas(fig,['../figures/link_durations_v' version '.eps'], 'epsc');
