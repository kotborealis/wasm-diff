#include <string>
#include <vector>
#include "diff.h"

extern "C" {
	typedef struct{
		const char* text;
		int type;
	} __DIFF_INFO;

	__DIFF_INFO** __diffString(const char* a, const char* b){
		std::vector<DIFF_INFO*> diff = diffString(std::string(a),std::string(b));
		__DIFF_INFO** nodejs_diff = new __DIFF_INFO*[diff.size()+1];

		nodejs_diff[0] = new __DIFF_INFO;
		nodejs_diff[0]->type = diff.size();
		nodejs_diff[0]->text = "";
		for(int i=0;i<diff.size();i++){
			nodejs_diff[i+1] = new __DIFF_INFO;
			nodejs_diff[i+1]->type = diff[i]->type;
			nodejs_diff[i+1]->text = diff[i]->text.c_str();
		}
		return nodejs_diff;
	}
}