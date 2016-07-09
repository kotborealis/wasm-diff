CC := g++
TARGET_LIB := bin/libvoiddiff.so
CFLAGS := -std=c++11 -Ofast -march=native

libdiff:
	@mkdir -p bin
	@echo " Building libdiff"
	g++ $(CFLAGS) -shared -fPIC src/diff_c.c src/diff.cpp -o $(TARGET_LIB)

clean:
	@echo " Cleaning..."; 
	$(RM) $(TARGET_LIB)

.PHONY: clean