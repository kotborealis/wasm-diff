#include "ReadFile.h"
#include <string>
#include <fstream>
#include <sstream>
#include <iostream>

std::string ReadFileToString(std::string filename){
    std::string str;
    std::string c;
    std::ifstream stream(filename.c_str());
    
    if(!stream){
        std::cout<<"No such file: "<<filename.c_str()<<"\n";
        return str;
    }

    stream.imbue(std::locale(""));
    while(std::getline(stream,c))
        str+=c+"\n";

    stream.close();
    return str;
}