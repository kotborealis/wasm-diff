#include <iostream>
#include "SplitSentences.h"
#include <vector>
#include <string>
using namespace std;
int main(int argc, char** argv){
    setlocale(LC_ALL, "");
    wstring str = L"ЙЙЙЙЙЙЙЙ. йцвйцвйцв. йцу.йц.в.йцв.йцв.йц.в. цйцвцЦЦВЦЙвйцвцйв.";
    vector<wstring> v = SplitSentence(str);
    for (auto i = v.begin(); i != v.end(); ++i)
    	wcout << *i << L"\n";

    return 0;
}