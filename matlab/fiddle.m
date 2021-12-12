clear all;
close all;

pdrs = [
    getData('../server_results/v100/east/aodv/summary-4h-0.json').pdr
    getData('../server_results/v100/east/aodv/summary-4h-1.json').pdr
    getData('../server_results/v100/east/aodv/summary-4h-2.json').pdr
    getData('../server_results/v100/east/aodv/summary-4h-3.json').pdr
    getData('../server_results/v100/east/aodv/summary-4h-4.json').pdr
    getData('../server_results/v100/east/aodv/summary-4h-5.json').pdr
    getData('../server_results/v100/east/aodv/summary-4h-6.json').pdr
    getData('../server_results/v100/east/aodv/summary-4h-7.json').pdr
    getData('../server_results/v100/east/aodv/summary-4h-8.json').pdr
    getData('../server_results/v100/east/aodv/summary-4h-9.json').pdr
    getData('../server_results/v100/east/aodv/summary-4h-10.json').pdr
    getData('../server_results/v100/east/aodv/summary-4h-11.json').pdr
    getData('../server_results/v100/east/aodv/summary-4h-12.json').pdr
    getData('../server_results/v100/east/aodv/summary-4h-13.json').pdr
    getData('../server_results/v100/east/aodv/summary-4h-14.json').pdr
    getData('../server_results/v100/east/aodv/summary-4h-15.json').pdr
    getData('../server_results/v100/east/aodv/summary-4h-16.json').pdr
    getData('../server_results/v100/east/aodv/summary-4h-17.json').pdr
    getData('../server_results/v100/east/aodv/summary-4h-18.json').pdr
    getData('../server_results/v100/east/aodv/summary-4h-19.json').pdr
    getData('../server_results/v100/east/aodv/summary-4h-20.json').pdr
    getData('../server_results/v100/east/aodv/summary-4h-21.json').pdr
    getData('../server_results/v100/east/aodv/summary-4h-22.json').pdr
    getData('../server_results/v100/east/aodv/summary-4h-23.json').pdr
    getData('../server_results/v100/east/aodv/summary-4h-24.json').pdr
    getData('../server_results/v100/east/aodv/summary-4h-25.json').pdr
];

pd = fitdist(pdrs, 'Normal');

ci = paramci(pd);
m = mean(pd);

figure;
hold on;
errorbar(0, m, ci(1)-m, ci(2)-m ,'o','LineWidth', 2);

pdrs = [
    getData('../server_results/v100/east/aodv-ld-d/summary-4h-0.json').pdr
    getData('../server_results/v100/east/aodv-ld-d/summary-4h-1.json').pdr
    getData('../server_results/v100/east/aodv-ld-d/summary-4h-2.json').pdr
    getData('../server_results/v100/east/aodv-ld-d/summary-4h-3.json').pdr
    getData('../server_results/v100/east/aodv-ld-d/summary-4h-4.json').pdr
    getData('../server_results/v100/east/aodv-ld-d/summary-4h-5.json').pdr
    getData('../server_results/v100/east/aodv-ld-d/summary-4h-6.json').pdr
    getData('../server_results/v100/east/aodv-ld-d/summary-4h-7.json').pdr
    getData('../server_results/v100/east/aodv-ld-d/summary-4h-8.json').pdr
    getData('../server_results/v100/east/aodv-ld-d/summary-4h-9.json').pdr
    getData('../server_results/v100/east/aodv-ld-d/summary-4h-10.json').pdr
    getData('../server_results/v100/east/aodv-ld-d/summary-4h-11.json').pdr
    getData('../server_results/v100/east/aodv-ld-d/summary-4h-12.json').pdr
    getData('../server_results/v100/east/aodv-ld-d/summary-4h-13.json').pdr
    getData('../server_results/v100/east/aodv-ld-d/summary-4h-14.json').pdr
    getData('../server_results/v100/east/aodv-ld-d/summary-4h-15.json').pdr
    getData('../server_results/v100/east/aodv-ld-d/summary-4h-16.json').pdr
    getData('../server_results/v100/east/aodv-ld-d/summary-4h-17.json').pdr
    getData('../server_results/v100/east/aodv-ld-d/summary-4h-18.json').pdr
    getData('../server_results/v100/east/aodv-ld-d/summary-4h-19.json').pdr
    getData('../server_results/v100/east/aodv-ld-d/summary-4h-20.json').pdr
    getData('../server_results/v100/east/aodv-ld-d/summary-4h-21.json').pdr
    getData('../server_results/v100/east/aodv-ld-d/summary-4h-22.json').pdr
    getData('../server_results/v100/east/aodv-ld-d/summary-4h-23.json').pdr
    getData('../server_results/v100/east/aodv-ld-d/summary-4h-24.json').pdr
    getData('../server_results/v100/east/aodv-ld-d/summary-4h-25.json').pdr
];

pd = fitdist(pdrs, 'Normal');

ci = paramci(pd);
m = mean(pd);
errorbar(1, m, ci(1)-m, ci(2)-m ,'o','LineWidth', 2);


%%

pdrs = [
    getData('../server_results/v100/east/aodv-ld-d/summary-4h-0.json').pdr
    getData('../server_results/v100/east/aodv-ld-d/summary-4h-1.json').pdr
    getData('../server_results/v100/east/aodv-ld-d/summary-4h-2.json').pdr
    getData('../server_results/v100/east/aodv-ld-d/summary-4h-3.json').pdr
    getData('../server_results/v100/east/aodv-ld-d/summary-4h-4.json').pdr
    getData('../server_results/v100/east/aodv-ld-d/summary-4h-5.json').pdr
    getData('../server_results/v100/east/aodv-ld-d/summary-4h-6.json').pdr
    getData('../server_results/v100/east/aodv-ld-d/summary-4h-7.json').pdr
    getData('../server_results/v100/east/aodv-ld-d/summary-4h-8.json').pdr
    getData('../server_results/v100/east/aodv-ld-d/summary-4h-9.json').pdr
    getData('../server_results/v100/east/aodv-ld-d/summary-4h-10.json').pdr
    getData('../server_results/v100/east/aodv-ld-d/summary-4h-11.json').pdr
    getData('../server_results/v100/east/aodv-ld-d/summary-4h-12.json').pdr
    getData('../server_results/v100/east/aodv-ld-d/summary-4h-13.json').pdr
    getData('../server_results/v100/east/aodv-ld-d/summary-4h-14.json').pdr
    getData('../server_results/v100/east/aodv-ld-d/summary-4h-15.json').pdr
    getData('../server_results/v100/east/aodv-ld-d/summary-4h-16.json').pdr
    getData('../server_results/v100/east/aodv-ld-d/summary-4h-17.json').pdr
    getData('../server_results/v100/east/aodv-ld-d/summary-4h-18.json').pdr
    getData('../server_results/v100/east/aodv-ld-d/summary-4h-19.json').pdr
    getData('../server_results/v100/east/aodv-ld-d/summary-4h-20.json').pdr
    getData('../server_results/v100/east/aodv-ld-d/summary-4h-21.json').pdr
    getData('../server_results/v100/east/aodv-ld-d/summary-4h-22.json').pdr
    getData('../server_results/v100/east/aodv-ld-d/summary-4h-23.json').pdr
    getData('../server_results/v100/east/aodv-ld-d/summary-4h-24.json').pdr
    getData('../server_results/v100/east/aodv-ld-d/summary-4h-25.json').pdr
];

%%

d = getData('../src/data/link_durations_A2G_east.json');

plot()
