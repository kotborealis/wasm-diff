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

    for(auto it = diff.begin(); it != diff.end(); it++){
    	auto type = (*it)->type;
    	auto text = (*it)->text;
    	switch(type){
    		case DIFF_EQUAL:
    			std::cout<<text;
    			break;
			case DIFF_INSERT:
    			std::cout<<"+"<<text;
    			break;
			case DIFF_REMOVE:
    			std::cout<<"-"<<text;
    			break;
    	}
    }
    std::cout<<std::endl;

    return 0;
}