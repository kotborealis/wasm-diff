#include "ReadFile.h"
#include <string>
#include <fstream>
#include <sstream>
#include <iostream>

std::wstring ReadFileToWString(std::string filename){
    std::wifstream stream(filename.c_str());
    if(!stream)
        std::wcout<<L"ты чо даун\n";
    stream.imbue(std::locale(""));

    std::wstring str;
    std::wstring c;
    while(std::getline(stream,c))
        str+=c+L" \n";

    stream.close();
    return str;
}