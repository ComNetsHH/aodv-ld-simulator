function [x,y] = getRPdf(pdf_x,pdf_y)
y = [];

for i=1:length(pdf_x)
    r = pdf_x(i);
    y(end+1) = sum(pdf_y(pdf_x >= r));
end

y = y / sum(y);
x = pdf_x;
end

