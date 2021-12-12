function [low, mean, high] = getCI(array)

    pd = fitdist(array', 'Normal');
    ci = paramci(pd, 'Alpha',.05);
    
    mean = pd.mu;
    low = ci(1) - mean;
    high = ci(2) - mean;
end

