clear all;
close all;
set_defaults;

ld = getLinkDurationsA2G('east', 'aodv') / 1000;

pd_east_ldd = getPathDurations('east', 'aodv-ld-d') / 1000;
pd_east_lds = getPathDurations('east', 'aodv-ld-s') / 1000;

pd_east_ldd_e = getExpectedPathDurations('east', 'aodv-ld-d') / 1000;
pd_east_lds_e = getExpectedPathDurations('east', 'aodv-ld-s') / 1000;

fig = figure('units','normalized','outerposition', [0 0 1 1]);
hold on;
grid on;
histogram(ld, 0:20:4000, 'Normalization', 'Probability', 'DisplayStyle', 'stairs', 'Linewidth', 2, 'EdgeColor', color_aodv);

histogram(pd_east_ldd, 0:20:4000, 'Normalization', 'Probability', 'DisplayStyle', 'stairs', 'Linewidth', 2, 'EdgeColor', color_aodv_ld_d);
histogram(pd_east_lds, 0:20:4000, 'Normalization', 'Probability', 'DisplayStyle', 'stairs', 'Linewidth', 2, 'EdgeColor', color_aodv_ld_s);

histogram(pd_east_ldd_e, 0:20:4000, 'Normalization', 'Probability', 'DisplayStyle', 'stairs', 'Linewidth', 2, 'LineStyle', ':', 'EdgeColor', color_aodv_ld_d);
histogram(pd_east_lds_e, 0:20:4000, 'Normalization', 'Probability', 'DisplayStyle', 'stairs', 'Linewidth', 2, 'LineStyle', ':', 'EdgeColor', color_aodv_ld_s);

plot([mean(ld), mean(ld)], [0,1], 'LineWidth', 2, 'Color', color_aodv);
[y,x] = histcounts(ld, 0:20:4000, 'Normalization','Probability');
x = x(2:end) - (x(2)-x(1))/2;
[x,y] = getRPdf(x,y);
m = sum(x.*y);
plot([mean(ld), mean(ld)], [0,1], 'LineWidth', 2, 'Color', color_aodv);
plot([m,m], [0,1], ':', 'LineWidth', 2, 'Color', color_aodv);

plot(x, y, ':', 'LineWidth', 2, 'Color', color_aodv);

plot([mean(pd_east_ldd), mean(pd_east_ldd)], [0,1], 'LineWidth', 2, 'Color', color_aodv_ld_d);
plot([mean(pd_east_lds), mean(pd_east_lds)], [0,1], 'LineWidth', 2, 'Color', color_aodv_ld_s);
plot([mean(pd_east_ldd_e), mean(pd_east_ldd_e)], [0,1],':', 'LineWidth', 2, 'Color', color_aodv_ld_d);
plot([mean(pd_east_lds_e), mean(pd_east_lds_e)], [0,1],':', 'LineWidth', 2, 'Color', color_aodv_ld_s);
legend('Link Durations A2G', 'Deterministic', 'Stochastic', 'Deterministic Expected', 'Stochastic Expected', 'Interpreter', 'latex');
title('Link/Path Durations');
xlabel('Duration [s]');
ylabel('Probability')
set(gca,'FontSize', font_size);
set(0, 'defaultTextInterpreter', 'latex');
set(gca, 'TickLabelInterpreter', 'latex');

axis([0 4000 0 0.04]);
