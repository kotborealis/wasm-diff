#include "canon.h"

#include <cctype>
#include <string>
#include <algorithm>

using namespace std;

/**
 * Принимает встринг
 * Выдаёт встринг в каноническом виде
 * Т.е. только из некоторых согласных букв в нижнем кейсе и пробелов (см. canonLower)
 *
 * FIXME: По возможности, убрать костыль и приводить строку к ловеркейсу (?)
 */
std::wstring canonize(std::wstring str){
    std::wstring canonUpper = L"БВГДЖЗКЛМНПРСТФХЦЧШ ";
    std::wstring canonLower = L"бвгджзклмнпрстфхцчш ";
    std::wstring ret = L"";

    for(auto it = str.begin(); it != str.end(); it++){
        bool foundInLowerCase = false;
        for(auto jt = canonLower.begin(); jt != canonLower.end(); jt++){
            if(*jt == *it){
                ret+=*it;
                //Костыли-костылики
                //Если буква нашлась в ловервейке каноне
                //то юзаем её
                foundInLowerCase = true;
                break;
            }
        }
        if(foundInLowerCase)//Буква нашлась в ловеркейсе, идём дальше
            continue;

        else{//Буква не нашлась в ловеркейсе, ищем в апперкейсе
            int UpperCaseCharPos = 0;
            for(auto jt = canonUpper.begin(); jt != canonUpper.end(); jt++){
                if(*jt == *it){
                    ret+=canonLower[UpperCaseCharPos];
                    break;
                }
                UpperCaseCharPos++;
            }
        }
    }

    return ret;
}