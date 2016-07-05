#pragma once
#include <string>
#include <vector>

enum DIFF_TYPE{
    DIFF_EQUAL, DIFF_INSERT, DIFF_REMOVE
};

class DIFF_INFO{
public:
    DIFF_INFO(std::wstring _text, DIFF_TYPE _type){
        text = _text;
        type = _type;
    };
    std::wstring text;
    DIFF_TYPE type;
};

std::vector<DIFF_INFO*> diffString(const std::wstring text1, const std::wstring text2);
std::vector<DIFF_INFO*> diffCompute(std::vector<std::wstring> words1, std::vector<std::wstring> words2);
std::vector<std::wstring> splitString(const std::wstring str);
int diff_commonPrefix(std::vector<std::wstring> words1, std::vector<std::wstring> words2);
int diff_commonSuffix(std::vector<std::wstring> words1, std::vector<std::wstring> words2);