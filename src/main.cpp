#include <iostream>
#include "diff.h"
#include "ReadFile.h"
#include <vector>
#include <string>

using namespace std;
int main(int argc, char** argv){
    setlocale(LC_ALL, "");
    std::string o = ReadFileToString("./tests/test1a");
    std::string n = ReadFileToString("./tests/test1b");
    std::vector<DIFF_INFO*> diff = diffString(o,n);

    for(auto it = diff.begin();it!=diff.end();it++){
        if((*it)->type==DIFF_EQUAL)
            std::cout<<(*it)->text;
        else if((*it)->type==DIFF_REMOVE)
            if((*it)->text!="\n" && (*it)->text!=" ")
                std::cout<<'-'<<(*it)->text;
            else
                std::cout<<(*it)->text;
        else if((*it)->type==DIFF_INSERT)
            if((*it)->text!="\n" && (*it)->text!=" ")
                std::cout<<'+'<<(*it)->text;
            else
                std::cout<<(*it)->text;
    }
    return 0;
}