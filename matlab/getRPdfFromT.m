function [x,y] = getRPdfFromT(pdf_x, pdf_y, c)
y = [];

for i=1:length(pdf_x)
    r = pdf_x(i);
    pdfVal = 0;
    for j=2:length(pdf_x)
        if pdf_x(j-1)<= c+r
            if pdf_x(j)>= c+r
                pdfVal = pdf_y(j);
            end
        end
    end
    y(end+1) = pdfVal * (c+r);
end

y = y / sum(y);
x = pdf_x;
end

