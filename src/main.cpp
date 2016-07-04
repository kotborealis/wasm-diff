#include <iostream>
#include "RemoveShortWordsAndSplit.h"
#include <vector>
#include <string>
using namespace std;
int main(int argc, char** argv){
    setlocale(LC_ALL, "");
    wstring str = L"Ыфвфывфыв фыюыв& фыв? фывююыфвыф. Ффвыфвыфвыфв! фывыфвыфв. Фывфывфыв.";
    vector<wstring> v = RemoveShortWordsAndSplit(str, 5);
    for (auto i = v.begin(); i != v.end(); ++i)
    	wcout << *i << L" ";

    return 0;
}