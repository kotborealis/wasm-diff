#include "SplitSentences.h"
vector<wstring> SplitSentence(wstring str){
	int j = 0;
	vector<wstring> sentences;
	sentences.push_back(L"");
	
	for (auto it = str.begin(); it != str.end(); it++){
		sentences[j] += *it;
		if (*it == '.'){
			sentences.push_back(L"");
			j++;
		}
	}
	return sentences;
} 