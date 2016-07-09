#pragma once
#include <string>
#include <vector>

enum DIFF_TYPE{
    DIFF_EQUAL, DIFF_INSERT, DIFF_REMOVE
};

class DIFF_INFO{
public:
    DIFF_INFO(std::string _text, DIFF_TYPE _type){
        text = _text;
        type = _type;
    };
    std::string text;
    DIFF_TYPE type;
};

std::vector<DIFF_INFO*> diffString(const std::string text1, const std::string text2);
std::vector<DIFF_INFO*> diffMain(std::vector<std::string>& words1, std::vector<std::string>& words2);
std::vector<DIFF_INFO*> diffCompute(std::vector<std::string>& words1, std::vector<std::string>& words2);
std::vector<DIFF_INFO*> diffBisect(std::vector<std::string>& words1, std::vector<std::string>& words2);
std::vector<DIFF_INFO*> diffBisectSplit(std::vector<std::string>& text1, std::vector<std::string>& text2, int x, int y);
std::vector<std::string> splitString(const std::string& str);
int diff_commonPrefix(std::vector<std::string>& words1, std::vector<std::string>& words2);
int diff_commonSuffix(std::vector<std::string>& words1, std::vector<std::string>& words2);
