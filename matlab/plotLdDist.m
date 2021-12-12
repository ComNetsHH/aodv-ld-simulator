clear all;
close all;

p = [];
t = [];

x = [];



a2g_east = getData('../src/data/link_durations_A2G_east.json')

for i=1:length(a2g_east)
    p(end+1) = a2g_east(i).p;
    t(end+1) = a2g_east(i).t;
end


plot(t,p)
hold on;

for j =0:1:100
    
    pr = [];
    c_idx = j;
    c = 60000*j;

    for i=1:length(t)
        tc = t(i);

        f = 0;
        if(c_idx+i <= length(p))
            f = p(c_idx+i);
        end
        

        pr(end+1) = f * (c + tc);

    end

    pr = pr / sum(pr);
    
    x(end+1) = sum(pr .* t);

    plot(t,pr)

end

    
figure;
plot((0:1:100) *60, x)


%%
figure;
histogram(e/1000, -3000:100:3000);
hold on;
histogram(e2/1000, -3000:100:3000);

