function [data] = getData(file)
    fid = fopen(file);
    raw = fread(fid,inf);
	str = char(raw');
	fclose(fid);
	data = jsondecode(str);

