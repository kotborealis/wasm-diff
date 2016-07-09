CC := g++
BIN := bin/
TARGET := libvoiddiff.so
COPY_TARGET := web/
CFLAGS := -std=c++11 -Ofast -march=native

all: libvoiddiff copy_lib

libvoiddiff:
	@mkdir -p $(BIN)
	@echo " Building libdiff"
	g++ $(CFLAGS) -shared -fPIC src/diff_c.c src/diff.cpp -o $(BIN)$(TARGET)

copy_lib:
	cp $(BIN)$(TARGET) $(COPY_TARGET)$(TARGET)

clean:
	@echo " Cleaning..."; 
	$(RM) $(BIN)$(TARGET)
	$(RM) $(COPY_TARGET)$(TARGET)

.PHONY: clean