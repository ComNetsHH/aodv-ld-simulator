clear all;
close all;

options = weboptions('Timeout', 30000);

deltaT = 60;

startTime = 1391209200;
endTime = startTime + 5 * 24 * 60 * deltaT;

minLat = 40;
maxLat = 70;
minLng = -55;
maxLng = -5;
set_defaults;

data = webread('https://skyhigh-api.konradfuger.de/time_series', ...
	'startTime', startTime, ...
	'endTime', endTime, ...
	'minLat', minLat, ...
	'maxLat', maxLat, ...
	'minLng', minLng, ...
	'maxLng', maxLng, ...
	'deltaT', deltaT, ...
	'nac', 1, ...
	options);

t = startTime + (0:length(data.west_bound)-1) * deltaT;

fig = figure('units','normalized','outerposition',[0 0 0.85 0.5]);
hold on;
plot(t,data.west_bound, 'LineWidth', 2, 'Color', '#3F88C5');
plot(t,data.east_bound, 'LineWidth', 2, 'Color', '#DE3C4B');
grid on;
legend('Westbound', 'Eastbound',  'Interpreter', 'latex')
title('Number of Aircraft');
%xlabel('Time [s]')
ylabel('\# Aircraft')
set(gca,'FontSize', font_size);
set(0, 'defaultTextInterpreter', 'latex');
set(gca, 'TickLabelInterpreter', 'latex');

oneDay = 3600*24;

xticks([startTime startTime+oneDay startTime+oneDay*2 startTime+oneDay*3 startTime+oneDay*4 startTime+oneDay*5])
xticklabels({ '01.02.2014', '02.02.2014', '03.02.2014', '04.02.2014', '05.02.2014', '06.02.2014'})
%axis([0 4160*60 0 300])

saveas(fig,'../figures/time_series.png');
saveas(fig,'../figures/time_series.fig');
saveas(fig,'../figures/time_series.eps', 'epsc');



