#include "ReadFile.h"
#include <string>
#include <fstream>
#include <sstream>
#include <iostream>

std::wstring ReadFileToWString(std::string filename){
    std::wstring str;
    std::wstring c;
    std::wifstream stream(filename.c_str());
    
    if(!stream){
        std::wcout<<L"No such file: "<<filename<<L"\n";
        return str;
    }

    stream.imbue(std::locale(""));
    while(std::getline(stream,c))
        str+=c+L" \n";

    stream.close();
    return str;
}