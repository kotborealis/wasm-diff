#include <iostream>
#include "diff.h"
#include "ReadFile.h"
#include <vector>
#include <string>

using namespace std;
int main(int argc, char** argv){
    if(argc<3){
        return 0;
    }
    setlocale(LC_ALL, "");
    std::string o = ReadFileToString(argv[1]);
    std::string n = ReadFileToString(argv[2]);
    std::vector<DIFF_INFO*> diff = diffString(o,n);

    std::cout<<"[";
    int it;
    for(it = 0; it < diff.size()-1; it++){
        DIFF_TYPE type = diff[it]->type;
        std::string str = diff[it]->text;
        if(str=="\n")str="\\n";
        switch(type){
            case DIFF_EQUAL:
                std::cout<<"[0,\""<<str<<"\"],";
                break;
            case DIFF_INSERT:
                std::cout<<"[1,\""<<str<<"\"],";
                break;
            case DIFF_REMOVE:
                std::cout<<"[-1,\""<<str<<"\"],";
                break;
        }
    }
    DIFF_TYPE type = diff[it]->type;
    std::string str = diff[it]->text;
    if(str=="\n")str="\\n";
    switch(type){
        case DIFF_EQUAL:
            std::cout<<"[0,\""<<str<<"\"]";
            break;
        case DIFF_INSERT:
            std::cout<<"[1,\""<<str<<"\"]";
            break;
        case DIFF_REMOVE:
            std::cout<<"[-1,\""<<str<<"\"]";
            break;
    }
    std::cout<<"]";
    return 0;
}