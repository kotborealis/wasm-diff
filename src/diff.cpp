#include "diff.h"
#include <algorithm>
#include <iostream>
/**
 * Обёртка над главной функцией для удобного вызова
 * принимает две строки, внтури сплитает их на слова
 * И вызывает на них диффМейн
 */
std::vector<DIFF_INFO*> diffString(const std::string text1, const std::string text2){
    std::vector<std::string> words1 = splitString(text1);
    std::vector<std::string> words2 = splitString(text2);

    return diffMain(words1, words2);
}

/**
 * Главная функция
 * Принимает два массива слов
 * Возвращает массив из ДИФФ_ИНФО
 */
std::vector<DIFF_INFO*> diffMain(std::vector<std::string> words1, std::vector<std::string> words2){
    std::vector<DIFF_INFO*> diff;

    bool equal = words1.size() == words2.size();
    for(int i = 0; i < words1.size() && equal; i++)
            equal = words1[i] == words2[i];
    if(equal){
        for(int i = 0; i < words1.size(); i++)
            diff.push_back(new DIFF_INFO(words1[i],DIFF_EQUAL));
        return diff;
    }

    //длина общего префикса
    int common_len_prefix = diff_commonPrefix(words1, words2);
    //схороняем общий префикс
    std::vector<std::string> common_prefix = std::vector<std::string>(words1.begin(),words1.begin()+common_len_prefix);
    //обрезаем общий префикс
    std::vector<std::string> words1_chop = std::vector<std::string>(words1.begin()+common_len_prefix,words1.end());
    std::vector<std::string> words2_chop = std::vector<std::string>(words2.begin()+common_len_prefix,words2.end());
    //длина общего суффикса (ищем общий суффикс уже из обрезанного)
    int common_len_suffix = diff_commonSuffix(words1_chop, words2_chop);
    //схороняем общий суффикс
    std::vector<std::string> common_suffix = std::vector<std::string>(words1_chop.end()-common_len_suffix,words1_chop.end());
    //обрезаем общий суффикс
    words1_chop = std::vector<std::string>(words1_chop.begin(),words1_chop.end()-common_len_suffix);
    words2_chop = std::vector<std::string>(words2_chop.begin(),words2_chop.end()-common_len_suffix);
    diff = diffCompute(words1_chop,words2_chop);

    if(common_prefix.size()>0){
        /**
         * Скажите привет костылям
         * Если не реверсить вектор, то он будет добавлен в обратном порядке
         * Мне лень уже переделывать этот мерзкий for
         * Пусть останется так.
         */
        std::reverse(common_prefix.begin(),common_prefix.end());
        for(auto it = common_prefix.begin(); it != common_prefix.end(); it++)
            diff.insert(diff.begin(),new DIFF_INFO(*it,DIFF_EQUAL));
    }

    if(common_suffix.size()>0)
        for(auto it = common_suffix.begin(); it != common_suffix.end(); it++)
            diff.push_back(new DIFF_INFO(*it,DIFF_EQUAL));

    return diff;
}

/**
 * Проверяет пару простейших случаев
 * и вызывает диффБиссект
 */
std::vector<DIFF_INFO*> diffCompute(std::vector<std::string> words1, std::vector<std::string> words2){
    std::vector<DIFF_INFO*> diff;

    if(words1.size()==0){
        for(auto it = words2.begin(); it != words2.end(); it++)
            diff.push_back(new DIFF_INFO(*it,DIFF_INSERT));
        return diff;
    }
    if(words2.size()==0){
        for(auto it = words1.begin(); it != words1.end(); it++)
            diff.push_back(new DIFF_INFO(*it,DIFF_REMOVE));
        return diff;
    }

    return diffBisect(words1, words2);
}

/**
 * https://neil.fraser.name/writing/diff/
 * https://neil.fraser.name/software/diff_match_patch/svn/trunk/demos/demo_diff.html
 * http://code.google.com/p/google-diff-match-patch/
 * Привет копипаст
 * Скопированая и переделанная под дифф по словам функция из ссылок сверху
 *
 * Функция находит общую часть в середине двух массивов слов и делает дифф
 * по словам до и после этой части
 */
