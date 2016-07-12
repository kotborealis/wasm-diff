#include <string>
#include <vector>
#include "diff.h"

extern "C" {
	typedef struct{
		const char* text;
		int type;
	} __DIFF_INFO;

	__DIFF_INFO** __diffString(const char* a, const char* b, int detail){
		std::vector<DIFF_INFO*> diff = diffString(std::string(a),std::string(b),detail);
		int diff_size = diff.size();
		__DIFF_INFO** nodejs_diff = new __DIFF_INFO*[diff_size+1];

		nodejs_diff[0] = new __DIFF_INFO;
		nodejs_diff[0]->type = diff_size;
		nodejs_diff[0]->text = "";

		for(int i=0;i<diff_size;i++){
			int type;
			switch(diff[i]->type){
				case DIFF_EQUAL:
					type = 0;
					break;
				case DIFF_INSERT:
					type = 1;
					break;
				case DIFF_REMOVE:
					type = -1;
					break;
			}

			nodejs_diff[i+1] = new __DIFF_INFO;
			nodejs_diff[i+1]->type = type;
			nodejs_diff[i+1]->text = diff[i]->text.c_str();
		}
		return nodejs_diff;
	}
}