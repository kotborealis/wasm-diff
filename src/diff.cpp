#include "diff.h"
#include <algorithm>
#include <iostream>


std::vector<DIFF_INFO*> diffString(const std::wstring text1, const std::wstring text2){
    std::vector<std::wstring> words1 = splitString(text1);
    std::vector<std::wstring> words2 = splitString(text2);

    std::vector<DIFF_INFO*> diff;

    bool equal = words1.size() == words2.size();
    for(int i = 0; i < words1.size() && equal; i++)
            equal = words1[i] == words2[i];
    if(equal){
        for(int i = 0; i < words1.size(); i++)
            diff.push_back(new DIFF_INFO(words1[i],DIFF_EQUAL));
        return diff;
    }

    int common_len_prefix = diff_commonPrefix(words1, words2);
    std::vector<std::wstring> common_prefix = std::vector<std::wstring>(words1.begin(),words1.begin()+common_len_prefix);

    int common_len_suffix = diff_commonSuffix(words1, words2);
    std::vector<std::wstring> common_suffix = std::vector<std::wstring>(words1.end()-common_len_suffix,words1.end());

    std::vector<std::wstring> words1_chop = std::vector<std::wstring>(words1.begin()+common_len_prefix,words1.end()-common_len_suffix);
    std::vector<std::wstring> words2_chop = std::vector<std::wstring>(words2.begin()+common_len_prefix,words2.end()-common_len_suffix);

    diff = diffCompute(words1_chop,words2_chop);

    if(common_prefix.size()>0)
        for(auto it = common_prefix.begin(); it != common_prefix.end(); it++)
            diff.insert(diff.begin(),new DIFF_INFO(*it,DIFF_EQUAL));

    if(common_suffix.size()>0)
        for(auto it = common_suffix.begin(); it != common_suffix.end(); it++)
            diff.push_back(new DIFF_INFO(*it,DIFF_EQUAL));


    return diff;
}

std::vector<DIFF_INFO*> diffCompute(std::vector<std::wstring> words1, std::vector<std::wstring> words2){
    std::vector<DIFF_INFO*> diff;

    if(words1.size()==0){
        for(auto it = words2.begin(); it != words2.end(); it++){
            diff.push_back(new DIFF_INFO(*it,DIFF_INSERT));
        }
        return diff;
    }
    if(words2.size()==0){
        for(auto it = words1.begin(); it != words1.end(); it++)
            diff.push_back(new DIFF_INFO(*it,DIFF_REMOVE));
        return diff;
    }
}

std::vector<std::wstring> splitString(const std::wstring str){
    std::vector<std::wstring> tokens;
    tokens.push_back(L"");
    for(auto it = str.begin(); it != str.end(); it++){
        tokens[tokens.size()-1] = tokens[tokens.size()-1]+=*it;
        if(*it == L' ' || *it == L'\n')
            tokens.push_back(L"");
    }
    return tokens;
}

/**
 * Находит общий префикс в двух массивах
 */
int diff_commonPrefix(std::vector<std::wstring> words1, std::vector<std::wstring> words2){
    int n = std::min(words1.size(), words2.size());

    for(int i = 0; i < n; i++)
        if(words1[i] != words2[i])
            return i;
    return n;
}

/**
 * находит общий суффикс в двух строках
 */
int diff_commonSuffix(std::vector<std::wstring> words1, std::vector<std::wstring> words2){
    int words1_len = words1.size();
    int words2_len = words2.size();
    int n = std::min(words1_len, words2_len);

    for(int i = 1; i <= n; i++)
        if(words1[words1_len - i] != words2[words2_len - i])
            return i - 1;
    return n;
}