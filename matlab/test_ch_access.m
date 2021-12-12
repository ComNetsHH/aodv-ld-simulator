clear all;
close all;
set_defaults;

dir = 'east';

aodv = getCtrlDataChannelAccess(dir, 'aodv', version);
aodv_ld_d = getCtrlDataChannelAccess(dir, 'aodv-ld-d', version);
aodv_ld_s = getCtrlDataChannelAccess(dir, 'aodv-ld-s', version); 

figure;
hold on;
%plot(aodv./aodv);
histogram(aodv_ld_d./aodv);
histogram(aodv_ld_s./aodv);


x = aodv_ld_d./aodv;

mean(x(x > 0))