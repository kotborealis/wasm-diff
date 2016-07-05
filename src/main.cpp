#include <iostream>
#include "diff.h"
#include <vector>
#include <string>
using namespace std;
int main(int argc, char** argv){
    setlocale(LC_ALL, "");
    wstring o = L"1 vyf! 2 3 4 5 6 7";
    wstring n = L"1 2 3 4 5 6 7";
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