clear all;
close all;

linkDurationsA2Awest = getLinkDurationsA2A('west', 'aodv');
linkDurationsA2Aeast = getLinkDurationsA2A('east', 'aodv');
linkDurationsA2Gwest = getLinkDurationsA2G('west', 'aodv');
linkDurationsA2Geast = getLinkDurationsA2G('east', 'aodv');

fig = figure('units','normalized','outerposition',[0 0 1 1]);
subplot(2,1,1);
histogram(linkDurationsA2Aeast / 1000, 0:60:16000, 'Normalization', 'Probability');
hold on;
histogram(linkDurationsA2Geast / 1000, 0:60:16000, 'Normalization', 'Probability');
axis([0 16000 0 0.09])
title('Link Durations Eastbound', 'Interpreter','latex')
xlabel('Duration [s]', 'Interpreter','latex');
legend('A2A', 'A2G', 'Interpreter', 'latex');
ylabel('Probability');
set(gca,'FontSize', 20);
set(0, 'defaultTextInterpreter', 'latex');
set(gca, 'TickLabelInterpreter', 'latex');

subplot(2,1,2);
histogram(linkDurationsA2Awest / 1000, 0:60:16000, 'Normalization', 'Probability');
hold on;
histogram(linkDurationsA2Gwest / 1000, 0:60:16000, 'Normalization', 'Probability');
axis([0 16000 0 0.09])
title('Link Durations Westbound', 'Interpreter','latex')
xlabel('Duration [s]', 'Interpreter','latex');
legend('A2A', 'A2G', 'Interpreter', 'latex');
ylabel('Probability');
set(gca,'FontSize', 20);
set(0, 'defaultTextInterpreter', 'latex');
set(gca, 'TickLabelInterpreter', 'latex');


% v_east = 960 / 3600;
% v_west = 880/ 3600;
% v = v_west
% d = 99;
% R = 400;
% 
% 
% s0 = 800;
% s1 = 2 * sqrt(R^2-d^2);
% s2 = 2 * sqrt(R^2-4*d^2);
% s3 = 2 * sqrt(R^2-9*d^2);
% s4 = 2 * sqrt(R^2-16*d^2);
% 
% plot([s0/v s0/v], [0, 0.2], 'k');
% plot([s1/v s1/v], [0, 0.2], 'k');
% plot([s2/v s2/v], [0, 0.2], 'k');
% plot([s3/v s3/v], [0, 0.2], 'k');
% plot([s4/v s4/v], [0, 0.2], 'k');
