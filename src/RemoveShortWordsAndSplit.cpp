#include "RemoveShortWordsAndSplit.h"
#include <vector>
#include <string>
#include <iostream>
using namespace std;
vector<wstring> RemoveShortWordsAndSplit(wstring str, int len){
	wstring symbols = L",:;()<>\" \'!@#$^&`*+=-/\\?.~";
	vector<wstring> v;
	v.push_back(L"");

	int j = 0;
	for (auto it = str.begin(); it != str.end(); ++it)
	{
		bool check = false;
		for (auto i = symbols.begin(); i != symbols.end(); ++i)
			if (*i == *it)
			{
				v.push_back(L"");
				j++;
				check = true;
			}
		if (!check)
			v[j] += *it;
		else
			continue;
	}
	for (auto it = v.begin(); it != v.end();)
	 {
	     if( (*it).size() <= len) 
	         it = v.erase(it);
	     else 
	         ++it;
	 }

	return v;
}