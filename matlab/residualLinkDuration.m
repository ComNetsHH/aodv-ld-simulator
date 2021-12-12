t = 0:1:19;
p = ones(1,20) * 1/20;
pr = [];
pr_2 = [];


c = 10;

for time = 0:1:9
    pr(end+1) = p(time + c);
    K = 0;
    for i = c:length(p)
        K = K + p(i) * i;
    end
    K = 1/K;
    
    S = 0;
    for j = time:length(p)-1
        S = S + p(j+1)
    end
    pr_2(end+1) = K*S;
end

plot(t,p)
hold on;
plot(0:1:9,pr / sum(pr))
plot(0:1:9,pr_2)


%%
t = 0:19;
p = ones(1,20) * 1/20;
pr = [];

for time = 0:19
    K = 0;
    for i = 1:length(p)-1
        K = K + p(i) * i;
    end
    K = 1/K;
    
    S = 0;
    for j = time:length(p)-1
        S = S + p(j+1)
    end
    pr(end+1) = K*S;
end

plot(t,p);
hold on;
plot(t, pr);


%%

[pdf_x,xi] = ksdensity(linkDurationsA2Geast);
% The bin width. (In this case, they are all equal, so I just take the first one.)
dx = xi(2) - xi(1);
% Calculate the total probability. (It should be 1.)
total_probability = sum(pdf_x*dx)
% Calculate the mean, which is the expected value of x.
mean_x = sum(xi.*pdf_x*dx)