std::vector<DIFF_INFO*> diffBisect(std::vector<std::string> text1, std::vector<std::string> text2){
    const int text1_length = text1.size();
    const int text2_length = text2.size();
    const int max_d = (text1_length + text2_length + 1) / 2;
    const int v_offset = max_d;
    const int v_length = 2 * max_d;
    int *v1 = new int[v_length];
    int *v2 = new int[v_length];
    for (int x = 0; x < v_length; x++) {
        v1[x] = -1;
        v2[x] = -1;
    }
    v1[v_offset + 1] = 0;
    v2[v_offset + 1] = 0;
    const int delta = text1_length - text2_length;

    const bool front = (delta % 2 != 0);

    int k1start = 0;
    int k1end = 0;
    int k2start = 0;
    int k2end = 0;

    for (int d = 0; d < max_d; d++) {
      // Walk the front path one step.
      for (int k1 = -d + k1start; k1 <= d - k1end; k1 += 2) {
        const int k1_offset = v_offset + k1;
        int x1;
        if (k1 == -d || (k1 != d && v1[k1_offset - 1] < v1[k1_offset + 1])) {
          x1 = v1[k1_offset + 1];
        } else {
          x1 = v1[k1_offset - 1] + 1;
        }
        int y1 = x1 - k1;
        while (x1 < text1_length && y1 < text2_length
            && text1[x1] == text2[y1]) {
          x1++;
          y1++;
        }
        v1[k1_offset] = x1;
        if (x1 > text1_length) {
          // Ran off the right of the graph.
          k1end += 2;
        } else if (y1 > text2_length) {
          // Ran off the bottom of the graph.
          k1start += 2;
        } else if (front) {
          int k2_offset = v_offset + delta - k1;
          if (k2_offset >= 0 && k2_offset < v_length && v2[k2_offset] != -1) {
            // Mirror x2 onto top-left coordinate system.
            int x2 = text1_length - v2[k2_offset];
            if (x1 >= x2) {
              // Overlap detected.
              delete [] v1;
              delete [] v2;
              return diffBisectSplit(text1, text2, x1, y1);
            }
          }
        }
      }

      // Walk the reverse path one step.
      for (int k2 = -d + k2start; k2 <= d - k2end; k2 += 2) {
        const int k2_offset = v_offset + k2;
        int x2;
        if (k2 == -d || (k2 != d && v2[k2_offset - 1] < v2[k2_offset + 1])) {
          x2 = v2[k2_offset + 1];
        } else {
          x2 = v2[k2_offset - 1] + 1;
        }
        int y2 = x2 - k2;
        while (x2 < text1_length && y2 < text2_length
            && text1[text1_length - x2 - 1] == text2[text2_length - y2 - 1]) {
          x2++;
          y2++;
        }
        v2[k2_offset] = x2;
        if (x2 > text1_length) {
          // Ran off the left of the graph.
          k2end += 2;
        } else if (y2 > text2_length) {
          // Ran off the top of the graph.
          k2start += 2;
        } else if (!front) {
          int k1_offset = v_offset + delta - k2;
          if (k1_offset >= 0 && k1_offset < v_length && v1[k1_offset] != -1) {
            int x1 = v1[k1_offset];
            int y1 = v_offset + x1 - k1_offset;
            // Mirror x2 onto top-left coordinate system.
            x2 = text1_length - x2;
            if (x1 >= x2) {
              // Overlap detected.
              delete [] v1;
              delete [] v2;
              return diffBisectSplit(text1, text2, x1, y1);
            }
          }
        }
      }
    }
    delete [] v1;
    delete [] v2;

    std::vector<DIFF_INFO*> diff;
    for(auto it = text1.begin(); it != text1.end(); it++)
        diff.push_back(new DIFF_INFO(*it,DIFF_REMOVE));
    for(auto it = text2.begin(); it != text2.end(); it++)
        diff.push_back(new DIFF_INFO(*it,DIFF_INSERT));

    return diff;
}

/**
 * Часть функции diffBissect
 * Принимает два массива слов и координаты общей части в них
 * Распилывает эти массивы по две части
 * И пускает их в диффМейн, рекурсия, жа.
 */
std::vector<DIFF_INFO*> diffBisectSplit(std::vector<std::string> text1, std::vector<std::string> text2, int x, int y){
    std::vector<std::string> text1a = std::vector<std::string>(text1.begin(),text1.begin()+x);
    std::vector<std::string> text2a = std::vector<std::string>(text2.begin(),text2.begin()+y);

    std::vector<std::string> text1b;
    if(text1.size()==x)
        text1b = std::vector<std::string>();
    else
        text1b = std::vector<std::string>(text1.begin()+x,text1.end());

    std::vector<std::string> text2b;
    if(text2.size()==x)
        text2b = std::vector<std::string>();
    else
        text2b = std::vector<std::string>(text2.begin()+y,text2.end());

    std::vector<DIFF_INFO*> diff_a = diffMain(text1a, text2a);
    std::vector<DIFF_INFO*> diff_b = diffMain(text1b, text2b);     

    diff_a.insert(diff_a.end(),diff_b.begin(),diff_b.end());
    return diff_a;
}

/**
 * Сплитает строку на слова, сохраняя разделители (прилепляются к концу слов)
 */
std::vector<std::string> splitString(const std::string str){
    std::vector<std::string> tokens;
    tokens.push_back("");
    for(auto it = str.begin(); it != str.end(); it++){
        tokens[tokens.size()-1] = tokens[tokens.size()-1]+=*it;
        if(*it == ' ' || *it == '\n')
            tokens.push_back("");
    }
    return tokens;
}

/**
 * Находит размер общего префикса в словах
 */
int diff_commonPrefix(std::vector<std::string> words1, std::vector<std::string> words2){
    int n = std::min(words1.size(), words2.size());

    for(int i = 0; i < n; i++)
        if(words1[i] != words2[i])
            return i;
    return n;
}

/**
 * Находит размер общего суффикса в словах
 */
int diff_commonSuffix(std::vector<std::string> words1, std::vector<std::string> words2){
    int words1_len = words1.size();
    int words2_len = words2.size();
    int n = std::min(words1_len, words2_len);

    for(int i = 1; i <= n; i++)
        if(words1[words1_len - i] != words2[words2_len - i])
            return i - 1;
    return n;
}