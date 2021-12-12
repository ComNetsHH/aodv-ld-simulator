clear all;
close all;

ld = getLinkDurationsA2G('east', 'aodv') / 1000;
[y,x] = histcounts(ld, 0:10:4000, 'Normalization','Probability');
x = x(2:end) - (x(2)-x(1))/2;

v = [];
for tau=0:100:4000
[x2,y2] = getRPdfFromT(x,y, tau);
v(end+1) = sum(x2 .* y2);
end
figure;
hold on;
plot(0:100:4000,v);