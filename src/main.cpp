#include <iostream>
#include "diff.h"
#include "ReadFile.h"
#include <vector>
#include <string>

using namespace std;
int main(int argc, char** argv){
    setlocale(LC_ALL, "");
    wstring o = ReadFileToWString("./tests/test1a");
    wstring n = ReadFileToWString("./tests/test1b");
    std::vector<DIFF_INFO*> diff = diffString(o,n);

    for(auto it = diff.begin();it!=diff.end();it++){
        if((*it)->type==DIFF_EQUAL)
            std::wcout<<(*it)->text;
        else if((*it)->type==DIFF_REMOVE)
            std::wcout<<L'-'<<(*it)->text;
        else if((*it)->type==DIFF_INSERT)
            std::wcout<<L'+'<<(*it)->text;
    }
    return 0;
}